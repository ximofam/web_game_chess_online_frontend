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
# Code Organization Rules

1. **Reusable Utilities**: Any utility function with high reusability potential (e.g., date/time formatting, string manipulation, calculation helpers) MUST NOT be defined inline within components. Instead, extract them and place them in the `src/shared/utils/` directory.
2. Import these shared utilities wherever needed to avoid code duplication and keep components focused purely on UI and state logic.

# Spec-Driven Development Rules

When using or instructed to use the `/agent-skills:spec-driven-development` skill, you MUST adhere to the following constraints for generating the specification file:
1. Always create the specification document inside the `./tasks/` directory. Create this directory if it doesn't exist.
2. Use the naming convention `spec-<feature>.md` (e.g., `spec-rooms.md` for a room feature).
