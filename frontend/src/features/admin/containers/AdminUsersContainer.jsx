import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveUser } from "../api";
import { useRoleUsersQuery } from "../queries";
import { useSession } from "../../../app/providers/SessionProvider";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { SectionCard } from "../../../shared/components/ui/SectionCard";
import { UserCard } from "../components/UserCard";

const sections = [
  { key: "buyers", label: "Buyers" },
  { key: "sellers", label: "Sellers" },
  { key: "both", label: "Hybrid Users" },
];

export function AdminUsersContainer() {
  const queryClient = useQueryClient();
  const { adminSession } = useSession();

  const buyersQuery = useRoleUsersQuery("buyers", adminSession.token);
  const sellersQuery = useRoleUsersQuery("sellers", adminSession.token);
  const bothQuery = useRoleUsersQuery("both", adminSession.token);

  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }) => approveUser({ id, isApproved, adminToken: adminSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const lookup = {
    buyers: buyersQuery,
    sellers: sellersQuery,
    both: bothQuery,
  };

  return (
    <SectionCard
      eyebrow="Administrator"
      title="Approval Workspace"
      description="Role lists are loaded with React Query and approval state is refreshed through query invalidation."
      aside="The backend has three separate role endpoints, so this page keeps three cached queries."
    >
      {!adminSession.token ? (
        <EmptyState title="Admin session required" description="Login as admin on the Journey page first." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {sections.map((section) => {
            const query = lookup[section.key];
            const users = query.data?.data || [];

            return (
              <section key={section.key} className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-stone-950">{section.label}</h3>
                  <button className="secondary-button" type="button" onClick={() => query.refetch()}>
                    Refresh
                  </button>
                </div>
                <div className="grid gap-4">
                  {query.isLoading ? <p className="text-sm text-stone-500">Loading {section.label.toLowerCase()}...</p> : null}
                  {query.isError ? <p className="text-sm text-rose-600">{query.error.message}</p> : null}
                  {users.length ? (
                    users.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        busy={approveMutation.isPending}
                        onCopyId={(id) => navigator.clipboard.writeText(id)}
                        onToggleApproval={(target) =>
                          approveMutation.mutate({ id: target._id, isApproved: !target.approved })
                        }
                      />
                    ))
                  ) : !query.isLoading ? (
                    <EmptyState
                      title={`No ${section.label.toLowerCase()} loaded`}
                      description="Use refresh after the admin session is active."
                    />
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
