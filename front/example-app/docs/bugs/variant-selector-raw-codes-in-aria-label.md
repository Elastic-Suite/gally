# Variant selector may announce raw attribute codes

## Status: to check (probably fixed)

## Reported

On a Fiora or papershop listing, the compact variant overlay passed the axis heading to the
radio group's `aria-label`. When the heading fell back to the raw attribute code, a screen reader
heard `fio_color` or `fio_clothing_size`.

## Why it is probably fixed

`src/components/VariantSelector.tsx:103-112` now takes the heading from
`product_source_field_labels`, since commit `3a414938`. No browser has checked it yet.

## Next step

Open a listing with a screen reader or the accessibility tree, and read the radio group's name. If
it is a translated label, delete this file.

## Source

`bugfix-listing-axes-missing-for-new-catalogs.md`, lines 100-118 (removed; see
`git show 2745ce7c:front/example-app/specs/bugfix-listing-axes-missing-for-new-catalogs.md`).
