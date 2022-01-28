<?php

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

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getHealth(): string
    {
        return $this->health;
    }
}
