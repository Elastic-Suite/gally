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

namespace Gally\Search\Tests\Unit\Elasticsearch\Request\Container;

use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\Elasticsearch\Request\Container\Configuration\GenericContainerConfigurationFactory;
use Gally\Search\Elasticsearch\Request\Container\RelevanceConfiguration\FuzzinessConfig;
use Gally\Search\Elasticsearch\Request\Container\RelevanceConfigurationInterface;
use Gally\Test\AbstractTest;

class RelevanceConfigurationTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        static::loadFixture([
            __DIR__ . '/../../../../fixtures/catalogs_relevance.yaml',
            __DIR__ . '/../../../../fixtures/source_field.yaml',
            __DIR__ . '/../../../../fixtures/metadata.yaml',
        ]);
        parent::setUpBeforeClass();
    }

    public function testRelevanceConfig()
    {
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $metadataRepository = static::getContainer()->get(MetadataRepository::class);

        $metadata = $metadataRepository->findOneBy(['entity' => 'product']);
        $b2cEnRelevance = $localizedCatalogRepository->findOneBy(['code' => 'b2c_en_relevance']);
        $b2cFrRelevance = $localizedCatalogRepository->findOneBy(['code' => 'b2c_fr_relevance']);

        $configurationFactory = static::getContainer()->get(GenericContainerConfigurationFactory::class);

        // Check relevance config for 'global' scope + 'generic' request type.
        $containerConfig = $configurationFactory->create('generic', $metadata, $b2cEnRelevance);
        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $this->checkRelevanceConfig(
            $relevanceConfig,
            [
                'fulltext_minimumShouldMatch' => '100%',
                'fulltext_tieBreaker' => 1.0,
                'phraseMatch_boost' => false,
                'cutOffFrequency_value' => 0.15,
                'fuzziness_enabled' => true,
                'fuzziness_value' => FuzzinessConfig::VALUE_AUTO,
                'fuzziness_prefixLength' => 1,
                'fuzziness_maxExpansions' => 10,
                'phonetic_enabled' => true,
            ]
        );

        // Check relevance config for 'global' scope + 'product_catalog' request type.
        $containerConfig = $configurationFactory->create('product_catalog', $metadata, $b2cEnRelevance);
        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $this->checkRelevanceConfig(
            $relevanceConfig,
            [
                'fulltext_minimumShouldMatch' => '100%',
                'fulltext_tieBreaker' => 1.0,
                'phraseMatch_boost' => false,
                'cutOffFrequency_value' => 0.15,
                'fuzziness_enabled' => true,
                'fuzziness_value' => FuzzinessConfig::VALUE_AUTO,
                'fuzziness_prefixLength' => 1,
                'fuzziness_maxExpansions' => 10,
                'phonetic_enabled' => true,
            ]
        );

        // Check relevance config for 'b2c_fr_relevance' localized catalog scope + 'product_catalog' request type.
        $containerConfig = $configurationFactory->create('product_catalog', $metadata, $b2cFrRelevance);
        $relevanceConfig = $containerConfig->getRelevanceConfig();
        $this->checkRelevanceConfig(
            $relevanceConfig,
            [
                'fulltext_minimumShouldMatch' => '50%',
                'fulltext_tieBreaker' => 1.0,
                'phraseMatch_boost' => 25,
                'cutOffFrequency_value' => 0.30,
                'fuzziness_enabled' => true,
                'fuzziness_value' => FuzzinessConfig::VALUE_AUTO,
                'fuzziness_prefixLength' => 1,
                'fuzziness_maxExpansions' => 10,
                'phonetic_enabled' => true,
            ]
        );
    }

    protected function checkRelevanceConfig(RelevanceConfigurationInterface $relevanceConfig, array $expectedConfig)
    {
        $this->assertEquals($relevanceConfig->getMinimumShouldMatch(), $expectedConfig['fulltext_minimumShouldMatch']);
        $this->assertEquals($relevanceConfig->getTieBreaker(), $expectedConfig['fulltext_tieBreaker']);
        $this->assertEquals($relevanceConfig->getPhraseMatchBoost(), $expectedConfig['phraseMatch_boost']);
        $this->assertEquals($relevanceConfig->getCutOffFrequency(), $expectedConfig['cutOffFrequency_value']);
        $this->assertEquals($relevanceConfig->isFuzzinessEnabled(), $expectedConfig['fuzziness_enabled']);
        $this->assertEquals($relevanceConfig->getFuzzinessConfiguration()->getValue(), $expectedConfig['fuzziness_value']);
        $this->assertEquals($relevanceConfig->getFuzzinessConfiguration()->getPrefixLength(), $expectedConfig['fuzziness_prefixLength']);
        $this->assertEquals($relevanceConfig->getFuzzinessConfiguration()->getMaxExpansion(), $expectedConfig['fuzziness_maxExpansions']);
        $this->assertEquals($relevanceConfig->isPhoneticSearchEnabled(), $expectedConfig['phonetic_enabled']);
    }
}
