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

namespace Elasticsuite\Security\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Security\Model\Authentication;
use Elasticsuite\User\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class AuthenticationMutationResolver implements MutationResolverInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager,
        private ValidatorInterface $validator,
        private TranslatorInterface $translator,
    ) {
    }

    /**
     * Authenticating a user via GraphQL.
     *
     * @param Authentication|null $item
     *
     * @throws \Exception
     */
    public function __invoke($item, array $context): Authentication
    {
        $email = $context['args']['input']['email'];
        $password = $context['args']['input']['password'];

        $user = $this->userRepository->findOneBy(['email' => trim($email)]);

        /** @var ConstraintViolationList $errorsEmail */
        $errorsEmail = $this->validator->validate($email, new Email());
        if ($errorsEmail->count() > 0) {
            $messages = array_map(
                function (ConstraintViolationInterface $violation) {
                    return $violation->getMessage();
                },
                iterator_to_array($errorsEmail->getIterator())
            );
            throw new \InvalidArgumentException(implode(' ', $messages));
        }

        $item = new Authentication();
        $item->setEmail($email);
        $item->setPassword($password);
        $item->setCode(Response::HTTP_UNAUTHORIZED);
        $item->setMessage(
            $this->translator->trans('Invalid credentials.', [], 'security')
        );

        if ($user instanceof PasswordAuthenticatedUserInterface && $this->passwordHasher->isPasswordValid($user, $password)) {
            $item->setToken($this->jwtManager->create($user));
            $item->setCode(Response::HTTP_OK);
            $item->setMessage('');
        }

        return $item;
    }
}
