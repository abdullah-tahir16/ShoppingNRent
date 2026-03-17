import { useQuery } from "@tanstack/react-query";
import { getOrderById, getOrders } from "./api";

export function useOrdersQuery({ userId, userToken, enabled }) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => getOrders({ userId, userToken }),
    enabled,
  });
}

export function useOrderDetailQuery({ orderId, userToken, enabled }) {
  return useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: () => getOrderById({ orderId, userToken }),
    enabled,
  });
}
