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

namespace Gally\RuleEngine\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\OpenApi;
use Gally\OpenApi\Helper\Documentation as DocumentationHelper;

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
