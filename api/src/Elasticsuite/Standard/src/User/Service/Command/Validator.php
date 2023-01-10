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

namespace Elasticsuite\User\Service\Command;

use Elasticsuite\User\Service\Command\Validation as CmdValidation;
use Symfony\Component\Console\Question\Question;

class Validator
{
    public function __construct(
        private CmdValidation $cmdValidation
    ) {
    }

    public function userEmailExists(Question $question, bool $update = false): void
    {
        $question->setValidator(function ($value) use ($update) {
            if ($update && empty($value)) {
                return null;
            }
            $errors = $this->cmdValidation->notBlank($value);
            $errors = array_merge($errors, $this->cmdValidation->email($value));

            if (empty($errors)) {
                $errors = $this->cmdValidation->userExists($value);
            }

            if (!empty($errors)) {
                throw new \InvalidArgumentException(implode(\PHP_EOL, $errors));
            }

            return $value;
        });
    }

    public function userEmailNotExists(Question $question, bool $update = false): void
    {
        $question->setValidator(function ($value) use ($update) {
            if ($update && empty($value)) {
                return null;
            }
            $errors = $this->cmdValidation->notBlank($value);
            $errors = array_merge($errors, $this->cmdValidation->email($value));

            if (empty($errors)) {
                $errors = $this->cmdValidation->userNotExists($value);
            }

            if (!empty($errors)) {
                throw new \InvalidArgumentException(implode(\PHP_EOL, $errors));
            }

            return $value;
        });
    }

    public function notBlank(Question $question, bool $update = false): void
    {
        $question->setValidator(function ($value) use ($update) {
            if ($update && empty($value)) {
                return null;
            }

            $errors = $this->cmdValidation->notBlank($value);
            if (empty($value)) {
                throw new \InvalidArgumentException(implode(\PHP_EOL, $errors));
            }

            return $value;
        });
    }

    public function rolesExists(Question $question, bool $update = false): void
    {
        $question->setValidator(function ($value) use ($update) {
            if ($update && empty($value)) {
                return null;
            }

            $errors = $this->cmdValidation->notBlank($value);
            if (empty($errors)) {
                $value = explode(' ', $value);
                $value = array_map('strtoupper', $value);
                $errors = array_merge($errors, $this->cmdValidation->rolesExist($value));
            }

            if (!empty($errors)) {
                throw new \InvalidArgumentException(implode(\PHP_EOL, $errors));
            }

            return $value;
        });
    }
}
