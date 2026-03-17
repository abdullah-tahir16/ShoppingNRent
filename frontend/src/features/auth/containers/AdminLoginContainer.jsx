import { useMutation } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { z } from "zod";
import { loginAdmin } from "../api";
import { useSession } from "../../../app/providers/SessionProvider";
import { FormField } from "../../../shared/components/form/FormField";
import { createZodValidator } from "../../../shared/lib/createZodValidator";
import { SectionCard } from "../../../shared/components/ui/SectionCard";

const adminSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const validate = createZodValidator(adminSchema);

export function AdminLoginContainer() {
  const { setAdminSession } = useSession();
  const mutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess(data) {
      setAdminSession({ token: data.token });
    },
  });

  return (
    <SectionCard
      eyebrow="Step 3"
      title="Admin Login"
      description="Admin session is required for approval flows and dual-auth routes."
      aside="Seeded credentials: superadmin / admin12345"
    >
      <Form
        onSubmit={(values) => mutation.mutateAsync(values)}
        validate={validate}
        render={({ handleSubmit, submitting }) => (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField name="username" label="Admin username" />
            <FormField name="password" label="Password" type="password" />
            <button className="primary-button" type="submit" disabled={submitting || mutation.isPending}>
              Login admin
            </button>
            {mutation.isSuccess ? <p className="text-sm text-emerald-700">Admin session connected.</p> : null}
            {mutation.isError ? <p className="text-sm text-rose-600">{mutation.error.message}</p> : null}
          </form>
        )}
      />
    </SectionCard>
  );
}
