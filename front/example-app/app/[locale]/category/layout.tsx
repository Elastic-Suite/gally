import CategoryNav from '../../../src/components/CategoryNav';

// The nav bar lives here, ABOVE the [code] segment, so it is rendered once and then
// preserved across every category→category navigation: Next re-renders only the segments
// below the layouts that stay matched. Inside the page component it was torn down and
// rebuilt on every click, which threw away CategoryItem's submenu state and made the bar
// flash.
//
// It reads the active category from useParams() rather than a prop, because this layout's
// segment does not include [code].
//
// It is inside <main>, so it IS swapped out while a navigation is pending — RouteSkeleton
// redraws it for category targets so the bar does not blink out. See
// specs/bugfix-ssr-product-list-behind-suspense.md.
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryNav />
      {children}
    </>
  );
}
