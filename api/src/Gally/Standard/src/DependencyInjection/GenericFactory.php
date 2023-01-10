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

namespace Gally\DependencyInjection;

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

        $class = new \ReflectionClass($this->instanceName);
        $availableParameters = array_map(
            function ($parameter) {
                return $parameter->getName();
            },
            $class->getConstructor()->getParameters()
        );
        $data = array_intersect_key($data, array_flip($availableParameters));

        return new $this->instanceName(...$data);
    }
}
