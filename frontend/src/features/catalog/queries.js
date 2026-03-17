import { useQuery } from "@tanstack/react-query";
import { getProductsByCity, getProductsBySeller } from "./api";

export function useMarketProductsQuery({ city, userToken, adminToken, enabled }) {
  return useQuery({
    queryKey: ["products", "city", city],
    queryFn: () => getProductsByCity({ city, userToken, adminToken }),
    enabled,
  });
}

export function useSellerProductsQuery({ sellerId, userToken, adminToken, enabled }) {
  return useQuery({
    queryKey: ["products", "seller", sellerId],
    queryFn: () => getProductsBySeller({ sellerId, userToken, adminToken }),
    enabled,
  });
}
