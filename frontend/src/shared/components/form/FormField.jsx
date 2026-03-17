import { Field } from "react-final-form";

export function FormField({ name, label, type = "text", placeholder, disabled = false }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
          <input
            {...input}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className="field-input"
          />
          {meta.touched && meta.error ? <span className="mt-2 block text-sm text-rose-600">{meta.error}</span> : null}
        </label>
      )}
    </Field>
  );
}
