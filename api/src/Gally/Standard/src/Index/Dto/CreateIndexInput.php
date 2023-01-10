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

namespace Gally\Index\Dto;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class CreateIndexInput
{
    /**
     * @var string
     */
    #[Assert\NotBlank]
    #[Groups(['create'])]
    public string $entityType;

    /**
     * @var string
     */
    #[Assert\NotBlank]
    #[Groups(['create'])]
    public string $localizedCatalog;
}
