import { useMutation } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { z } from "zod";
import { registerUser } from "../api";
import { SectionCard } from "../../../shared/components/ui/SectionCard";
import { FormField } from "../../../shared/components/form/FormField";
import { FormSelect } from "../../../shared/components/form/FormSelect";
import { createZodValidator } from "../../../shared/lib/createZodValidator";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  cnic: z.string().min(5, "CNIC is required"),
  city: z.string().min(2, "City is required"),
  email: z.email("Enter a valid email"),
  username: z.string().min(3, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["buyer", "seller", "both"]),
  language: z.enum(["english", "urdu"]),
});

const validate = createZodValidator(registerSchema);

export function RegisterUserContainer() {
  const mutation = useMutation({
    mutationFn: registerUser,
  });

  return (
    <SectionCard
      eyebrow="Step 1"
      title="Register User"
      description="Creates a real backend account. Approval is still required before user login succeeds."
      aside="Validation runs through Zod before the request is sent."
    >
      <Form
        onSubmit={async (values, form) => {
          await mutation.mutateAsync(values);
          form.reset();
        }}
        validate={validate}
        initialValues={{
          role: "buyer",
          language: "english",
        }}
        render={({ handleSubmit, submitting }) => (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <FormField name="name" label="Full name" />
            <FormField name="cnic" label="CNIC" />
            <FormField name="city" label="City" />
            <FormField name="email" label="Email" type="email" />
            <FormField name="username" label="Username" />
            <FormField name="password" label="Password" type="password" />
            <FormSelect
              name="role"
              label="Role"
              options={[
                { value: "buyer", label: "Buyer" },
                { value: "seller", label: "Seller" },
                { value: "both", label: "Both" },
              ]}
            />
            <FormSelect
              name="language"
              label="Language"
              options={[
                { value: "english", label: "English" },
                { value: "urdu", label: "Urdu" },
              ]}
            />
            <button className="primary-button md:col-span-2" type="submit" disabled={submitting || mutation.isPending}>
              Create account
            </button>
            {mutation.isSuccess ? (
              <p className="md:col-span-2 text-sm text-emerald-700">{mutation.data.msg}</p>
            ) : null}
            {mutation.isError ? (
              <p className="md:col-span-2 text-sm text-rose-600">{mutation.error.message}</p>
            ) : null}
          </form>
        )}
      />
    </SectionCard>
  );
}
