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

use Elasticsuite\RuleEngine\Model\RuleEngineOperators;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RuleEngineOperatorsController extends AbstractController
{
    public function __construct(
        private RuleEngineManager $ruleEngineManager
    ) {
    }

    public function __invoke(): RuleEngineOperators
    {
        return $this->ruleEngineManager->getRuleEngineOperators();
    }
}
