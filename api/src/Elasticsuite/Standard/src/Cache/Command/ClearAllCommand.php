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

namespace Elasticsuite\Cache\Command;

use Elasticsuite\Cache\Service\CacheManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * @codeCoverageIgnore
 */
class ClearAllCommand extends Command
{
    protected static $defaultName = 'elasticsuite:cache:clear-all';

    public function __construct(private CacheManagerInterface $cache, string $name = null)
    {
        parent::__construct($name);
    }

    /**
     * {@inheritDoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Clear everything in the elasticsuite specific cache pool.');
        $this->setHelp(<<<'EOF'
The <info>%command.name%</info> clears the elasticsuite cache pool, removing all cache objects and tags.

    %command.full_name%
EOF
            );
    }

    /**
     * {@inheritDoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if (!$this->cache->clearAll()) {
            $output->writeln('The elasticsuite cache pool could not be cleared.');

            return Command::INVALID;
        }

        $output->writeln('The elasticsuite cache pool was cleared.');

        return Command::SUCCESS;
    }
}
