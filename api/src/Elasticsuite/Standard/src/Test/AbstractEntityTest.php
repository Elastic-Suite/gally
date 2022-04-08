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

namespace Elasticsuite\Standard\src\Test;

use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use ApiPlatform\Core\Operation\PathSegmentNameGeneratorInterface;

abstract class AbstractEntityTest extends AbstractTest
{
    private PathSegmentNameGeneratorInterface $pathGenerator;
    private ResourceMetadataFactoryInterface $metadataFactory;
    private ?ResourceMetadata $resource = null;

    public function __construct(?string $name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
        $this->pathGenerator = static::getContainer()->get('api_platform.path_segment_name_generator');
        $this->metadataFactory = static::getContainer()->get('api_platform.metadata.resource.metadata_factory');
    }

    public static function setUpBeforeClass(): void
    {
        static::loadFixture(static::getFixtureFiles());
    }

    abstract protected static function getFixtureFiles(): array;

    abstract protected function getEntityClass(): string;

    abstract protected function getJsonCreationValidation(array $validData): array;

    abstract protected function getJsonGetValidation(array $expectedData): array;

    abstract protected function getJsonGetCollectionValidation(): array;

    abstract public function createValidDataProvider(): array;

    abstract public function createInvalidDataProvider(): array;

    abstract public function getDataProvider(): array;

    abstract public function deleteDataProvider(): array;

    protected function getShortName(): string
    {
        if (!$this->resource) {
            $this->resource = $this->metadataFactory->create($this->getEntityClass());
        }

        return $this->resource->getShortName();
    }

    protected function getApiPath(): string
    {
        return '/' . $this->pathGenerator->getSegmentName($this->getShortName());
    }

    /**
     * @dataProvider createValidDataProvider
     */
    public function testCreateValidData(array $validData, string $validRegex = null): void
    {
        $response = $this->requestRest('POST', $this->getApiPath(), $validData);
        $this->assertResponseStatusCodeSame(201);
        $shortName = $this->getShortName();
        $this->assertJsonContains(
            array_merge(
                [
                    '@context' => "/contexts/$shortName",
                    '@type' => $shortName,
                ],
                $this->getJsonCreationValidation($validData)
            )
        );
        $this->assertMatchesRegularExpression($validRegex ?? '~^' . $this->getApiPath() . '/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema($this->getEntityClass());
    }

    /**
     * @dataProvider createInvalidDataProvider
     *
     * @param mixed $message
     * @param mixed $code
     */
    public function testCreateInvalidData(array $invalidData, $message, $code = 422): void
    {
        $response = $this->requestRest('POST', $this->getApiPath(), $invalidData);
        $this->assertResponseStatusCodeSame($code);
        $errorType = 'hydra:Error';
        $errorContext = 'Error';
        if (\array_key_exists('violations', $response->toArray(false))) {
            $errorType = $errorContext = 'ConstraintViolationList';
        }
        $this->assertJsonContains(
            [
                '@context' => '/contexts/' . $errorContext,
                '@type' => $errorType,
                'hydra:title' => 'An error occurred',
                'hydra:description' => $message,
            ]
        );
    }

    /**
     * @dataProvider getDataProvider
     * @depends testCreateValidData
     * @depends testCreateInvalidData
     */
    public function testGet(int|string $id, array $expectedData, int $statusCode): void
    {
        $this->requestRest('GET', "{$this->getApiPath()}/{$id}");
        if ($statusCode >= 400) {
            $this->assertResponseStatusCodeSame($statusCode);
        } else {
            $this->assertResponseIsSuccessful();
            $shortName = $this->getShortName();
            $this->assertJsonContains(
                array_merge(
                    [
                        '@context' => "/contexts/$shortName",
                        '@type' => $shortName,
                        '@id' => $this->getApiPath() . '/' . $expectedData['id'],
                    ],
                    $this->getJsonGetValidation($expectedData)
                )
            );
        }
    }

    /**
     * @dataProvider deleteDataProvider
     * @depends testGet
     */
    public function testDelete(int|string $id, int $statusCode): void
    {
        $this->requestRest('DELETE', "{$this->getApiPath()}/{$id}");
        if ($statusCode >= 400) {
            $this->assertResponseStatusCodeSame($statusCode);
        } else {
            $this->assertResponseIsSuccessful();
        }
    }

    /**
     * @depends testDelete
     */
    public function testGetCollection(): void
    {
        $this->requestRest('GET', $this->getApiPath());
        $this->assertResponseIsSuccessful();
        $shortName = $this->getShortName();
        $this->assertJsonContains(
            array_merge(
                [
                    '@context' => "/contexts/$shortName",
                    '@id' => $this->getApiPath(),
                    '@type' => 'hydra:Collection',
                ],
                $this->getJsonGetCollectionValidation()
            )
        );
    }
}
