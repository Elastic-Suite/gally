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

namespace Elasticsuite\RuleEngine\Controller;

use Elasticsuite\RuleEngine\Model\RuleEngineGraphQlFilters;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RuleEngineGraphQlFiltersController extends AbstractController
{
    public function __construct(
        private RuleEngineManager $ruleEngineManager
    ) {
    }

    public function __invoke(Request $request): RuleEngineGraphQlFilters
    {
        $body = json_decode($request->getContent(), true);

        $ruleJson = $body['rule'] ?? null;
        if (null === $ruleJson) {
            throw new BadRequestHttpException('Rule is empty.');
        }

        $rule = json_decode($ruleJson, true);
        if (false === $rule || null === $rule) {
            throw new BadRequestHttpException('JSON rule object cannot be decoded.');
        }

        return $this->ruleEngineManager->getRuleEngineGraphQlFilters($rule);
    }
}
