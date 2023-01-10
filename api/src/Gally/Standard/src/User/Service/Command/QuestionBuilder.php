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

namespace Gally\User\Service\Command;

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
