import CategoryNav from '../../../src/components/CategoryNav';

// The nav bar lives here, ABOVE the [code] segment, so it is rendered once and then
// preserved across every category→category navigation: Next re-renders only the segments
// below the layouts that stay matched. Inside the page component it was torn down and
// rebuilt on every click, which threw away CategoryItem's submenu state and made the bar
// flash. Being above [code]/loading.tsx also means it stays on screen during the fetch
// instead of being replaced by a skeleton.
//
// It reads the active category from useParams() rather than a prop, because this layout's
// segment does not include [code].
export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CategoryNav />
      {children}
    </>
  );
}
