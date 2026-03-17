import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "./api";

export function useRoleUsersQuery(role, adminToken) {
  return useQuery({
    queryKey: ["admin-users", role],
    queryFn: () => getUsersByRole({ role, adminToken }),
    enabled: Boolean(adminToken),
  });
}
