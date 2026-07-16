import React from 'react';

/**
 * GenderSelect displays a premium styled select element for
 * gender attributes (MALE, FEMALE, OTHER).
 * Designed to be used with React Hook Form's Controller or register.
 */
export const GenderSelect = ({ label, id, error, value = '', onChange, ...props }) => {
  const hasError = !!error;
  const errorId = `${id}-error`;

  return (
    <div className="w-full flex flex-col items-start gap-1 text-left">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]"
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
          className={`w-full bg-[#0d0e12] text-[#f3f4f6] font-inter px-4 py-3 rounded border text-sm transition-all duration-200 outline-none appearance-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:shadow-[0_0_8px_rgba(212,175,55,0.15)] ${
            hasError
              ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
              : 'border-[#2d323f] hover:border-[#9ca3af]'
          }`}
          {...props}
        >
          <option value="" disabled className="bg-[#1a1d24]">
            Choose Gender
          </option>
          <option value="MALE" className="bg-[#1a1d24]">
            Male
          </option>
          <option value="FEMALE" className="bg-[#1a1d24]">
            Female
          </option>
          <option value="OTHER" className="bg-[#1a1d24]">
            Other
          </option>
        </select>
        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#d4af37]">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
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

export default GenderSelect;
