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

namespace Gally\Search\Tests\Unit\Elasticsearch\Adapter\Common\Response;

use Gally\Search\Model\Document;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class DocumentTest extends KernelTestCase
{
    /**
     * @dataProvider instantiateDocumentDataProvider
     *
     * @param string      $documentId Document ID
     * @param string      $indexName  Index name
     * @param string|null $docType    Document type
     * @param float|null  $score      Document score
     * @param array|null  $source     Document source
     */
    public function testInstantiate(
        string $documentId,
        string $indexName,
        ?string $docType,
        ?float $score,
        ?array $source,
        ?array $additionalData
    ) {
        $documentData = [
            '_id' => $documentId,
            '_index' => $indexName,
            '_type' => $docType,
            '_score' => $score,
            '_source' => $source,
        ];
        $documentData = array_filter(
            $documentData,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        $document = new Document($documentData);

        $this->assertEquals($documentId, $document->getId());
        $this->assertEquals($indexName, $document->getIndex());
        if (null !== $docType) {
            $this->assertEquals($docType, $document->getType());
        } else {
            $this->assertEquals('_doc', $document->getType());
        }
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
                'myIndex',
                '_doc',
                1.0,
                ['field' => 'value'],
                ['some' => ['other' => 'data']],
            ],
            [
                '2',
                'myOtherIndex',
                'deprecated_type',
                1.1,
                ['field1' => 'value1', 'field2' => 'value2'],
                ['some' => ['yet' => ['other' => 'data']]],
            ],
            [
                'La2Zp4ABuOhxRrxyUe2a',
                'theIndex',
                null,
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
                'theIndex',
                null,
                null,
                null,
                null,
            ],
        ];
    }
}
