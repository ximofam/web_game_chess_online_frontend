# Internationalization (i18n) Rules

Whenever creating or modifying any user interface, you MUST follow these rules:

1. Never hardcode any user-facing text in the UI (e.g. `<div>Hello</div>`).
2. Always extract user-facing text into appropriate i18n translation keys.
3. Automatically update the existing locale files in the project with any newly introduced translation keys.
4. Use the project's established i18n architecture (e.g. `useTranslation()`, `t('namespace:key')`, and the existing namespace structure).
5. Reuse existing translation keys whenever they convey the same meaning instead of creating duplicates.
6. Place new translation keys in the most appropriate namespace. Only create a new namespace if the feature does not fit any existing one.
7. Use interpolation (`{{variable}}`) and pluralization where appropriate instead of string concatenation or manual conditional logic.
8. Ensure no user-facing text remains hardcoded after your changes.

Unless explicitly instructed otherwise, always provide translations for both **English (`en`)** and **Vietnamese (`vi`)**.

# Frontend design work
 
For any task involving new UI, pages, or visual/design decisions, read **DESIGN.md** first and follow it.