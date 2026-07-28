# Subagent i18n Rules
1. You are internationalizing specific folders.
2. Read all `.jsx` files in your assigned directories.
3. Extract hardcoded UI strings (Vietnamese or English) into `src/i18n/locales/en/[namespace].json` (English) and `src/i18n/locales/vi/[namespace].json` (Vietnamese).
4. Replace the hardcoded string in the `.jsx` file with `t('[namespace]:key')`.
   - Remember to import: `import { useTranslation } from 'react-i18next';`
   - Inside component: `const { t } = useTranslation(['[namespace]']);`
5. Do NOT modify any `.jsx` or `.json` files outside your assigned directories/namespaces.
6. Use `multi_replace_file_content` to append keys to JSON files, do not overwrite the entire file unless necessary.
7. Make sure your translation keys are descriptive (e.g. `login_button`, `error_invalid_email`).
8. Work systematically file by file. When done with all files in your scope, reply with a summary.
