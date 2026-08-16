
/**
 * Reusable, fully accessible Chess-themed Input field.
 * Integrates directly with React Hook Form.
 */
export const AuthInput = ({
  label,
  id,
  type = 'text',
  error,
  registration,
  rightElement,
  ...props
}) => {
  const hasError = !!error;
  const errorId = `${id}-error`;

  return (
    <div className="w-full flex flex-col items-start gap-1">
      {/* Field Label */}
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-widest text-chess-muted font-inter"
      >
        {label}
      </label>

      {/* Input container */}
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full bg-chess-dark text-chess-text font-inter px-4 py-3 rounded border text-sm transition-colors duration-200 outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold focus:border-chess-gold focus:ring-0 ${
            hasError
              ? 'border-red-500/60 focus:border-red-500 focus:outline-red-500'
              : 'border-chess-border hover:border-chess-muted'
          }`}
          {...registration}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Accessibility Alert & Visual Error Text */}
      {hasError && (
        <span
          id={errorId}
          role="alert"
          className="text-xs text-red-400 font-medium mt-0.5 animate-fade-in"
        >
          {error.message || error}
        </span>
      )}
    </div>
  );
};

export default AuthInput;
