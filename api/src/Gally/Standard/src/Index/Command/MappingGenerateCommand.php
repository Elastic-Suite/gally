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

namespace Gally\Index\Command;

use Gally\Index\Service\MetadataManager;
use Gally\Metadata\Repository\MetadataRepository;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class MappingGenerateCommand extends Command
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private MetadataManager $metadataManager,
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
        $ui->writeln("Generate mapping for $entity");
        $metadata = $this->metadataRepository->findOneBy(['entity' => $entity]);

        $mapping = $this->metadataManager->getMapping($metadata);
        $ui->writeln(json_encode($mapping->asArray(), \JSON_PRETTY_PRINT));

        return Command::SUCCESS;
    }
}
