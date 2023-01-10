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

namespace Gally\Test;

use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use ApiPlatform\Core\Operation\PathSegmentNameGeneratorInterface;
use Gally\Locale\EventSubscriber\LocaleSubscriber;
use Gally\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

/**
 * @codeCoverageIgnore
 */
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
        parent::setUpBeforeClass();
        static::loadFixture(static::getFixtureFiles());
    }

    abstract protected static function getFixtureFiles(): array;

    abstract protected function getEntityClass(): string;

    /**
     * @dataProvider createDataProvider
     */
    public function testCreate(
        User $user,
        array $data,
        int $responseCode = 201,
        ?string $message = null,
        string $validRegex = null
    ): void {
        $request = new RequestToTest('POST', $this->getApiPath(), $user, $data);
        $expectedResponse = new ExpectedResponse(
            $responseCode,
            function (ResponseInterface $response) use ($data, $validRegex) {
                $shortName = $this->getShortName();
                $this->assertJsonContains(
                    array_merge(
                        ['@context' => "/contexts/$shortName", '@type' => $shortName],
                        $this->getJsonCreationValidation($data)
                    )
                );
                $this->assertMatchesRegularExpression($validRegex ?? '~^' . $this->getApiPath() . '/\d+$~', $response->toArray()['@id']);
                $this->assertMatchesResourceItemJsonSchema($this->getEntityClass());
            },
            $message
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    /**
     * Data provider for entity creation api call
     * The data provider should return test case with :
     * - User $user: user to use in the api call
     * - array $data: post data
     * - (optional) int $responseCode: expected response code
     * - (optional) string $message: expected error message
     * - (optional) string $validRegex: a regexp used to validate generated id.
     */
    abstract public function createDataProvider(): iterable;

    protected function getJsonCreationValidation(array $expectedData): array
    {
        return $expectedData;
    }

    /**
     * @dataProvider getDataProvider
     * @depends testCreate
     */
    public function testGet(User $user, int|string $id, array $expectedData, int $responseCode, ?string $locale = null): void
    {
        $headers = null !== $locale ? [LocaleSubscriber::GALLY_LANGUAGE_HEADER => $locale] : [];
        $request = new RequestToTest('GET', "{$this->getApiPath()}/{$id}", $user, [], $headers);
        $expectedResponse = new ExpectedResponse(
            $responseCode,
            function (ResponseInterface $response) use ($expectedData) {
                $shortName = $this->getShortName();
                if ($response->getStatusCode() < 400) {
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
                } else {
                    $this->assertJsonContains(['@context' => "/contexts/$shortName", '@type' => $shortName]);
                }
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    /**
     * Data provider for entity get api call
     * The data provider should return test case with :
     * - User $user: user to use in the api call
     * - int|string $id: id of the entity to get
     * - array $expectedData: expected data of the entity
     * - int $responseCode: expected response code.
     */
    abstract public function getDataProvider(): iterable;

    protected function getJsonGetValidation(array $expectedData): array
    {
        return $expectedData;
    }

    /**
     * @dataProvider deleteDataProvider
     * @depends testGet
     */
    public function testDelete(User $user, int|string $id, int $responseCode): void
    {
        $this->validateApiCall(
            new RequestToTest('DELETE', "{$this->getApiPath()}/{$id}", $user),
            new ExpectedResponse(
                $responseCode,
                function (ResponseInterface $response) {
                    $this->assertJsonContains($this->getJsonDeleteValidation());
                }
            )
        );
    }

    /**
     * Data provider for delete entity api call
     * The data provider should return test case with :
     * - User $user: user to use in the api call
     * - int|string $id: id of the entity to delete
     * - int $responseCode: expected response code.
     */
    abstract public function deleteDataProvider(): iterable;

    protected function getJsonDeleteValidation(): array
    {
        return [];
    }

    /**
     * @dataProvider getCollectionDataProvider
     * @depends testDelete
     */
    public function testGetCollection(User $user, int $expectedItemNumber, int $responseCode): void
    {
        $request = new RequestToTest('GET', $this->getApiPath(), $user);
        $expectedResponse = new ExpectedResponse(
            $responseCode,
            function (ResponseInterface $response) use ($expectedItemNumber) {
                $shortName = $this->getShortName();
                if ($response->getStatusCode() < 400) {
                    $this->assertJsonContains(
                        array_merge(
                            [
                                '@context' => "/contexts/$shortName",
                                '@id' => $this->getApiPath(),
                                '@type' => 'hydra:Collection',
                                'hydra:totalItems' => $expectedItemNumber,
                            ],
                            $this->getJsonGetCollectionValidation()
                        )
                    );
                } else {
                    $this->assertJsonContains(['@context' => "/contexts/$shortName", '@type' => 'hydra:Collection']);
                }
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    /**
     * Data provider for collection api call
     * The data provider should return test case with :
     * - User $user: user to use in the api call
     * - int $expectedItemNumber: the expected number of item in the collection
     * - int $responseCode: expected response code.
     */
    abstract public function getCollectionDataProvider(): iterable;

    protected function getJsonGetCollectionValidation(): array
    {
        return [];
    }

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
}
