<?php

namespace Elasticsuite\Example\Command;

use Elasticsuite\Example\Service\DummyInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Must be declared as a service with the tag console.command.
 */
class MappingCommand extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'elasticsuite:example:mapping-get';

    public function __construct(
        private DummyInterface $dummyService,
        private TranslatorInterface $translator,
        string $name = null
    ) {
        parent::__construct($name);
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Get example mapping.');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Translation documentation: https://symfony.com/doc/current/translation.html.
        $output->writeln(
            $this->translator->trans('example.command.mapping.label', [], 'elasticsuite_example', 'fr_FR') . ': '
        );
        $output->writeln(json_encode($this->dummyService->getMapping()));

        return Command::SUCCESS;
    }
}
