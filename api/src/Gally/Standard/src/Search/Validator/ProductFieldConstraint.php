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

namespace Gally\Search\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ProductFieldConstraint extends Constraint
{
    public $message = 'The sourceField "{{ sourceFieldCode }}" is not linked to a product metadata.';
}
