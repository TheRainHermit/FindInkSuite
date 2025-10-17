import React from "react";

type DatePickerProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function DatePicker({ name, value, onChange, required }: DatePickerProps) {
  return (
    <input
      type="date"
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full px-3 py-2 rounded border border-border bg-card/50 focus:outline-none focus:border-[hsl(var(--ink-purple))]"
    />
  );
}