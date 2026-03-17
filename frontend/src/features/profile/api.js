import { apiRequest } from "../../shared/api/http";

export function getProfile({ id, userToken, adminToken }) {
  return apiRequest(`/api/v1/shoppingnrent/user/get?id=${encodeURIComponent(id)}`, {
    auth: "both",
    userToken,
    adminToken,
  });
}

export function updateProfile({ id, values, userToken }) {
  return apiRequest(`/api/v1/shoppingnrent/user/update?id=${encodeURIComponent(id)}`, {
    method: "POST",
    auth: "user",
    userToken,
    body: values,
  });
}

export function updateLanguage({ id, language, userToken }) {
  return apiRequest(`/api/v1/shoppingnrent/user/language?id=${encodeURIComponent(id)}`, {
    method: "POST",
    auth: "user",
    userToken,
    body: { language },
  });
}
