<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Product\GraphQl\Type\Definition;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use GraphQL\Type\Definition\EnumType;

class ProductRequestTypeEnumType extends EnumType implements TypeInterface
{
    public const NAME = 'ProductRequestTypeEnum';

    public function __construct(private ContainerConfigurationProvider $configurationProvider)
    {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return ['values' => $this->configurationProvider->getAvailableRequestType('product')];
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->name;
    }
}
