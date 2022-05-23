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

namespace Elasticsuite\Search\Elasticsearch\Spellchecker;

/**
 * Spellchecking request interface.
 */
interface RequestInterface
{
    /**
     * Spellcheck request index name.
     */
    public function getIndex(): string;

    /**
     * Spellcheck fulltext query.
     */
    public function getQueryText(): string;

    /**
     * Spellcheck cutoff frequency (used to detect stop-words).
     */
    public function getCutoffFrequency(): float;
}
