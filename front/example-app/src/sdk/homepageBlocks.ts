// Homepage hero and promo cards per sample shop, keyed by catalog code. Only what does not
// translate lives here - product photo paths (relative to the media base, resolved with
// mediaUrl()) and category ids, which belong to the catalog and so serve all three languages.
// The text is in category.json under homepage.blocks.<catalog>.<key>.
// A catalog with no entry keeps the plain text hero. See specs/feature-homepage-blocks.md.

export interface PromoCard {
  key: string // text under homepage.blocks.<catalog>.cards.<key>
  image: string
  categoryId: string
}

export interface HomepageBlocks {
  heroImages: string[]
  cards: PromoCard[]
}

export const HOMEPAGE_BLOCKS: Record<string, HomepageBlocks> = {
  fashion: {
    heroImages: [
      '/fashion/f/i/fio-fro-rs-003.jpg',
      '/fashion/f/i/fio-fro-rs-002.jpg',
      '/fashion/f/i/fio-fro-rl-008.jpg',
    ],
    cards: [
      {
        key: 'bags',
        image: '/fashion/f/i/fio-mab-bg-007.jpg',
        categoryId: 'cat_fio_50',
      },
      {
        key: 'shoes',
        image: '/fashion/f/i/fio-cha-mu-006.jpg',
        categoryId: 'cat_fio_44',
      },
    ],
  },
  toolbox: {
    heroImages: [
      '/toolbox/t/b/tbx-elp-po-001.jpg',
      '/toolbox/t/b/tbx-elp-po-002.jpg',
      '/toolbox/t/b/tbx-elp-po-004.jpg',
    ],
    cards: [
      {
        key: 'handTools',
        image: '/toolbox/t/b/tbx-oam-cl-001.jpg',
        categoryId: 'cat_tbx_2',
      },
      {
        key: 'smartHome',
        image: '/toolbox/t/b/tbx-ele-dm-005.jpg',
        categoryId: 'cat_tbx_47',
      },
    ],
  },
  papershop: {
    heroImages: [
      '/papershop/l/l/llv-pap-plu-002.jpg',
      '/papershop/l/l/llv-pap-enc-004.jpg',
      '/papershop/l/l/llv-pap-age-003.jpg',
    ],
    cards: [
      {
        key: 'artBooks',
        image: '/papershop/l/l/llv-liv-art-005.jpg',
        categoryId: 'cat_llv_36',
      },
      {
        key: 'deskLamps',
        image: '/papershop/l/l/llv-mob-lam-006.jpg',
        categoryId: 'cat_llv_50',
      },
    ],
  },
}
