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

namespace Gally\Example\Command\Cache;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @codeCoverageIgnore
 */
class GetCustomCommand extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'gally:example:cache-get-custom';

    public function __construct(
        private CacheInterface $gallyExampleCustomCache,
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
        $this->setDescription($this->translator->trans('example.commmand.cache.custom.description', [], 'gally_example'));
    }

    /**
     * Get or create cache object from custom cache domain.
     *
     * @param InputInterface  $input  Input
     * @param OutputInterface $output Output
     *
     * @throws \Psr\Cache\InvalidArgumentException
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $ttl = 60;

        $cacheObject = $this->gallyExampleCustomCache->get('common.key', function (ItemInterface $item, bool &$save) use ($output, $ttl) {
            if ($item->isHit()) {
                $output->writeln($this->translator->trans('example.command.cache.hit.recompute', [], 'gally_example'));
            } else {
                $output->writeln($this->translator->trans('example.commmand.cache.miss.create', [], 'gally_example'));
            }

            $value = $this->translator->trans('example.command.cache.custom.value', ['%ttl' => $ttl], 'gally_example');
            $item->set($value)
                ->expiresAfter($ttl)
                ->tag(['cache', 'simple']);

            $metadata = $item->getMetadata();
            $output->writeln(
                $this->translator->trans('example.command.cache.item.metadata', [], 'gally_example')
            );
            if (!empty($metadata)) {
                $output->write(print_r($metadata, true));
            }
            $output->writeln(
                $this->translator->trans('example.command.cache.item.key', ['%key' => $item->getKey()], 'gally_example')
            );

            return $item->get();
        });

        $output->writeln(
            $this->translator->trans('example.command.cache.object.value', ['%cacheObject' => $cacheObject], 'gally_example')
        );

        return Command::SUCCESS;
    }
}
