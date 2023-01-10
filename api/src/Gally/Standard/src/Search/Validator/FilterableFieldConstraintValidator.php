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

use Gally\Metadata\Model\SourceField;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class FilterableFieldConstraintValidator extends ConstraintValidator
{
    /**
     * @param ?SourceField $value
     *
     * @return void
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof FilterableFieldConstraint) {
            throw new UnexpectedTypeException($constraint, FilterableFieldConstraint::class);
        }

        if ($value && !$value->getIsFilterable()) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ sourceFieldCode }}', $value->getCode())
                ->addViolation();
        }
    }
}
