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

namespace Elasticsuite\Example\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

#[
    ApiResource(
        collectionOperations: ['get', 'post'],
        itemOperations: ['get', 'delete'],
        paginationEnabled: false,
    ),
]
class ExampleIndex
{
    #[ApiProperty(
        identifier: true
    )]
    private string $name;

    #[ApiProperty(
        description: 'health'
    )]
    private string $health;

    public function __construct(
        string $name,
        string $health = ''
    ) {
        $this->name = $name;
        $this->health = $health;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getHealth(): string
    {
        return $this->health;
    }
}
