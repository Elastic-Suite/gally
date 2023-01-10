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

namespace Gally\RuleEngine\Controller;

use Gally\RuleEngine\Model\RuleEngineGraphQlFilters;
use Gally\RuleEngine\Service\RuleEngineManager;
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
