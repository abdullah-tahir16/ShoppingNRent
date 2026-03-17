import { apiRequest } from "../../shared/api/http";

export function getUsersByRole({ role, adminToken }) {
  return apiRequest(`/api/v1/shoppingnrent/dashboard/${role}/all`, {
    auth: "admin",
    adminToken,
  });
}

export function approveUser({ id, isApproved, adminToken }) {
  return apiRequest(`/api/v1/shoppingnrent/user/approve?id=${encodeURIComponent(id)}&is_approved=${isApproved}`, {
    method: "POST",
    auth: "admin",
    adminToken,
    body: { is_approved: isApproved },
  });
}
