import type { InputHTMLAttributes } from "react";

interface AuthInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  primaryColor: string;
}

export default function AuthInput({
  label,
  value,
  onChange,
  primaryColor,
  id,
  ...props
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white"
        onFocus={(event) => {
          event.currentTarget.style.borderColor =
            primaryColor;

          event.currentTarget.style.boxShadow =
            `0 0 0 3px ${primaryColor}18`;
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = "";
          event.currentTarget.style.boxShadow = "";
        }}
        {...props}
      />
    </div>
  );
}