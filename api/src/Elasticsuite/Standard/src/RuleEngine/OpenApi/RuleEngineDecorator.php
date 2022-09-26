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

namespace Elasticsuite\RuleEngine\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\OpenApi;
use Elasticsuite\OpenApi\Helper\Documentation as DocumentationHelper;

final class RuleEngineDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private DocumentationHelper $documentationHelper,
        private OpenApiFactoryInterface $decorated,
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        // Remove id parameter added automatically by API Platform
        $this->documentationHelper->removeFieldFromEndpoint($openApi, '/rule_engine_operators', 'id');

        // Remove swagger documentation for the endpoint /rule_engine_graph_ql_filters/{id}.
        $path = $openApi->getPaths()->getPath('/rule_engine_graph_ql_filters/{id}');
        $openApi->getPaths()->addPath('/rule_engine_graph_ql_filters/{id}', $path->withGet(null));

        return $openApi;
    }
}
