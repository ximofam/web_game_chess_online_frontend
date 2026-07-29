/* global module */
module.exports = {
  createOldCatalogs: false,
  indentation: 2,
  lexers: {
    jsx: ['JsxLexer'],
    js: ['JsxLexer'],
  },
  locales: ['en', 'vi'],
  output: 'src/i18n/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{js,jsx}'],
  sort: true,
  keepRemoved: true,
  defaultValue: (locale, namespace, key, value) => {
    // If the tool extracted the default value from t('key', 'Default'), it will be in value
    // Return value or key if not available
    if (locale === 'en') {
      return value || key; // In English, it will just leave it or use the VN string, but ideally we'd translate it later
    }
    return value || key;
  }
};
