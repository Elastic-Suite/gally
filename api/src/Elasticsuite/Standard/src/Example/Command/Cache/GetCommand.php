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

use ApiPlatform\Core\Cache\CachedTrait;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class GetCommand extends Command
{
    use CachedTrait;

    public const CACHE_KEY_PREFIX = 'example_cache_';

    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'elasticsuite:example:cache-get';

    public function __construct(
        private TranslatorInterface $translator,
        CacheItemPoolInterface $cacheItemPool,
        string $name = null
    ) {
        parent::__construct($name);
        $this->cacheItemPool = $cacheItemPool;
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this->setDescription('Get example random cache objects from generic app cache through API Platform cache trait.');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Translation documentation: https://symfony.com/doc/current/translation.html.
        $output->writeln(
            $this->translator->trans('example.command.cache.get.label', [], 'elasticsuite_example', 'fr_FR') . ': '
        );

        $cacheKey = self::CACHE_KEY_PREFIX . random_int(0, 2);
        $cacheValue = $this->getCached($cacheKey, function () use ($output, $cacheKey) {
            $output->writeln(
                $this->translator->trans(
                    'example.command.cache.get.miss',
                    ['%cachekey' => $cacheKey],
                    'elasticsuite_example',
                    'fr_FR'
                )
            );

            return 'string_' . random_int(0, 999);
        });

        $output->writeln(
            $this->translator->trans(
                'example.command.cache.get.value',
                ['%cachekey' => $cacheKey, '%cachevalue' => $cacheValue],
                'elasticsuite_example',
                'fr_FR'
            )
        );

        return Command::SUCCESS;
    }
}
