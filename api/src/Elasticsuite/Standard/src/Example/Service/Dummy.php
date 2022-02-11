<?php

namespace Elasticsuite\Example\Service;

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
                'created_at' => 'date'
            ]
        ];
    }
}
