"use client";

import { ReactNode } from "react";

interface FormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
  name: string;
  id: string;
  autoComplete?: string;
  icon: ReactNode;
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors,
  name,
  id,
  autoComplete,
  icon,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only" htmlFor={id}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-dark">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`h-12 w-full rounded-full border bg-white/80 pl-12 pr-5 text-base leading-none placeholder:text-text-muted shadow-input focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            errors.length > 0
              ? "border-accent-pink focus:ring-accent-pink"
              : "border-border-default focus:ring-gray-300"
          }`}
        />
      </div>
      {errors.length > 0 && (
        <p className="mt-1 text-left text-sm text-accent-pink">
          {errors.join(", ")}
        </p>
      )}
    </div>
  );
}
