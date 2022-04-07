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

abstract class AbstractEntityTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        static::loadFixture(static::getFixtureFiles());
    }

    abstract protected static function getFixtureFiles(): array;

    abstract protected function getEntityClass(): string;

    abstract protected function getApiPath(): string;

    abstract protected function getJsonCreationValidation(array $validData): array;

    abstract protected function getJsonGetValidation(array $expectedData): array;

    abstract protected function getJsonGetCollectionValidation(): array;

    public function createValidDataProvider(): array
    {
        return [];
    }

    public function createInvalidDataProvider(): array
    {
        return [];
    }

    public function getDataProvider(): array
    {
        return [];
    }

    public function deleteDataProvider(): array
    {
        return [];
    }

    /**
     * @dataProvider createValidDataProvider
     */
    public function testCreateValidData(array $validData, string $validRegex = null): void
    {
        $response = $this->requestRest('POST', $this->getApiPath(), $validData);
        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains($this->getJsonCreationValidation($validData));
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
            $this->assertJsonContains($this->getJsonGetValidation($expectedData));
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
        $this->assertJsonContains($this->getJsonGetCollectionValidation());
    }
}
