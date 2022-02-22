<?php

namespace Elasticsuite\Index\Command;

use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class IndexClearCommand extends Command
{
    protected static $defaultName = 'elasticsuite:index:clear';

    /**
     * IndexClearCommand constructor.
     *
     * @param IndexRepositoryInterface $indexRepository
     * @param string|null $name
     */
    public function __construct(
        private IndexRepositoryInterface $indexRepository,
        string $name = null
    ) {
        parent::__construct($name);
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Delete all elasticsearch indices');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $ui = new SymfonyStyle($input, $output);
        if (! $ui->confirm('Careful, all elasticsearch indices will be deleted. Do you want to continue?', ! $input->isInteractive())) {
            return Command::SUCCESS;
        }

        $this->indexRepository->delete('*');
        $ui->writeln('Elasticsearch indices have been deleted.');

        return Command::SUCCESS;
    }
}
