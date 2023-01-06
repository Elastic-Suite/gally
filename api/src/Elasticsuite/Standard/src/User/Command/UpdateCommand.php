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

namespace Elasticsuite\User\Command;

use Elasticsuite\User\Service\Command\QuestionBuilder as CmdQuestionBuilder;
use Elasticsuite\User\Service\Command\Validator as CmdValidator;
use Elasticsuite\User\Service\UserManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateCommand extends Command
{
    protected static $defaultName = 'gally:user:update';

    public function __construct(
        private UserManager $userManager,
        private CmdValidator $cmdValidator,
        private CmdQuestionBuilder $cmdQuestionBuilder
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->setDescription('Updates a user.')
            ->setHelp('This command allows you to update a user');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        /** @var QuestionHelper $helper */
        $helper = $this->getHelper('question');
        $output->writeln("Update User Command Interactive Wizard (Keep the field empty if you don't want change the value).");

        $question = $this->cmdQuestionBuilder->getQuestion("User's email:");
        $this->cmdValidator->userEmailExists($question);
        $currentEmail = $helper->ask($input, $output, $question);

        $question = $this->cmdQuestionBuilder->getQuestion('New email:');
        $this->cmdValidator->userEmailNotExists($question, true);
        $email = $helper->ask($input, $output, $question);

        $question = $this->cmdQuestionBuilder->getQuestion('New Password:');
        $question->setHidden(true);
        $question->setHiddenFallback(false);
        $question->setMaxAttempts(3);
        $this->cmdValidator->notBlank($question, true);
        $password = $helper->ask($input, $output, $question);

        $question = $this->cmdQuestionBuilder->getQuestion('New role(s) (separate multiple roles with a space):');
        $this->cmdValidator->rolesExists($question, true);
        $roles = $helper->ask($input, $output, $question);

        $this->userManager->update($currentEmail, $email, $roles, $password);

        $output->writeln('The user has been updated.');

        return Command::SUCCESS;
    }
}