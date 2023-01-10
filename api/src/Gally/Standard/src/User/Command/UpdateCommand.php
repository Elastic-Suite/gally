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
