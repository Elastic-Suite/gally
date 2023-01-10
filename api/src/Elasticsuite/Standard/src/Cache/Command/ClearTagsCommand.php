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

namespace Elasticsuite\Cache\Command;

use Elasticsuite\Cache\Service\CacheManagerInterface;
use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * @codeCoverageIgnore
 */
class ClearTagsCommand extends Command
{
    protected static $defaultName = 'elasticsuite:cache:clear-tags';

    public function __construct(private CacheManagerInterface $cache, string $name = null)
    {
        parent::__construct($name);
    }

    /**
     * {@inheritDoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Clear tag(s) from elasticsuite specific cache pool.');
        $this
            ->setDefinition([
                new InputArgument('tags', InputArgument::REQUIRED | InputArgument::IS_ARRAY, 'The cache tags to invalidate cache for'),
            ])
            ->setHelp(<<<'EOF'
The <info>%command.name%</info> clears cache objects identified by their cache tag(s) in elasticsuite specific cache pool.

    %command.full_name% <tags>...
EOF
            );
    }

    /**
     * {@inheritDoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $tags = $input->getArgument('tags');

        try {
            $this->cache->clearTags($tags);
        } catch (InvalidArgumentException $e) {
            $output->writeln($e->getMessage());

            return Command::FAILURE;
        }

        $output->writeln('The cache associated with the provided tag(s) was cleared.');

        return Command::SUCCESS;
    }
}
