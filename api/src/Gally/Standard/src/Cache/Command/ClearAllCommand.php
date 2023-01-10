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

namespace Gally\Cache\Command;

use Gally\Cache\Service\CacheManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * @codeCoverageIgnore
 */
class ClearAllCommand extends Command
{
    protected static $defaultName = 'gally:cache:clear-all';

    public function __construct(private CacheManagerInterface $cache, string $name = null)
    {
        parent::__construct($name);
    }

    /**
     * {@inheritDoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Clear everything in the gally specific cache pool.');
        $this->setHelp(<<<'EOF'
The <info>%command.name%</info> clears the gally cache pool, removing all cache objects and tags.

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
            $output->writeln('The gally cache pool could not be cleared.');

            return Command::INVALID;
        }

        $output->writeln('The gally cache pool was cleared.');

        return Command::SUCCESS;
    }
}
