// Server component (no 'use client'): the whole point is that this lands in the HTML
// payload a crawler reads, before any JavaScript runs.
//
// dangerouslySetInnerHTML is the correct tool here, not a mistake: React would escape
// the JSON into HTML entities inside a normal text child, and a structured-data parser
// would then fail to read it. The value is always JSON.stringify output, never
// user-authored markup. The `<` escape guards the one XSS vector that survives
// stringify — a "</script>" sequence inside a string field closing the tag early.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
