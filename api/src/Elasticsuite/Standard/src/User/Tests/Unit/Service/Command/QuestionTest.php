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

namespace Elasticsuite\Standard\src\User\Tests\Unit\Service\Command;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\User\Service\Command\QuestionBuilder;

class QuestionTest extends AbstractTest
{
    public function testGetQuestion(): void
    {
        $cmdQuestionBuilder = static::getContainer()->get(QuestionBuilder::class);
        $label = 'Email:';
        $question = $cmdQuestionBuilder->getQuestion($label);
        $this->assertEquals($label, $question->getQuestion());
        $this->assertTrue($question->isTrimmable());
        $this->assertEquals(3, $question->getMaxAttempts());

        $attempts = 5;
        $question = $cmdQuestionBuilder->getQuestion($label, false, $attempts);
        $this->assertFalse($question->isTrimmable());
        $this->assertEquals($attempts, $question->getMaxAttempts());
    }
}
