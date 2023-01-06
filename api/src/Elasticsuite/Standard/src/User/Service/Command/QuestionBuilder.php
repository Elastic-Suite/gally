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

namespace Elasticsuite\User\Service\Command;

use Symfony\Component\Console\Question\Question as BaseQuestion;

class QuestionBuilder
{
    public function getQuestion(string $label, bool $trimmable = true, int $attempts = 3): BaseQuestion
    {
        $question = new BaseQuestion($label);
        $question->setTrimmable($trimmable);
        $question->setMaxAttempts($attempts);

        return $question;
    }
}
