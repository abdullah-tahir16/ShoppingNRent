import { apiRequest } from "../../shared/api/http";

export function registerUser(values) {
  return apiRequest("/api/v1/shoppingnrent/user/create", {
    method: "POST",
    body: values,
  });
}

export function loginUser(values) {
  const identity = values.identity.trim();

  return apiRequest("/api/v1/shoppingnrent/user/login", {
    method: "POST",
    body: {
      password: values.password,
      ...(identity.includes("@") ? { email: identity } : { username: identity }),
    },
  });
}

export function loginAdmin(values) {
  return apiRequest("/api/v1/shoppingnrent/dashboard/login", {
    method: "POST",
    body: values,
  });
}
