<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\Service;

class Dummy implements DummyInterface
{
    /**
     * {@inheritdoc}
     */
    public function getMapping(): array
    {
        return [
            'attributes' => [
                'sku' => 'string',
                'description' => 'string',
                'category' => 'category',
                'created_at' => 'date',
            ],
        ];
    }
}
