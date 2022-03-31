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

namespace Elasticsuite\Index\MutationResolver;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Index\Dto\Bulk;
use Elasticsuite\Index\Model\Index;

class BulkDeleteIndexMutation extends BulkIndexMutation implements MutationResolverInterface
{
    /**
     * @param Index|null $item
     *
     * @return Index
     */
    public function __invoke($item, array $context)
    {
        $index = $this->getIndex($context);
        $request = new Bulk\Request();
        $request->deleteDocuments($index, $context['args']['input']['ids'] ?? []);

        $this->runBulkQuery($index, $request);

        return $index;
    }
}
