import { Field } from "react-final-form";

export function FormSelect({ name, label, options }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
          <select {...input} className="field-input">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {meta.touched && meta.error ? <span className="mt-2 block text-sm text-rose-600">{meta.error}</span> : null}
        </label>
      )}
    </Field>
  );
}
