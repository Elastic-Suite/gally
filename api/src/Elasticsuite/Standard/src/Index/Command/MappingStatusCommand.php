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

namespace Elasticsuite\Index\Command;

use Elasticsuite\Index\Model\Index\Mapping\Status;
use Elasticsuite\Index\Repository\Metadata\MetadataRepository;
use Elasticsuite\Index\Service\IndexManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class MappingStatusCommand extends Command
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private IndexManager $indexManager,
        string $name
    ) {
        parent::__construct($name);
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this
            ->addArgument('entity', InputArgument::REQUIRED)
            ->setDescription('Debug command to generate entity mapping');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $ui = new SymfonyStyle($input, $output);

        $entity = $input->getArgument('entity');
        $metadata = $this->metadataRepository->findOneBy(['entity' => $entity]);

        $status = $this->indexManager->getMappingStatus($metadata);
        switch ($status) {
            case Status::Green:
                $ui->writeln('Ok');

                return Command::SUCCESS;
            case Status::Yellow:
                $ui->writeln('Mapping will be taken into account on next reindex');

                return Command::SUCCESS;
            default:
                $ui->writeln($entity . ' metadata is not enough qualified');

                return Command::FAILURE;
        }
    }
}
