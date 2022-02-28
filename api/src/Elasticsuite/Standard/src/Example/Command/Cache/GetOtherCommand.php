<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Smile
 * @package   Smile\Elasticsuite
 * @author    Richard Bayet <richard.bayet@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */


namespace Elasticsuite\Example\Command\Cache;

use Symfony\Component\Cache\CacheItem;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class GetOtherCommand extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'elasticsuite:example:cache-get-other';

    public function __construct(
        private CacheInterface $elasticsuiteExampleOtherCache,
        private TranslatorInterface $translator,
        string $name = null
    ) {
        parent::__construct($name);
    }

    /**
     * {@inheritdoc}
     */
    protected function configure(): void
    {
        $this->setDescription($this->translator->trans('example.commmand.cache.other.description', [], 'elasticsuite_example'));
    }

    /**
     * Get or create cache object in other cache pool.
     *
     * @param InputInterface $input   Input
     * @param OutputInterface $output Output
     *
     * @return int
     * @throws \Psr\Cache\InvalidArgumentException
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $ttl = 60;

        $cacheObject = $this->elasticsuiteExampleOtherCache->get('common.key', function (CacheItem $item, bool &$save) use ($output, $ttl) {
            if ($item->isHit()) {
                $output->writeln($this->translator->trans('example.command.cache.hit.recompute', [], 'elasticsuite_example'));
            } else {
                $output->writeln($this->translator->trans('example.commmand.cache.miss.create', [], 'elasticsuite_example'));
            }

            $value = $this->translator->trans('example.command.cache.other.value', ['%ttl' => $ttl], 'elasticsuite_example');
            $item->set($value)
                ->expiresAfter($ttl)
                ->tag(['cache', 'other']);

            $metadata = $item->getMetadata();
            $output->writeln(
                $this->translator->trans('example.command.cache.item.metadata', [], 'elasticsuite_example')
            );
            if (!empty($metadata)) {
                $output->write(print_r($metadata, true));
            }
            $output->writeln(
                $this->translator->trans('example.command.cache.item.key', ['%key' => $item->getKey()], 'elasticsuite_example')
            );

            return $item->get();
        }, 0.9);

        $output->writeln(
            $this->translator->trans('example.command.cache.object.value', ['%cacheObject' => $cacheObject], 'elasticsuite_example')
        );

        return Command::SUCCESS;
    }
}
