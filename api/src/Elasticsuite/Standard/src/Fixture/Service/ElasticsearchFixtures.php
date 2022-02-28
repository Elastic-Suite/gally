<?php

namespace Elasticsuite\Fixture\Service;

use Elasticsuite\Index\Repository\Document\DocumentRepositoryInterface;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Symfony\Component\Validator\Constraints\Json;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ElasticsearchFixtures implements ElasticsearchFixturesInterface
{
    public const PREFIX_TEST_INDEX = 'elasticsuite_test__';

    /**
     * ElasticsearchFixtures constructor.
     *
     * @param ValidatorInterface $validator
     * @param IndexRepositoryInterface $indexRepository
     * @param DocumentRepositoryInterface $documentRepository
     * @param string $env
     * @param bool $testMode
     */
    public function __construct(
        private ValidatorInterface $validator,
        private IndexRepositoryInterface $indexRepository,
        private DocumentRepositoryInterface $documentRepository,
        private string $env,
        private bool $testMode,
    ) {
        if ($this->env === 'test') {
            $this->setTestMode(true);
        }
    }

    /**
     * Get test mode.
     *
     * @return bool
     */
    public function isTestMode(): bool
    {
        return $this->testMode;
    }

    /**
     * Set test mode.
     *
     * @param bool $testMode
     */
    public function setTestMode(bool $testMode): void
    {
        $this->testMode = $testMode;
    }

    /**
     * Create indices from data in $pathFiles.
     *
     * @param array $pathFiles
     */
    public function loadFixturesIndexFiles(array $pathFiles): void
    {
        $this->validateFilesFormat($pathFiles);

        foreach ($pathFiles as $file) {
            $indices = file_get_contents($file);
            $indices = json_decode($indices, true);
            foreach ($indices as $index) {
                $this->indexRepository->create(
                    $this->getTestIndexName($index['name']),
                    $this->getTestAliasName($index['alias'])
                );
            }
        }
    }

    /**
     * Create documents from data in $pathFiles.
     *
     * @param array $pathFiles
     */
    public function loadFixturesDocumentFiles(array $pathFiles): void
    {
        $this->validateFilesFormat($pathFiles);

        foreach ($pathFiles as $file) {
            $documents = file_get_contents($file);
            $documents = json_decode($documents, true);
            foreach ($documents as $document) {
                $this->documentRepository->index(
                    $this->getTestIndexName($document['index_name']),
                    array_map('json_encode', $document['documents']),
                    true
                );
            }
        }
    }

    /**
     * Delete test indices.
     */
    public function deleteTestFixtures(): void
    {
        $this->indexRepository->delete(self::PREFIX_TEST_INDEX . '*');
    }

    /**
     * Get index name prefixed by the index test prefix.
     *
     * @param string $indexName
     * @return string
     */
    public function getTestIndexName(string $indexName): string
    {
        return $this->isTestMode() ?  self::PREFIX_TEST_INDEX . $indexName : $indexName;
    }

    /**
     * Get index name prefixed by the index test prefix.
     *
     * @param string $aliasName
     * @return string
     */
    public function getTestAliasName(string $aliasName): string
    {
        return $this->isTestMode() ?  self::PREFIX_TEST_INDEX . $aliasName : $aliasName;
    }

    /**
     * Validate files format.
     *
     * @param array $pathFiles
     * @return array
     */
    protected function validateFilesFormat(array $pathFiles): array
    {
        $data = [];
        $errorsByFile = [];
        foreach ($pathFiles as $file) {
            $item = file_get_contents($file);
            $errors = $this->validator->validate($item, new Json());
            if ($errors->count() > 0) {
                $errorsByFile[$file] = $errors;
            }
        }

        if (!empty($errorsByFile)) {
            $this->throwFormatException($errorsByFile);
        }

        return $data;
    }

    /**
     * Format exception message and throw format exception.
     *
     * @param array $errorsByFile
     * @throws \Exception
     */
    protected function throwFormatException(array $errorsByFile)
    {
        $messages = [];
        foreach ($errorsByFile as $file => $errors) {
            $messages = array_map(
                function (ConstraintViolation $violation) use ($file){
                    return $file . ' => ' . $violation->getMessage();
                },
                iterator_to_array($errors->getIterator())
            );
        }

        throw new \Exception(
            'Format error(s) on fixture files: ' . PHP_EOL . implode(PHP_EOL, $messages)
        );
    }
}
