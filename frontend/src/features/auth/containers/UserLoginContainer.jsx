import { useMutation } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginUser } from "../api";
import { useSession } from "../../../app/providers/SessionProvider";
import { FormField } from "../../../shared/components/form/FormField";
import { createZodValidator } from "../../../shared/lib/createZodValidator";
import { SectionCard } from "../../../shared/components/ui/SectionCard";

const loginSchema = z.object({
  identity: z.string().min(3, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

const validate = createZodValidator(loginSchema);

export function UserLoginContainer() {
  const navigate = useNavigate();
  const { setUserSession } = useSession();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess(data) {
      setUserSession({ token: data.token, id: data.id });
      navigate("/marketplace");
    },
  });

  return (
    <SectionCard
      eyebrow="Step 2"
      title="User Login"
      description="Stores the user token and id in shared session state."
    >
      <Form
        onSubmit={(values) => mutation.mutateAsync(values)}
        validate={validate}
        render={({ handleSubmit, submitting }) => (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField name="identity" label="Email or username" />
            <FormField name="password" label="Password" type="password" />
            <button className="primary-button" type="submit" disabled={submitting || mutation.isPending}>
              Login user
            </button>
            {mutation.isError ? <p className="text-sm text-rose-600">{mutation.error.message}</p> : null}
          </form>
        )}
      />
    </SectionCard>
  );
}
