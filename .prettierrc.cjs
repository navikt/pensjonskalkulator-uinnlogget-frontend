module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: ['<THIRD_PARTY_MODULES>', '^(?:@/|[./]).*(?<![.]css)$', '^@/|[./]', 'css$'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
