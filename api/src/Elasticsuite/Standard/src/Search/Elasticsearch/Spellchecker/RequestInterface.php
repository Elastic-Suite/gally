<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Elasticsearch\Spellchecker;

/**
 * Spellchecking request interface.
 */
interface RequestInterface
{
    /**
     * Spellcheck request index name.
     */
    public function getIndexName(): string;

    /**
     * Spellcheck fulltext query.
     */
    public function getQueryText(): string;

    /**
     * Spellcheck cutoff frequency (used to detect stop-words).
     */
    public function getCutoffFrequency(): float;
}
