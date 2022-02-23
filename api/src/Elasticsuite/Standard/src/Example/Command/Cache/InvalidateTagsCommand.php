<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Example
 * @author    Richard Bayet <richard.bayet@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

namespace Elasticsuite\Example\Command\Cache;

use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class InvalidateTagsCommand extends Command
{
    private array $poolNames;

    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'elasticsuite:example:cache-invalidate-tags';

    public function __construct(
        array $poolNames = null,
        string $name = null
    ) {
        parent::__construct($name);
        $this->poolNames = $poolNames;
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Invalidate tag(s) from a specific cache pool (or default ones).');
        $this
            ->setDefinition([
                new InputArgument('tags', InputArgument::REQUIRED | InputArgument::IS_ARRAY, 'The cache tags to invalidate cache for'),
                new InputOption('pool', null, InputOption::VALUE_REQUIRED, 'The cache pool to invalidate cache from'),
            ])
            ->setHelp(<<<'EOF'
The <info>%command.name%</info> invalidates cache objects from the specific cache pool or default cache pools based on the provided cache tag(s).

    %command.full_name% <key>
EOF
            )
        ;
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $tags = $input->getArgument('tags');

        if ($input->hasOption('pool')) {
            $poolName = $input->getOption('pool');
            if (!empty($poolName)) {
                $this->poolNames = [$poolName];
            } else {
                $output->writeln(sprintf('Using default/injected cache pools: %s', implode(', ', $this->poolNames)));
            }
        }

        $kernel = $this->getApplication()->getKernel();
        foreach ($this->poolNames as $poolName) {
            $pool = $kernel->getContainer()->get($poolName);
            $output->writeln(sprintf('Invalidating tags [%s] in pool %s', implode(', ', $tags), $poolName));

            if ($pool instanceof TagAwareCacheInterface) {
                try {
                    $pool->invalidateTags($tags);
                } catch (InvalidArgumentException $e) {
                    $output->writeln(sprintf('Provided tags are invalid for cache pool %s', $poolName));
                }
            } else {
                $output->writeln(sprintf('Pool %s is not able to invalidate tags', $poolName));
            }
        }

        return Command::SUCCESS;
    }
}
