module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@navikt/(.*)$',
    '^(?:@/|[./]).*(?<![.]css)$',
    'css$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
