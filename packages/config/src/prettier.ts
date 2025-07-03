// Shared Prettier configuration

export const basePrettierConfig = {
  semi: true,
  trailingComma: 'es5' as const,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'always' as const,
  endOfLine: 'lf' as const,
  jsxSingleQuote: true,
  bracketSameLine: false,
  plugins: ['prettier-plugin-tailwindcss'],
};