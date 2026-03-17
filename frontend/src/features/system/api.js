import { apiRequest } from "../../shared/api/http";

export function getHealth() {
  return apiRequest("/health");
}
