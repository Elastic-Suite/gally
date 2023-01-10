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

namespace Gally\User\Command;

use Gally\User\Service\Command\QuestionBuilder as CmdQuestionBuilder;
use Gally\User\Service\Command\Validator as CmdValidator;
use Gally\User\Service\UserManager;
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
