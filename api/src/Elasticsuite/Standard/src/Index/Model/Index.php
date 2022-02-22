<?php

namespace Elasticsuite\Index\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

#[
    ApiResource(
        collectionOperations: ['get', 'post'],
        itemOperations: ['get', 'delete'],
        paginationEnabled: false,
    ),
]
class Index
{
    #[ApiProperty(
        identifier: true
    )]
    private string $name;

    private string $alias;

    public function __construct(
        string $name,
        string $alias,
    ) {
        $this->name = $name;
        $this->alias = $alias;
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
    public function getAlias(): string
    {
        return $this->alias;
    }

    /**
     * @param string $alias
     */
    public function setAlias(string $alias): void
    {
        $this->alias = $alias;
    }
}
