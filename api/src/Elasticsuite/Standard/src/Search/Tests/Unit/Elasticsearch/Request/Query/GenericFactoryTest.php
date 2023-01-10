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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Query;

use Elasticsuite\DependencyInjection\GenericFactory;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class GenericFactoryTest extends KernelTestCase
{
    public function testNullInstanceCreate()
    {
        $genericFactory = new GenericFactory();
        $this->expectException(InvalidArgumentException::class);
        $genericFactory->create();
    }
}
