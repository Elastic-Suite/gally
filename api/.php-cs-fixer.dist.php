<?php

declare(strict_types=1);

$header = <<<'HEADER'
DISCLAIMER

Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.

@package   Gally
@author    Gally Team <elasticsuite@smile.fr>
@copyright 2022-present Smile
@license   Open Software License v. 3.0 (OSL-3.0)
HEADER;

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__)
    ->exclude([
        'src/Acme',
        'src/Gally/Standard/src/Search/Legacy',
        'src/Gally/Premium',
        'src/Core/Bridge/Symfony/Maker/Resources/skeleton',
        'tests/Fixtures/app/var',
    ])
    ->notPath('#src\/Gally\/.*\/Legacy#')
    ->notPath('src/Symfony/Bundle/DependencyInjection/Configuration.php')
    ->notPath('src/Annotation/ApiFilter.php') // temporary
    ->notPath('src/Annotation/ApiProperty.php') // temporary
    ->notPath('src/Annotation/ApiResource.php') // temporary
    ->notPath('src/Annotation/ApiSubresource.php') // temporary
    ->notPath('tests/Fixtures/TestBundle/Entity/DummyPhp8.php'); // temporary
    // ->append([
    //    'tests/Fixtures/app/console',
    // ]);

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@DoctrineAnnotation' => true,
        '@PHP71Migration' => true,
        '@PHP71Migration:risky' => true,
        '@PHPUnit60Migration:risky' => true,
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'align_multiline_comment' => [
            'comment_type' => 'phpdocs_like',
        ],
        'array_indentation' => true,
        'compact_nullable_typehint' => true,
        'concat_space' => [
            'spacing' => 'one',
        ],
        'doctrine_annotation_array_assignment' => [
            'operator' => '=',
        ],
        'doctrine_annotation_spaces' => [
            'after_array_assignments_equals' => false,
            'before_array_assignments_equals' => false,
        ],
        'explicit_indirect_variable' => true,
        'fully_qualified_strict_types' => true,
        'header_comment' => [
            'comment_type' => 'PHPDoc',
            'header' => $header,
            'location' => 'after_open',
            'separate' => 'bottom',
        ],
        'logical_operators' => true,
        'multiline_comment_opening_closing' => true,
        'multiline_whitespace_before_semicolons' => [
            'strategy' => 'no_multi_line',
        ],
        'no_alternative_syntax' => true,
        'no_extra_blank_lines' => [
            'tokens' => [
                'break',
                'continue',
                'curly_brace_block',
                'extra',
                'parenthesis_brace_block',
                'return',
                'square_brace_block',
                'throw',
                'use',
            ],
        ],
        'no_superfluous_elseif' => true,
        // To re-enable in API Platform 3: https://github.com/symfony/symfony/issues/43021
        //'no_superfluous_phpdoc_tags' => [
        //    'allow_mixed' => false,
        //],
        'no_unset_cast' => true,
        'no_unset_on_property' => true,
        'no_useless_else' => true,
        'no_useless_return' => true,
        'ordered_imports' => [
            'imports_order' => [
                'class',
                'function',
                'const',
            ],
            'sort_algorithm' => 'alpha',
        ],
        'phpdoc_to_comment' => [
            'ignored_tags' => ['var', 'todo'],
        ],
        'php_unit_method_casing' => [
            'case' => 'camel_case',
        ],
        'php_unit_set_up_tear_down_visibility' => true,
        'php_unit_test_annotation' => [
            'style' => 'prefix',
        ],
        'phpdoc_add_missing_param_annotation' => [
            'only_untyped' => true,
        ],
        'phpdoc_no_alias_tag' => true,
        'phpdoc_order' => true,
        'phpdoc_trim_consecutive_blank_line_separation' => true,
        'phpdoc_var_annotation_correct_order' => true,
        'return_assignment' => true,
        'strict_param' => true,
        'visibility_required' => [
            'elements' => [
                'const',
                'method',
                'property',
            ],
        ],
        'void_return' => false, // BC breaks; to be done in API Platform 3.0
    ])
    ->setFinder($finder);
