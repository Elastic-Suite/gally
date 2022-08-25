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
/**
 * DISCLAIMER.
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Smile
 *
 * @author    Aurelien FOUCRET <aurelien.foucret@smile.fr>
 * @copyright 2020 Smile
 * @license   Open Software License ("OSL") v. 3.0
 */

namespace Elasticsuite\Search\Elasticsearch\Spellchecker;

/**
 * Spellchecker request implementation.
 */
class Request implements RequestInterface
{
    /**
     * Constructor.
     *
     * @param string $indexName       spellcheck request index name
     * @param string $queryText       spellcheck fulltext query
     * @param float  $cutoffFrequency spellcheck cutoff frequency (used to detect stopwords)
     */
    public function __construct(
        private string $indexName,
        private string $queryText,
        private float $cutoffFrequency
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function getIndexName(): string
    {
        return $this->indexName;
    }

    /**
     * {@inheritDoc}
     */
    public function getQueryText(): string
    {
        return $this->queryText;
    }

    /**
     * {@inheritDoc}
     */
    public function getCutoffFrequency(): float
    {
        return $this->cutoffFrequency;
    }
}
