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

namespace Gally\Search\Elasticsearch\Builder\Request\SortOrder;

use Gally\Search\Elasticsearch\Request\SortOrderInterface;

/**
 * Script sort order implementation.
 * TODO extend from Standard ?
 */
class Script implements SortOrderInterface
{
    /**
     * Constant for Script field.
     */
    public const SCRIPT_FIELD = '_script';

    private ?string $name;

    private string $field = self::SCRIPT_FIELD;

    private string $direction;

    private string $missing;

    private string $scriptType;

    private string $lang;

    private string $source;

    private array $params;

    /**
     * Constructor.
     *
     * @param string  $scriptType Script type
     * @param string  $lang       Script lang
     * @param string  $source     Script source
     * @param array   $params     Script params
     * @param ?string $direction  Sort order direction
     * @param ?string $name       Sort order name
     * @param ?string $missing    How to treat missing values
     */
    public function __construct(
        string $scriptType,
        string $lang,
        string $source,
        array $params = [],
        ?string $direction = self::SORT_ASC,
        ?string $name = null,
        ?string $missing = null
    ) {
        $this->name = $name;
        $this->missing = $missing ?? (self::SORT_ASC === $direction ? self::MISSING_LAST : self::MISSING_FIRST);

        $this->scriptType = $scriptType;
        $this->lang = $lang;
        $this->source = $source;
        $this->params = $params;
        $this->direction = $direction;
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * {@inheritDoc}
     */
    public function getDirection(): string
    {
        return $this->direction ?? self::SORT_ASC;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return SortOrderInterface::TYPE_SCRIPT;
    }

    /**
     * {@inheritDoc}
     */
    public function getMissing(): string
    {
        return $this->missing;
    }

    /**
     * Get script source, lang and params.
     */
    public function getScript(): array
    {
        return [
            'lang' => $this->lang,
            'source' => $this->source,
            'params' => $this->params,
        ];
    }

    /**
     * Get script type.
     */
    public function getScriptType(): string
    {
        return $this->scriptType;
    }
}
