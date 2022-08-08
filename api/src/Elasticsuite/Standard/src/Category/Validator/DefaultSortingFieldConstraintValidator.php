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

namespace Elasticsuite\Category\Validator;

use Elasticsuite\Category\DataProvider\CategorySortingOptionDataProvider;
use Elasticsuite\Category\Model\Source\CategorySortingOption;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class DefaultSortingFieldConstraintValidator extends ConstraintValidator
{
    public function __construct(
        private CategorySortingOptionDataProvider $categorySortingOptionDataProvider,
    ) {
    }

    /**
     * @param string $value
     *
     * @return void
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof DefaultSortingFieldConstraint) {
            throw new UnexpectedTypeException($constraint, DefaultSortingFieldConstraint::class);
        }

        $sortOptions = array_column(
            $this->categorySortingOptionDataProvider->getCollection(CategorySortingOption::class),
            'code'
        );
        if (null != $value && !\in_array($value, $sortOptions, true)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ sortOption }}', $value)
                ->addViolation();
        }
    }
}
