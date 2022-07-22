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

namespace Elasticsuite\Search\Elasticsearch;

/**
 * Spellchecker component interface.
 */
interface SpellcheckerInterface
{
    public const SPELLING_TYPE_EXACT = 1;
    public const SPELLING_TYPE_MOST_EXACT = 2;
    public const SPELLING_TYPE_MOST_FUZZY = 3;
    public const SPELLING_TYPE_FUZZY = 4;
    public const SPELLING_TYPE_PURE_STOPWORDS = 5;

    /**
     * Returns the type of spelling of a fulltext query :
     * - SPELLING_TYPE_EXACT          : All terms of the text query exist and are exactly spelled.
     * - SPELLING_TYPE_MOST_EXACT     : All terms of the text quest exist but some are matched using an analyzed form.
     * - SPELLING_TYPE_MOST_FUZZY     : At least one term of the text query exists in the index.
     * - SPELLING_TYPE_FUZZY          : All terms of the text query were misspelled.
     * - SPELLING_TYPE_PURE_STOPWORDS : All terms of the text query exist and are stop-words (a, the, ...).
     *
     * @param Spellchecker\RequestInterface $request Spellchecking query
     */
    public function getSpellingType(Spellchecker\RequestInterface $request): int;
}
