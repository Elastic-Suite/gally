<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Search\GraphQl\Type\Definition;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Elasticsuite\GraphQl\Type\Definition\FilterInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use GraphQL\Type\Definition\InputObjectType;

class FieldFilterInputType extends InputObjectType implements TypeInterface, FilterInterface
{
    public const NAME = 'FieldFilterInput';

    /**
     * @param FilterInterface[]  $availableTypes
     * @param FilterQueryBuilder $filterQueryBuilder
     */
    public function __construct(
        private iterable $availableTypes,
        private FilterQueryBuilder $filterQueryBuilder,
    ) {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => array_map(
                fn ($filterType) => ['type' => $filterType],
                $this->availableTypes
            ),
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];
        $config = $this->getConfig();

        foreach ($inputData as $filterInputData) {
            foreach ($filterInputData as $filterType => $data) {
                if (str_contains($filterType, '.')) {
                    // Api platform automatically replace nesting separator by '.',
                    // but it keeps the value with nesting separator. In order to avoid applying
                    // the filter twice, we have to skip the one with the '.'.
                    continue;
                }

                if (!\array_key_exists($filterType, $config['fields'])) {
                    $errors[] = "The filter type {$filterType} is not valid.";
                    continue;
                }

                /** @var FilterInterface $type */
                $type = $config['fields'][$filterType]['type'];
                $errors = array_merge($errors, $type->validate($filterType, $data));
            }
        }

        return $errors;
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig): QueryInterface
    {
        $filters = [];
        $config = $this->getConfig();

        foreach ($inputFilter as $filterType => $data) {
            if (str_contains($filterType, '.')) {
                // Api platform automatically replace nesting separator by '.',
                // but it keeps the value with nesting separator. In order to avoid applying
                // the filter twice, we have to skip the one with the '.'.
                continue;
            }

            /** @var FilterInterface $type */
            $type = $config['fields'][$filterType]['type'];
            if (!\array_key_exists('field', $data)) {
                $data['field'] = $filterType;
            }
            $filters[] = $type->transformToElasticsuiteFilter($data, $containerConfig);
        }

        return $this->filterQueryBuilder->create($containerConfig, $filters);
    }
}
