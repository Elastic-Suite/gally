module.exports = {
  ...require('../.prettierrc'),
  // Match the repo root .editorconfig (indent_size = 4 for .md and .mjs), which the container
  // does not see: only front/ is mounted there.
  overrides: [{ files: ['*.md', '*.mjs'], options: { tabWidth: 4 } }],
}
