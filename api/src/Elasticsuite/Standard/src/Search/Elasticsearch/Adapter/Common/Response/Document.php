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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;

use Elasticsuite\Search\Elasticsearch\DocumentInterface;

class Document implements DocumentInterface
{
    /**
     * @var string
     */
    protected const ID = 'id';

    /**
     * @var string
     */
    protected const SCORE_DOC_FIELD_NAME = '_score';

    /**
     * @var string
     */
    protected const SOURCE_DOC_FIELD_NAME = '_source';

    public function __construct(private array $data)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getId(): string
    {
        return $this->data[self::ID];
    }

    /**
     * {@inheritDoc}
     */
    public function getScore(): float
    {
        return $this->data[self::SCORE_DOC_FIELD_NAME] ?? 0;
    }

    /**
     * {@inheritDoc}
     */
    public function getSource(): array
    {
        return $this->data[self::SOURCE_DOC_FIELD_NAME] ?? [];
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): void
    {
        $this->data = $data;
    }
}
