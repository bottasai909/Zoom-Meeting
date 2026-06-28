import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-zoom-textMuted uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#1e1e2d] border border-gray-800 focus:border-zoom-blue text-white placeholder-gray-500 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-zoom-blue/20"
        {...props}
      />
    </div>
  );
}
