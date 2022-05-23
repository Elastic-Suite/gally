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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Response;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class DocumentTest extends KernelTestCase
{
    /**
     * @dataProvider instantiateDocumentDataProvider
     *
     * @param string|null $documentId Document ID
     * @param float|null  $score      Document score
     * @param array|null  $source     Document source
     */
    public function testInstantiate(
        ?string $documentId,
        ?float $score,
        ?array $source,
        ?array $additionalData
    ) {
        $documentData = [
            'id' => $documentId,
            '_score' => $score,
            '_source' => $source,
        ];
        $documentData = array_filter(
            $documentData,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        $document = new Response\Document($documentData);

        $this->assertEquals($documentId, $document->getId());
        if (null !== $score) {
            $this->assertEquals($score, $document->getScore());
        } else {
            $this->assertEquals(0, $document->getScore());
        }
        if (null !== $source) {
            $this->assertEquals($source, $document->getSource());
        } else {
            $this->assertEquals([], $document->getSource());
        }
        if ($additionalData) {
            $documentData = array_merge($documentData, $additionalData);
        }
        $document->setData($documentData);
        $this->assertEquals($documentData, $document->getData());
    }

    public function instantiateDocumentDataProvider(): array
    {
        return [
            [
                '1',
                1.0,
                ['field' => 'value'],
                ['some' => ['other' => 'data']],
            ],
            [
                '2',
                1.1,
                ['field1' => 'value1', 'field2' => 'value2'],
                ['some' => ['yet' => ['other' => 'data']]],
            ],
            [
                'La2Zp4ABuOhxRrxyUe2a',
                null,
                [
                    'field1' => 'value1',
                    'field2' => 'value2',
                    'meta.field' => 'meta.value',
                    'top' => [
                        'field' => 'value',
                    ],
                ],
                [],
            ],
            [
                'Lq2Zp4ABuOhxRrxy2O34',
                null,
                null,
                null,
            ],
        ];
    }
}
