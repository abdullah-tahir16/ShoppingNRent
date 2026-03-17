import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { useSession } from "../../../app/providers/SessionProvider";
import { FormField } from "../../../shared/components/form/FormField";
import { FormSelect } from "../../../shared/components/form/FormSelect";
import { FormTextarea } from "../../../shared/components/form/FormTextarea";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { SectionCard } from "../../../shared/components/ui/SectionCard";
import { createZodValidator } from "../../../shared/lib/createZodValidator";
import { createOrder, deleteOrder } from "../api";
import { OrderCard } from "../components/OrderCard";
import { useOrderDetailQuery, useOrdersQuery } from "../queries";

const orderSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  address: z.string().min(5, "Address is required"),
  description: z.string().optional(),
  ordered_by: z.string().min(1, "Buyer id is required"),
  seller: z.string().min(1, "Seller id is required"),
  product: z.string().min(1, "At least one product id is required"),
  order_status: z.enum(["approved", "dispatched", "delivered"]),
  category: z.enum(["sold", "rented"]),
  total_price: z.coerce.number().positive("Total price must be greater than zero"),
  discount: z.union([z.string(), z.number()]).optional(),
  email: z.email("Enter a valid email").or(z.literal("")),
});

const validate = createZodValidator(orderSchema);

export function OrderComposerContainer() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { userSession, hasUserSession } = useSession();
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const prefillProduct = location.state?.prefillProduct;

  const initialValues = useMemo(
    () => ({
      name: "",
      address: "",
      description: "",
      ordered_by: userSession.id || "",
      seller: prefillProduct?.createdBy || "",
      product: prefillProduct?._id || "",
      order_status: "approved",
      category: "sold",
      total_price: prefillProduct?.price ? String(prefillProduct.price) : "",
      discount: prefillProduct?.discount ? String(prefillProduct.discount) : "",
      email: "",
    }),
    [prefillProduct, userSession.id]
  );

  useEffect(() => {
    if (prefillProduct?._id) {
      setSelectedOrderId("");
    }
  }, [prefillProduct]);

  const ordersQuery = useOrdersQuery({
    userId: userSession.id,
    userToken: userSession.token,
    enabled: hasUserSession && Boolean(userSession.id),
  });

  const detailQuery = useOrderDetailQuery({
    orderId: selectedOrderId,
    userToken: userSession.token,
    enabled: hasUserSession && Boolean(selectedOrderId),
  });

  const createMutation = useMutation({
    mutationFn: (values) => createOrder({ values, userToken: userSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", userSession.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId) => deleteOrder({ orderId, userToken: userSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", userSession.id] });
      setSelectedOrderId("");
    },
  });

  const orders = ordersQuery.data?.data || [];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <SectionCard
        eyebrow="Orders"
        title="Create Order"
        description="Final Form keeps the order form state controlled while mutations write directly to the backend."
      >
        {!hasUserSession ? (
          <EmptyState title="User session required" description="Login as a user on the Journey page first." />
        ) : (
          <Form
            onSubmit={async (values, form) => {
              await createMutation.mutateAsync(values);
              form.restart({ ...initialValues, seller: "", product: "", total_price: "", discount: "" });
            }}
            validate={validate}
            initialValues={initialValues}
            render={({ handleSubmit, submitting }) => (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <FormField name="name" label="Customer name" />
                <FormField name="address" label="Address" />
                <FormField name="ordered_by" label="Buyer id" />
                <FormField name="seller" label="Seller id" />
                <FormField name="product" label="Product ids" />
                <FormField name="total_price" label="Total price" type="number" />
                <FormField name="discount" label="Discount" type="number" />
                <FormField name="email" label="Notification email" type="email" />
                <FormSelect
                  name="order_status"
                  label="Status"
                  options={[
                    { value: "approved", label: "Approved" },
                    { value: "dispatched", label: "Dispatched" },
                    { value: "delivered", label: "Delivered" },
                  ]}
                />
                <FormSelect
                  name="category"
                  label="Category"
                  options={[
                    { value: "sold", label: "Sold" },
                    { value: "rented", label: "Rented" },
                  ]}
                />
                <div className="md:col-span-2">
                  <FormTextarea name="description" label="Description" />
                </div>
                <button className="primary-button md:col-span-2" type="submit" disabled={submitting || createMutation.isPending}>
                  Place order
                </button>
                {createMutation.isError ? <p className="md:col-span-2 text-sm text-rose-600">{createMutation.error.message}</p> : null}
                {createMutation.isSuccess ? <p className="md:col-span-2 text-sm text-emerald-700">Order created successfully.</p> : null}
              </form>
            )}
          />
        )}
      </SectionCard>

      <SectionCard
        eyebrow="Orders"
        title="History And Detail"
        description="Order history is cached by user id, and detail is fetched by selected order id."
      >
        {!hasUserSession ? (
          <EmptyState title="User session required" description="Login as a user first." />
        ) : (
          <>
            {detailQuery.data?.data ? (
              <div className="mb-5 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <h3 className="text-lg font-semibold text-stone-950">Selected order payload</h3>
                <pre className="mt-4 overflow-auto rounded-2xl bg-stone-900 p-4 text-xs text-stone-100">
                  {JSON.stringify(detailQuery.data.data, null, 2)}
                </pre>
              </div>
            ) : null}
            {ordersQuery.isLoading ? <p className="text-sm text-stone-500">Loading orders...</p> : null}
            {ordersQuery.isError ? <p className="text-sm text-rose-600">{ordersQuery.error.message}</p> : null}
            {orders.length ? (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    deleting={deleteMutation.isPending}
                    onInspect={setSelectedOrderId}
                    onDelete={deleteMutation.mutate}
                  />
                ))}
              </div>
            ) : !ordersQuery.isLoading ? (
              <EmptyState title="No orders found" description="Seed the demo data or place an order from the form on the left." />
            ) : null}
          </>
        )}
      </SectionCard>
    </div>
  );
}
