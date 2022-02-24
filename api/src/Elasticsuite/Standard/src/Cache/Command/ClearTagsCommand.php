<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Cache
 * @author    Richard Bayet <richard.bayet@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

namespace Elasticsuite\Cache\Command;

use ApiPlatform\Core\HttpCache\PurgerInterface as HttpPurgerInterface;
use Elasticsuite\Cache\Service\CacheManagerInterface;
use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class ClearTagsCommand extends Command
{
    protected static $defaultName = 'elasticsuite:cache:clear-tags';

    public function __construct(private CacheManagerInterface $cache, private HttpPurgerInterface $httpPurger, string $name = null)
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
                new InputOption('http', null, InputOption::VALUE_NONE, 'Also try to invalidate the HTTP cache associated with the cache tags'),
            ])
            ->setHelp(<<<'EOF'
The <info>%command.name%</info> clears cache objects identified by their cache tag(s) in elasticsuite specific cache pool.

    %command.full_name% [--http] <tags>...
EOF
            )
        ;
    }

    /**
     * {@inheritDoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $tags = $input->getArgument('tags');

        try {
            $this->cache->clearTags($tags);
            if ($input->hasOption('http')) {
                $this->httpPurger->purge($tags);
            }

        } catch (InvalidArgumentException $e) {
            $output->writeln($e->getMessage());

            return Command::FAILURE;
        }

        $output->writeln('The cache associated with the provided tag(s) was cleared.');

        return Command::SUCCESS;
    }
}
