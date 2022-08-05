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

namespace Elasticsuite\Index\Tests\Api;

use Elasticsuite\Standard\src\Test\AbstractTest;

abstract class AbstractMenuTest extends AbstractTest
{
    protected function menuDataProvider(): array
    {
        $frMenu = [
            'hierarchy' => [
                [
                    'code' => 'catalog',
                    'label' => 'Catalogue',
                    'order' => 10,
                    'children' => [
                        [
                            'code' => 'category',
                            'label' => 'Catégories',
                            'order' => 10,
                        ],
                        [
                            'code' => 'product',
                            'label' => 'Produits',
                            'order' => 20,
                        ],
                    ],
                ],
                [
                    'code' => 'optimizer',
                    'label' => 'Optimiseur',
                    'order' => 20,
                    'css_class' => 'boost',
                ],
                [
                    'code' => 'thesaurus',
                    'label' => 'Thésaurus',
                    'order' => 30,
                ],
            ],
        ];

        $enMenu = [
            'hierarchy' => [
                [
                    'code' => 'catalog',
                    'label' => 'Catalog',
                    'order' => 10,
                    'children' => [
                        [
                            'code' => 'category',
                            'label' => 'Categories',
                            'order' => 10,
                        ],
                        [
                            'code' => 'product',
                            'label' => 'Products',
                            'order' => 20,
                        ],
                    ],
                ],
                [
                    'code' => 'optimizer',
                    'label' => 'Optimizer',
                    'order' => 20,
                    'css_class' => 'boost',
                ],
                [
                    'code' => 'thesaurus',
                    'label' => 'Thesaurus',
                    'order' => 30,
                ],
            ],
        ];

        return [
            ['fr', $frMenu],
            ['fr_FR', $frMenu],
            ['en', $enMenu],
            ['en_US', $enMenu],
        ];
    }
}
