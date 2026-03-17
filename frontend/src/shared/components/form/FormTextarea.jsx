import { Field } from "react-final-form";

export function FormTextarea({ name, label, placeholder }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-800">{label}</span>
          <textarea {...input} placeholder={placeholder} className="field-input min-h-28" />
          {meta.touched && meta.error ? <span className="mt-2 block text-sm text-rose-600">{meta.error}</span> : null}
        </label>
      )}
    </Field>
  );
}
