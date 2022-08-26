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

namespace Elasticsuite\Analysis\Tests\Unit;

use Elasticsuite\Analysis\Service\Config;
use Elasticsuite\DependencyInjection\Configuration;
use Elasticsuite\Standard\src\Test\AbstractTest;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\Yaml\Parser as YamlParser;

/**
 * Analysis configuration file converter test case.
 */
class ConfigTest extends AbstractTest
{
    private static Config $config;

    /**
     * Test available language list is OK for the sample test file.
     *
     * {@inheritDoc}
     */
    public static function setUpBeforeClass(): void
    {
        $yamlParser = new YamlParser();
        $configData = $yamlParser->parseFile(__DIR__ . '/../../Resources/config/test/elasticsuite_analysis.yaml');
        $processor = new Processor();
        $configurationFormat = new Configuration();
        self::$config = new Config(
            new CacheManagerMock(),
            $processor->processConfiguration($configurationFormat, $configData)['analysis']
        );
    }

    /**
     * Test available language list is OK for the sample test file.
     */
    public function testAvailableLanguages(): void
    {
        $defaultData = self::$config->get();
        $this->assertIsArray($defaultData);

        $this->assertIsArray(self::$config->get('override_language'));
        $this->assertNotEquals(self::$config->get('override_language'), $defaultData);

        $this->assertIsArray(self::$config->get('char_filter_generated_language'));
        $this->assertNotEquals(self::$config->get('char_filter_generated_language'), $defaultData);
        $this->assertIsArray(self::$config->get('filter_generated_language'));
        $this->assertNotEquals(self::$config->get('filter_generated_language'), $defaultData);
        $this->assertIsArray(self::$config->get('analyzer_generated_language'));
        $this->assertNotEquals(self::$config->get('analyzer_generated_language'), $defaultData);
        $this->assertIsArray(self::$config->get('normalizer_generated_language'));
        $this->assertNotEquals(self::$config->get('normalizer_generated_language'), $defaultData);

        $this->assertIsArray(self::$config->get('non_existent_language_in_conf'));
        $this->assertEquals(self::$config->get('non_existent_language_in_conf'), $defaultData);
    }

    /**
     * Test available char filters for the default language in the sample test file.
     */
    public function testCharFilters(): void
    {
        $defaultCharFilters = self::$config->get()['char_filter'];
        $this->assertCount(2, $defaultCharFilters);

        $this->assertArrayHasKey('char_filter_name', $defaultCharFilters);
        $charFilter = $defaultCharFilters['char_filter_name'];
        $this->assertEquals('char_filter_type', $charFilter['type']);

        $charFilter = $defaultCharFilters['char_filter_with_params'];
        $this->assertArrayHasKey('char_filter_with_params', $defaultCharFilters);
        $this->assertEquals('char_filter_with_params_type', $charFilter['type']);

        $this->assertTrue($charFilter['simpleParam']);
        $this->assertEquals('value', $charFilter['jsonParamObject']['key']);
        $this->assertCount(2, $charFilter['jsonParamArray']);
    }

    /**
     * Test available char filters by language in the sample test file.
     */
    public function testLanguageCharFilters(): void
    {
        $charFilterGeneratedLanguages = self::$config->get('char_filter_generated_language')['char_filter'];
        $this->assertCount(3, $charFilterGeneratedLanguages);
        $this->assertEquals('dummy_type', $charFilterGeneratedLanguages['dummy']['type']);

        $charFilterOverrides = self::$config->get('override_language')['char_filter'];
        $this->assertCount(3, $charFilterOverrides);
        $this->assertEquals('char_filter_type_language_override', $charFilterOverrides['char_filter_name']['type']);
        $this->assertFalse($charFilterOverrides['char_filter_with_params']['simpleParam']);
        $this->assertArrayNotHasKey('jsonParamObject', $charFilterOverrides['char_filter_with_params']);
    }

    /**
     * Test available filters for the default language in the sample test file.
     */
    public function testFilters(): void
    {
        $defaultFilters = self::$config->get()['filter'];
        $this->assertCount(2, $defaultFilters);

        $this->assertArrayHasKey('filter_name', $defaultFilters);
        $filter = $defaultFilters['filter_name'];
        $this->assertEquals('filter_type', $filter['type']);

        $filter = $defaultFilters['filter_with_params'];
        $this->assertArrayHasKey('filter_with_params', $defaultFilters);
        $this->assertEquals('filter_with_params_type', $filter['type']);

        $this->assertTrue($filter['simpleParam']);
        $this->assertEquals('value', $filter['jsonParamObject']['key']);
        $this->assertCount(2, $filter['jsonParamArray']);
    }

    /**
     * Test available filters by language in the sample test file.
     */
    public function testLanguageFilters(): void
    {
        $filterGeneratedLanguages = self::$config->get('filter_generated_language')['filter'];
        $this->assertCount(3, $filterGeneratedLanguages);
        $this->assertEquals('dummy_type', $filterGeneratedLanguages['dummy']['type']);

        $filterOverrides = self::$config->get('override_language')['filter'];
        $this->assertCount(2, $filterOverrides);
        $this->assertEquals('filter_type_language_override', $filterOverrides['filter_name']['type']);
    }

    /**
     * Test analyzers for the default language in the sample test file.
     */
    public function testAnalyzers(): void
    {
        $defaultAnalyzers = self::$config->get()['analyzer'];
        $this->assertCount(1, $defaultAnalyzers);

        $this->assertArrayHasKey('analyzer_name', $defaultAnalyzers);
        $this->assertEquals('tokenizer', $defaultAnalyzers['analyzer_name']['tokenizer']);
        $this->assertEquals('custom', $defaultAnalyzers['analyzer_name']['type']);

        $this->assertContains('char_filter_name', $defaultAnalyzers['analyzer_name']['char_filter']);
        $this->assertContains('char_filter_with_params', $defaultAnalyzers['analyzer_name']['char_filter']);
        $this->assertNotContains('invalid_char_filter', $defaultAnalyzers['analyzer_name']['char_filter']);
        $this->assertNotContains('char_filter_override', $defaultAnalyzers['analyzer_name']['char_filter']);

        $this->assertContains('filter_name', $defaultAnalyzers['analyzer_name']['filter']);
        $this->assertContains('filter_with_params', $defaultAnalyzers['analyzer_name']['filter']);
    }

    /**
     * Test available analyzers by language in the sample test file.
     */
    public function testLanguageAnalyzers(): void
    {
        $analyzerGeneratedLanguages = self::$config->get('analyzer_generated_language')['analyzer'];
        $this->assertCount(2, $analyzerGeneratedLanguages);
        $this->assertEquals('dummy_tokenizer', $analyzerGeneratedLanguages['dummy']['tokenizer']);

        $analyzerOverrides = self::$config->get('override_language')['analyzer'];
        $this->assertCount(1, $analyzerOverrides);
        $this->assertEquals('tokenizer_override', $analyzerOverrides['analyzer_name']['tokenizer']);
        $this->assertContains('char_filter_name', $analyzerOverrides['analyzer_name']['char_filter']);
        $this->assertContains('char_filter_with_params', $analyzerOverrides['analyzer_name']['char_filter']);
        $this->assertNotContains('invalid_char_filter', $analyzerOverrides['analyzer_name']['char_filter']);
        $this->assertContains('char_filter_override', $analyzerOverrides['analyzer_name']['char_filter']);
    }

    /**
     * Test normalizers for the default language in the sample test file.
     */
    public function testNormalizers(): void
    {
        $defaultAnalyzers = self::$config->get()['normalizer'];
        $this->assertCount(1, $defaultAnalyzers);

        $this->assertArrayHasKey('normalizer_name', $defaultAnalyzers);
        $this->assertEquals('custom', $defaultAnalyzers['normalizer_name']['type']);

        $this->assertContains('char_filter_name', $defaultAnalyzers['normalizer_name']['char_filter']);
        $this->assertContains('char_filter_with_params', $defaultAnalyzers['normalizer_name']['char_filter']);
        $this->assertNotContains('invalid_char_filter', $defaultAnalyzers['normalizer_name']['char_filter']);
        $this->assertNotContains('char_filter_override', $defaultAnalyzers['normalizer_name']['char_filter']);

        $this->assertContains('filter_name', $defaultAnalyzers['normalizer_name']['filter']);
        $this->assertContains('filter_with_params', $defaultAnalyzers['normalizer_name']['filter']);
    }

    /**
     * Test available normalizers by language in the sample test file.
     */
    public function testLanguageNormalizers(): void
    {
        $normalizerGeneratedLanguages = self::$config->get('normalizer_generated_language')['normalizer'];
        $this->assertCount(2, $normalizerGeneratedLanguages);
        $this->assertContains('char_filter_name', $normalizerGeneratedLanguages['dummy']['char_filter']);
        $this->assertNotContains('char_filter_with_params', $normalizerGeneratedLanguages['dummy']['char_filter']);
        $this->assertNotContains('invalid_char_filter', $normalizerGeneratedLanguages['dummy']['char_filter']);

        $normalizerOverrides = self::$config->get('override_language')['normalizer'];
        $this->assertCount(1, $normalizerOverrides);
        $this->assertContains('char_filter_name', $normalizerOverrides['normalizer_name']['char_filter']);
        $this->assertContains('char_filter_with_params', $normalizerOverrides['normalizer_name']['char_filter']);
        $this->assertNotContains('invalid_char_filter', $normalizerOverrides['normalizer_name']['char_filter']);
        $this->assertContains('char_filter_override', $normalizerOverrides['normalizer_name']['char_filter']);
    }
}
