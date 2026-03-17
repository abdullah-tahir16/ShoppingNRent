import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./api";

export function useProfileQuery({ id, userToken, adminToken, enabled }) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile({ id, userToken, adminToken }),
    enabled,
  });
}
