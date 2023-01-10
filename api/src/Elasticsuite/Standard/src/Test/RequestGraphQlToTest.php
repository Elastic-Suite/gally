<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Test;

use Elasticsuite\User\Model\User;

/**
 * @codeCoverageIgnore
 */
class RequestGraphQlToTest extends RequestToTest
{
    public function __construct(
        string $query,
        ?User $user,
        array $headers = [],
    ) {
        parent::__construct(
            'POST',
            '/graphql',
            $user,
            ['operationName' => null, 'query' => $query, 'variables' => []],
            $headers
        );
    }
}
