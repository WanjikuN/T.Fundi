import { Eye, EyeOff } from "lucide-react";

interface AuthPasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  primaryColor: string;
  autoComplete?: string;
}

export default function AuthPasswordInput({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  primaryColor,
  autoComplete,
}: AuthPasswordInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white"
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
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:text-slate-700"
          aria-label={
            visible ? "Hide password" : "Show password"
          }
        >
          {visible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}