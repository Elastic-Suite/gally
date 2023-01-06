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

class CreateCommand extends Command
{
    protected static $defaultName = 'gally:user:create';

    public function __construct(
        private UserManager $userManager,
        private CmdValidator $cmdValidator,
        private CmdQuestionBuilder $cmdQuestionBuilder
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->setDescription('Creates a new user.')
            ->setHelp('This command allows you to create a user.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        /** @var QuestionHelper $helper */
        $helper = $this->getHelper('question');
        $output->writeln('Create User Command Interactive Wizard.');

        $question = $this->cmdQuestionBuilder->getQuestion('Email:');
        $this->cmdValidator->userEmailNotExists($question);
        $email = $helper->ask($input, $output, $question);

        $question = $this->cmdQuestionBuilder->getQuestion('Password:');
        $question->setHidden(true);
        $question->setHiddenFallback(false);
        $question->setMaxAttempts(3);
        $this->cmdValidator->notBlank($question);
        $password = $helper->ask($input, $output, $question);

        $question = $this->cmdQuestionBuilder->getQuestion('Roles (separate multiple roles with a space):');
        $this->cmdValidator->rolesExists($question);
        $roles = $helper->ask($input, $output, $question);

        $this->userManager->create($email, $roles, $password);

        $output->writeln('The user has been successfully created!');

        return Command::SUCCESS;
    }
}
