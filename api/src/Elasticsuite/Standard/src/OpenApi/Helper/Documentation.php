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

namespace Elasticsuite\OpenApi\Helper;

use ApiPlatform\Core\Documentation\DocumentationInterface;
use ApiPlatform\Core\OpenApi\Model\Parameter;
use ApiPlatform\Core\OpenApi\OpenApi;

class Documentation
{
    /**
     * Allows to remove a field from swagger documentation.
     */
    public function removeFieldFromEndpoint(DocumentationInterface $openApi, string $endpoint, string $field): void
    {
        /** @var OpenApi $openApi */
        $path = $openApi->getPaths()->getPath($endpoint);
        $parametersWithoutField = [];
        /** @var Parameter $parameter */
        foreach ($path->getGet()->getParameters() as $parameter) {
            if ($field !== $parameter->getName()) {
                $parametersWithoutField[] = $parameter;
            }
        }

        $openApi->getPaths()->addPath(
            $endpoint,
            $path->withGet($path->getGet()->withParameters($parametersWithoutField))
        );
    }
}
