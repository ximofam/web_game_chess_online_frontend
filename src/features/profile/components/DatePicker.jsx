import React from 'react';

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
    <div className="w-full flex flex-col items-start gap-1 text-left">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]"
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
        className={`w-full bg-[#0d0e12] text-[#f3f4f6] font-inter px-4 py-3 rounded border text-sm transition-all duration-200 outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:shadow-[0_0_8px_rgba(212,175,55,0.15)] ${
          hasError
            ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
            : 'border-[#2d323f] hover:border-[#9ca3af]'
        }`}
        {...props}
      />
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

export default DatePicker;
