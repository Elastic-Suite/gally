// Shown the instant a product link is clicked, while the Server Component fetches.
// Without this file Next has no Suspense boundary here and the navigation blocks on the
// old page until the fetch resolves.
export { ProductPageSkeleton as default } from '../../../../src/components/skeletons';
