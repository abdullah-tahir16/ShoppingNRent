const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function apiRequest(
  path,
  { method = "GET", body, auth = "none", userToken = "", adminToken = "" } = {}
) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth === "user" && userToken) {
    headers.Authorization = `Bearer ${userToken}`;
  }

  if (auth === "admin" && adminToken) {
    headers.Authorization = `Bearer ${adminToken}`;
  }

  if (auth === "both") {
    if (userToken) {
      headers.Authorization = `Bearer ${userToken}`;
    }
    if (adminToken) {
      headers["x-admin-authorization"] = `Bearer ${adminToken}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.msg || payload.message || payload.error || "Request failed";
    throw new Error(message);
  }

  return payload;
}
