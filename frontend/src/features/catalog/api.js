import { apiRequest } from "../../shared/api/http";

export function getProductsByCity({ city, userToken, adminToken }) {
  return apiRequest(`/api/v1/shoppingnrent/product/getProductsByCity?city=${encodeURIComponent(city)}`, {
    auth: "both",
    userToken,
    adminToken,
  });
}

export function getProductsBySeller({ sellerId, userToken, adminToken }) {
  return apiRequest(
    `/api/v1/shoppingnrent/product/getProductsBySeller?createdBy=${encodeURIComponent(sellerId)}`,
    {
      auth: "both",
      userToken,
      adminToken,
    }
  );
}

export function createProduct({ values, userToken, adminToken }) {
  return apiRequest("/api/v1/shoppingnrent/product/create", {
    method: "POST",
    auth: "both",
    userToken,
    adminToken,
    body: {
      ...values,
      price: Number(values.price),
      discount: values.discount ? Number(values.discount) : undefined,
    },
  });
}

export function updateProduct({ id, values, userToken, adminToken }) {
  return apiRequest(`/api/v1/shoppingnrent/product/update?id=${encodeURIComponent(id)}`, {
    method: "POST",
    auth: "both",
    userToken,
    adminToken,
    body: {
      ...values,
      price: values.price ? Number(values.price) : undefined,
      discount: values.discount ? Number(values.discount) : undefined,
    },
  });
}

export function deleteProducts({ productIds, userToken }) {
  return apiRequest("/api/v1/shoppingnrent/product/delete", {
    method: "POST",
    auth: "user",
    userToken,
    body: { product: productIds },
  });
}
