# Feature: blog and vector pages at the product page width, breadcrumb in one place

## Status: implemented
## Page/Component
`src/styles.css` (`.blog-page`, `.blog-post`, `.vector-page`, `.vector-head`).

## Why

The breadcrumb jumped between pages. Measured at 1440px, every breadcrumb sits at the same height
(y164) and size (12.8px), but its left edge moved: x32 on category, product and search, x40 on the
blog list (`.blog-page` capped at 1200px and centred), x240 on a blog post (`.blog-post` capped at
800px and centred), and centred text on the vector page (`.vector-head { text-align: center }`).
The vector page's own 1400px cap would also push it off x32 above a ~1460px viewport.

## Behaviour (testable)

- [x] The blog list and the blog post use the full content width, like the product pages.
- [x] On a blog post the hero, summary and body keep an 800px measure, aligned left. At the full
      width a line runs past 200 characters, and the hero (a product cut-out cropped with
      `object-fit: cover`) showed only a slice of the product.
- [x] The vector page uses the full content width; its two panels stay equal (`1fr 1fr`).
- [x] The breadcrumb's left edge is the same on category, product, search, blog list, blog post
      and vector pages, at 1440px and at 1920px.
- [x] The vector page breadcrumb is left-aligned. The title, search form and chips stay centred.

## Verified

On 2026-10-02 in a browser, at 1440px and 1920px: the breadcrumb is at the same left edge (x32 and
x192), height (y164) and size (12.8px) on category, product, search, blog list, blog post and
vector pages. Screenshots at 1440px: the blog list runs 4 cards across, the post's breadcrumb and
title sit at the page edge with the hero and text at 800px, the vector breadcrumb is left with the
title and form centred. `tsc --noEmit` clean.

## SDK contract used

None. Layout only.

## Tracking (required)

Unchanged.

## UI constraints

No new tokens. `800px` is the measure the post already had.

## MUST NOT change

- **No page-level width cap that centres the breadcrumb.** A cap belongs on the content that needs
  it (the post's text), not on the page wrapper that holds the breadcrumb.
- The CMS page (`.cms-page`, 800px centred) is not part of this change.
