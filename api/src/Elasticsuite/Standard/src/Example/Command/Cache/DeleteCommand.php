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

namespace Elasticsuite\Example\Command\Cache;

use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * @codeCoverageIgnore
 */
class DeleteCommand extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'elasticsuite:example:cache-delete';

    public function __construct(
        private CacheItemPoolInterface $cacheItemPool,
        string $name = null
    ) {
        parent::__construct($name);
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Delete example cache objects from generic app cache through API Platform cache trait.');
        $this
            ->setDefinition([
                new InputArgument('key', InputArgument::REQUIRED, 'The cache key to delete from the pool'),
            ])
            ->setHelp(<<<'EOF'
The <info>%command.name%</info> deletes an item from the injected cache pool.

    %command.full_name% <key>
EOF
            );
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $cacheKey = $input->getArgument('key');

        if (!$this->cacheItemPool->hasItem($cacheKey)) {
            $output->writeln(sprintf('Cache item "%s" does not exist in the app cache pool.', $cacheKey));

            return Command::SUCCESS;
        }

        if (!$this->cacheItemPool->deleteItem($cacheKey)) {
            throw new \Exception(sprintf('Cache item "%s" could not be deleted.', $cacheKey));
        }

        $output->writeln(sprintf('Cache item "%s" was successfully deleted.', $cacheKey));

        return Command::SUCCESS;
    }
}
