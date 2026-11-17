// Formatting is set here, not read from the repo root .editorconfig: CI sees that file, the
// containers do not (only front/ is mounted), so leaving tabWidth to it made local checks pass
// and CI fail. An explicit tabWidth wins over .editorconfig, so both now agree.
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  overrides: [{ files: '*.md', options: { tabWidth: 4 } }],
}
