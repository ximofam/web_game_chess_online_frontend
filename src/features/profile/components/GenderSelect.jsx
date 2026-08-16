import { useTranslation } from 'react-i18next';

/**
 * GenderSelect displays a premium styled select element for
 * gender attributes (MALE, FEMALE, OTHER).
 * Designed to be used with React Hook Form's Controller or register.
 */
export const GenderSelect = ({ label, id, error, value = '', onChange, ...props }) => {
  const { t } = useTranslation(['profile']);
  const hasError = !!error;
  const errorId = `${id}-error`;

  return (
    <div className="w-full flex flex-col items-start gap-1.5 text-left">
      <label
        htmlFor={id}
        className="font-inter text-xs font-semibold uppercase tracking-widest text-chess-muted"
      >
        {label}
      </label>
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full bg-chess-dark text-chess-text font-inter px-4 py-3 rounded-md border text-sm transition-colors outline-none appearance-none focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold ${
            hasError
              ? 'border-red-500/60 focus:border-red-500'
              : 'border-chess-border focus:border-chess-gold'
          }`}
          {...props}
        >
          <option value="" disabled className="bg-chess-surface">
            {t('profile:genderSelect.choose', 'Choose Gender')}
          </option>
          <option value="MALE" className="bg-chess-surface">
            {t('profile:genderSelect.male', 'Male')}
          </option>
          <option value="FEMALE" className="bg-chess-surface">
            {t('profile:genderSelect.female', 'Female')}
          </option>
          <option value="OTHER" className="bg-chess-surface">
            {t('profile:genderSelect.other', 'Other')}
          </option>
        </select>
        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-chess-muted">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {hasError && (
        <span
          id={errorId}
          role="alert"
          className="text-xs text-red-500 font-medium mt-0.5 animate-fade-in"
        >
          {error.message || error}
        </span>
      )}
    </div>
  );
};

export default GenderSelect;
