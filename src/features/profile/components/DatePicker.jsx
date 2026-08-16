
/**
 * DatePicker wraps a standard HTML5 date input and translates
 * dates between YYYY-MM-DD (browser input) and dd/MM/yyyy (API format).
 * Designed to be used with React Hook Form's Controller.
 */
export const DatePicker = ({ label, id, error, value = '', onChange, ...props }) => {
  const hasError = !!error;
  const errorId = `${id}-error`;

  // Translate dd/MM/yyyy -> YYYY-MM-DD for input
  const toInputValue = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  // Translate YYYY-MM-DD -> dd/MM/yyyy for form value
  const toApiValue = (inputStr) => {
    if (!inputStr) return '';
    const parts = inputStr.split('-');
    if (parts.length !== 3) return '';
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (e) => {
    const apiValue = toApiValue(e.target.value);
    onChange(apiValue);
  };

  return (
    <div className="w-full flex flex-col items-start gap-1.5 text-left">
      <label
        htmlFor={id}
        className="font-inter text-xs font-semibold uppercase tracking-widest text-chess-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={toInputValue(value)}
        onChange={handleDateChange}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? errorId : undefined}
        className={`w-full bg-chess-dark text-chess-text font-inter px-4 py-3 rounded-md border text-sm transition-colors outline-none focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold ${
          hasError
            ? 'border-red-500/60 focus:border-red-500'
            : 'border-chess-border focus:border-chess-gold'
        }`}
        {...props}
      />
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

export default DatePicker;
