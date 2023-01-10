<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

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
        if (!$ui->confirm('Careful, all elasticsearch indices will be deleted. Do you want to continue?', !$input->isInteractive())) {
            return Command::SUCCESS;
        }

        $this->indexRepository->delete('*');
        $ui->writeln('Elasticsearch indices have been deleted.');

        return Command::SUCCESS;
    }
}
