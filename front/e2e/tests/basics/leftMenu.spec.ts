// import { test, expect } from '@playwright/test'
// import { login } from '../helper'

// interface IItemMenu {
//   label: string
//   path?: string
//   children?: IItemMenu[]
// }

// const expectedMenu: IItemMenu[] = [
//   {
//     label: 'ANALYSE',
//     children: [
//       {
//         label: 'Structure du catalogue',
//         path: '/fr/admin/analyze/catalog_structure',
//       },
//     ],
//   },
//   {
//     label: 'MERCHANDISING',
//     children: [
//       {
//         label: 'Catégories',
//         path: '/fr/admin/merchandize/categories',
//       },
//       {
//         label: 'Boosts',
//         path: '/fr/admin/merchandize/boost/grid',
//       },
//     ],
//   },
//   {
//     label: 'RECHERCHE',
//     children: [
//       {
//         label: 'Configuration',
//         children: [
//           {
//             label: 'Attributs',
//             path: '/fr/admin/search/configuration/attributes',
//           },
//         ],
//       },
//       {
//         label: 'Facettes',
//         path: '/fr/admin/search/facets',
//       },
//       {
//         label: 'Thésaurus',
//         path: '/fr/admin/search/thesaurus/grid',
//       },
//       {
//         label: 'Recherche vectorielle',
//         path: '/fr/admin/search/vector',
//       },
//     ],
//   },
//   {
//     label: 'Paramètres',
//     path: '/fr/admin/settings',
//   },
// ]

// const extractPaths = (items) => {
//   return items.reduce((acc, item) => {
//     if (item.children) {
//       // Si l'item a des enfants, les extraire également
//       return [...acc, ...extractPaths(item.children)]
//     } else if (item.path) {
//       // Si l'item a un path, on le garde
//       return [...acc, item]
//     }
//     return acc
//   }, [])
// }

// test('Left Menu', {
//   tag: "@premium"
// },async ({ page }) => {
//   // Correct login attempt
//   await login(page)

//   // Vérifie que la sidebar est présente
//   const sidebar = await page.getByTestId('sidebarMenu')
//   await expect(sidebar).toBeVisible()

//   // Vérifie que le logo est bien présent dans la sidebar
//   const logo = await sidebar.locator('img[alt="Logo"][width="104"]')
//   await expect(logo).toBeVisible()

//   // Vérifie que le bouton de collapse est présent
//   const sidebarButton = await page.getByTestId('sidebarMenuCollapseButton')
//   await expect(sidebarButton).toBeVisible()

//   // Clique sur le bouton de collapse
//   await sidebarButton.click()

//   // Vérifie que la sidebar est bien réduite
//   await expect(sidebar).toHaveCSS('width', '66px')
//   await expect(sidebar).toHaveCSS('min-width', '66px')

//   // Re-clique sur le bouton pour agrandir la sidebar
//   await sidebarButton.click()

//   // Vérifie que la sidebar est de nouveau étendue
//   await expect(sidebar).toHaveCSS('width', '278px')
//   await expect(sidebar).toHaveCSS('min-width', '278px')

//   // const menuGroupList = await page.getByTestId('menuGroup').all()

//   // for (const [index, expectedMenuItem] of expectedMenu.entries()) {
//   //   const menuGroup = menuGroupList[index]
//   //   const menuItemIcon = await menuGroup.getByTestId('menuItemIcon')

//   //   await expect(await menuItemIcon.innerText()).toEqual(expectedMenuItem.label)
//   //   if (expectedMenuItem.path) {
//   //     await expect(await menuItemIcon.locator("a")).toHaveAttribute("href", expectedMenuItem.path)

//   //     // await menuItemIcon.click()
//   //     // await expect(page).toHaveURL(expectedMenuItem.path)
//   //   } else if (expectedMenuItem.children) {
//   //     const subGroupMenuList = await menuGroup.getByTestId('subGroupMenu').all()
//   //     const expectedLinks = await extractPaths(expectedMenuItem.children)

//   //     for (const subGroup of subGroupMenuList) {
//   //       await subGroup.click()
//   //     }
//   //     const menuLinkList = await menuGroup.getByTestId('menuLinkItem').all()
//   //     // console.log(menuLinkList.length)
//   //     // for(const t of menuLinkList) {
//   //     //   console.log("Text => ", await t.innerText())
//   //     // }
//   //     // console.log(expectedLinks)
//   //     for (const [indexExpectedLink, expectedLink] of expectedLinks.entries()) {
//   //       const link = menuLinkList[indexExpectedLink]
//   //         await expect(await link.innerText()).toBe(expectedLink.label)
//   //         await expect(await link.locator("a")).toHaveAttribute("href", expectedLink.path)
//   //         // await expect(page).toHaveURL(expectedLink.path)
//   //       // }
//   //     }
//   //   }
//   // }
// })


// test('Menu', async ({page}) => {
//   await login(page)
//   const sidebar = await page.getByTestId('sidebarMenu')

//   await expect(sidebar).toBeVisible()

// })