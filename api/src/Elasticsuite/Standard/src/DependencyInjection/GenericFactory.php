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

namespace Elasticsuite\DependencyInjection;

class GenericFactory
{
    public function __construct(protected ?string $instanceName = null)
    {
    }

    public function create(array $data = [])
    {
        if (null === $this->instanceName) {
            throw new \InvalidArgumentException('Class to instantiate is not defined');
        }

        return new $this->instanceName(...$data);
    }
}
