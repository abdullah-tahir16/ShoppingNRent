import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { z } from "zod";
import { useSession } from "../../../app/providers/SessionProvider";
import { FormField } from "../../../shared/components/form/FormField";
import { FormSelect } from "../../../shared/components/form/FormSelect";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { SectionCard } from "../../../shared/components/ui/SectionCard";
import { createZodValidator } from "../../../shared/lib/createZodValidator";
import { updateLanguage, updateProfile } from "../api";
import { useProfileQuery } from "../queries";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  city: z.string().min(2, "City is required"),
  email: z.email("Enter a valid email"),
  username: z.string().min(3, "Username is required"),
  role: z.enum(["buyer", "seller", "both"]),
});

const validate = createZodValidator(profileSchema);

export function ProfileWorkspaceContainer() {
  const queryClient = useQueryClient();
  const { userSession, adminSession, hasDualSession } = useSession();
  const [profileId, setProfileId] = useState(userSession.id || "");
  const [language, setLanguage] = useState("english");

  const profileQuery = useProfileQuery({
    id: profileId,
    userToken: userSession.token,
    adminToken: adminSession.token,
    enabled: hasDualSession && Boolean(profileId),
  });

  const updateMutation = useMutation({
    mutationFn: (values) => updateProfile({ id: profileId, values, userToken: userSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
    },
  });

  const languageMutation = useMutation({
    mutationFn: () => updateLanguage({ id: profileId, language, userToken: userSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
    },
  });

  const initialValues = useMemo(
    () => ({
      name: profileQuery.data?.data?.name || "",
      city: profileQuery.data?.data?.city || "",
      email: profileQuery.data?.data?.email || "",
      username: profileQuery.data?.data?.username || "",
      role: profileQuery.data?.data?.role || "buyer",
    }),
    [profileQuery.data]
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <SectionCard
        eyebrow="Profile"
        title="Load And Edit"
        description="Profile reads use the dual-auth route, while updates use the user-auth route."
      >
        {!hasDualSession ? (
          <EmptyState title="Dual session required" description="Profile reads require both sessions in the current backend." />
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-3 md:flex-row">
              <input className="field-input flex-1" value={profileId} onChange={(event) => setProfileId(event.target.value)} placeholder="User id" />
              <button className="secondary-button" type="button" onClick={() => profileQuery.refetch()}>
                Load profile
              </button>
            </div>
            <Form
              key={`${profileId}-${profileQuery.dataUpdatedAt}`}
              onSubmit={(values) => updateMutation.mutateAsync(values)}
              validate={validate}
              initialValues={initialValues}
              render={({ handleSubmit, submitting }) => (
                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                  <FormField name="name" label="Name" />
                  <FormField name="city" label="City" />
                  <FormField name="email" label="Email" type="email" />
                  <FormField name="username" label="Username" />
                  <FormSelect
                    name="role"
                    label="Role"
                    options={[
                      { value: "buyer", label: "Buyer" },
                      { value: "seller", label: "Seller" },
                      { value: "both", label: "Both" },
                    ]}
                  />
                  <button className="primary-button md:col-span-2" type="submit" disabled={submitting || updateMutation.isPending}>
                    Save profile
                  </button>
                </form>
              )}
            />
            {updateMutation.isError ? <p className="mt-4 text-sm text-rose-600">{updateMutation.error.message}</p> : null}
          </>
        )}
      </SectionCard>

      <SectionCard
        eyebrow="Profile"
        title="Language And Payload"
        description="Language updates are isolated in their own mutation so the form remains focused."
      >
        {!hasDualSession ? (
          <EmptyState title="Dual session required" description="Load the profile after both sessions are active." />
        ) : (
          <>
            <div className="flex flex-col gap-3 md:flex-row">
              <select className="field-input flex-1" value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="english">English</option>
                <option value="urdu">Urdu</option>
              </select>
              <button className="secondary-button" type="button" onClick={() => languageMutation.mutate()}>
                Save language
              </button>
            </div>
            {profileQuery.data?.data ? (
              <pre className="mt-5 overflow-auto rounded-3xl bg-stone-900 p-5 text-xs text-stone-100">
                {JSON.stringify(profileQuery.data.data, null, 2)}
              </pre>
            ) : profileQuery.isLoading ? (
              <p className="mt-5 text-sm text-stone-500">Loading profile...</p>
            ) : profileQuery.isError ? (
              <p className="mt-5 text-sm text-rose-600">{profileQuery.error.message}</p>
            ) : (
              <EmptyState title="No profile loaded" description="Enter a user id and load it from the left panel." />
            )}
          </>
        )}
      </SectionCard>
    </div>
  );
}
