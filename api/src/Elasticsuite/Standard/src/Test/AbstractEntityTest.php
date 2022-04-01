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
    abstract protected function getEntityClass(): string;

    abstract protected function getApiPath(): string;

    abstract protected function getFixtureFiles(): array;

    abstract protected function getJsonCreationValidation(array $validData): array;

    abstract protected function getJsonCollectionValidation(): array;

    abstract public function validDataProvider(): array;

    abstract public function invalidDataProvider(): array;

    /**
     * @dataProvider validDataProvider
     */
    public function testCreateValidData(array $validData, string $validRegex = null): void
    {
        $this->loadFixture($this->getFixtureFiles());
        $response = $this->requestRest('POST', $this->getApiPath(), $validData);
        $this->assertResponseStatusCodeSame(201);
        $this->assertJsonContains($this->getJsonCreationValidation($validData));
        $this->assertMatchesRegularExpression($validRegex ?? '~^' . $this->getApiPath() . '/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema($this->getEntityClass());
    }

    /**
     * @dataProvider invalidDataProvider
     *
     * @param mixed $message
     * @param mixed $code
     */
    public function testCreateInvalidData(array $invalidData, $message, $code = 422): void
    {
        $this->loadFixture($this->getFixtureFiles());
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

    public function testGetCollection(): void
    {
        $this->loadFixture($this->getFixtureFiles());
        $this->requestRest('GET', $this->getApiPath());
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains($this->getJsonCollectionValidation());
    }
}
