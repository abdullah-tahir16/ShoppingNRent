import { apiRequest } from "../../shared/api/http";

export function createOrder({ values, userToken }) {
  return apiRequest("/api/v1/shoppingnrent/order/create", {
    method: "POST",
    auth: "user",
    userToken,
    body: {
      ...values,
      product: values.product
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      total_price: Number(values.total_price),
      discount: values.discount ? Number(values.discount) : undefined,
    },
  });
}

export function getOrders({ userId, userToken }) {
  return apiRequest(`/api/v1/shoppingnrent/order/all/${encodeURIComponent(userId)}`, {
    auth: "user",
    userToken,
  });
}

export function getOrderById({ orderId, userToken }) {
  return apiRequest(`/api/v1/shoppingnrent/order/${encodeURIComponent(orderId)}`, {
    auth: "user",
    userToken,
  });
}

export function deleteOrder({ orderId, userToken }) {
  return apiRequest(`/api/v1/shoppingnrent/order/${encodeURIComponent(orderId)}`, {
    method: "DELETE",
    auth: "user",
    userToken,
  });
}
