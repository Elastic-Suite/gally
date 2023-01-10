<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\GraphQl\Type\Definition\Filter;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Elasticsuite\GraphQl\Type\Definition\FilterInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Service\ReverseSourceFieldProvider;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class ExistFilterInputType extends InputObjectType implements TypeInterface, FilterInterface
{
    use FilterableFieldTrait;

    public const NAME = 'ExistFilterInput';

    public $name = self::NAME;

    public function __construct(
        private ReverseSourceFieldProvider $reverseSourceFieldProvider,
        private QueryFactory $queryFactory,
    ) {
        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'field' => Type::nonNull(Type::string()),
            ],
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function validate(string $argName, mixed $inputData, ContainerConfigurationInterface $containerConfig): array
    {
        return $this->validateIsFilterable($inputData['field'], $containerConfig);
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
    {
        return $this->queryFactory->create(QueryInterface::TYPE_EXISTS, $inputFilter);
    }
}
