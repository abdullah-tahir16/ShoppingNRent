import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "react-final-form";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { useSession } from "../../../app/providers/SessionProvider";
import { FormField } from "../../../shared/components/form/FormField";
import { FormTextarea } from "../../../shared/components/form/FormTextarea";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { SectionCard } from "../../../shared/components/ui/SectionCard";
import { createZodValidator } from "../../../shared/lib/createZodValidator";
import { createProduct, deleteProducts, updateProduct } from "../api";
import { ProductCard } from "../components/ProductCard";
import { useSellerProductsQuery } from "../queries";

const productSchema = z.object({
  userId: z.string().min(1, "Creator user id is required"),
  name: z.string().min(2, "Product name is required"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  city: z.string().min(2, "City is required"),
  description: z.string().optional(),
  pictureLink: z.string().optional(),
  details: z.string().optional(),
  category: z.string().optional(),
  condition: z.string().optional(),
  make: z.string().optional(),
  discount: z.union([z.string(), z.number()]).optional(),
  otherInfo: z.string().optional(),
});

const validate = createZodValidator(productSchema);

const emptyProduct = {
  userId: "",
  name: "",
  price: "",
  city: "",
  description: "",
  pictureLink: "",
  details: "",
  category: "",
  condition: "",
  make: "",
  discount: "",
  otherInfo: "",
};

export function SellerStudioContainer() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { userSession, adminSession, hasDualSession } = useSession();
  const [sellerId, setSellerId] = useState(userSession.id || "");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    if (location.state?.editProduct) {
      setEditingProduct(location.state.editProduct);
      setSellerId(location.state.editProduct.createdBy || userSession.id || "");
    }
  }, [location.state, userSession.id]);

  const sellerProductsQuery = useSellerProductsQuery({
    sellerId,
    userToken: userSession.token,
    adminToken: adminSession.token,
    enabled: hasDualSession && Boolean(sellerId),
  });

  const saveMutation = useMutation({
    mutationFn: ({ values, productId }) =>
      productId
        ? updateProduct({ id: productId, values, userToken: userSession.token, adminToken: adminSession.token })
        : createProduct({ values, userToken: userSession.token, adminToken: adminSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "seller", sellerId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (ids) => deleteProducts({ productIds: ids, userToken: userSession.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "seller", sellerId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteInput("");
    },
  });

  const initialValues = useMemo(() => {
    if (!editingProduct) {
      return { ...emptyProduct, userId: sellerId || userSession.id || "" };
    }

    return {
      userId: editingProduct.createdBy || sellerId || userSession.id || "",
      name: editingProduct.name || "",
      price: String(editingProduct.price || ""),
      city: editingProduct.city || "",
      description: editingProduct.description || "",
      pictureLink: editingProduct.pictureLink || "",
      details: editingProduct.details || "",
      category: editingProduct.category || "",
      condition: editingProduct.condition || "",
      make: editingProduct.make || "",
      discount: String(editingProduct.discount || ""),
      otherInfo: editingProduct.otherInformation || "",
    };
  }, [editingProduct, sellerId, userSession.id]);

  const products = sellerProductsQuery.data?.data || [];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard
        eyebrow="Seller Studio"
        title={editingProduct ? "Edit Product" : "Create Product"}
        description="This form is handled with React Final Form and Zod, then persisted through a mutation."
      >
        {!hasDualSession ? (
          <EmptyState title="Dual session required" description="Create and update product routes currently require both sessions." />
        ) : (
          <Form
            key={editingProduct?._id || "new"}
            onSubmit={async (values, form) => {
              await saveMutation.mutateAsync({ values, productId: editingProduct?._id });
              setEditingProduct(null);
              form.restart({ ...emptyProduct, userId: sellerId || userSession.id || "" });
            }}
            validate={validate}
            initialValues={initialValues}
            render={({ handleSubmit, submitting, form }) => (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <FormField name="userId" label="Creator user id" />
                <FormField name="name" label="Product name" />
                <FormField name="price" label="Price" type="number" />
                <FormField name="city" label="City" />
                <FormField name="category" label="Category" />
                <FormField name="condition" label="Condition" />
                <FormField name="make" label="Make" />
                <FormField name="discount" label="Discount %" type="number" />
                <FormField name="pictureLink" label="Picture URL" />
                <div className="md:col-span-2">
                  <FormTextarea name="description" label="Description" />
                </div>
                <div className="md:col-span-2">
                  <FormTextarea name="details" label="Details" />
                </div>
                <div className="md:col-span-2">
                  <FormTextarea name="otherInfo" label="Other Info" />
                </div>
                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button className="primary-button" type="submit" disabled={submitting || saveMutation.isPending}>
                    {editingProduct ? "Update product" : "Create product"}
                  </button>
                  {editingProduct ? (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        form.restart({ ...emptyProduct, userId: sellerId || userSession.id || "" });
                      }}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>
                {saveMutation.isError ? <p className="md:col-span-2 text-sm text-rose-600">{saveMutation.error.message}</p> : null}
                {saveMutation.isSuccess ? <p className="md:col-span-2 text-sm text-emerald-700">Product saved successfully.</p> : null}
              </form>
            )}
          />
        )}
      </SectionCard>

      <SectionCard
        eyebrow="Seller Catalog"
        title="Manage Existing Products"
        description="Seller results are cached by seller id. Editing a card feeds the form on the left."
      >
        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <input className="field-input flex-1" value={sellerId} onChange={(event) => setSellerId(event.target.value)} placeholder="Seller user id" />
          <button className="secondary-button" type="button" onClick={() => sellerProductsQuery.refetch()}>
            Refresh list
          </button>
        </div>
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            className="field-input flex-1"
            value={deleteInput}
            onChange={(event) => setDeleteInput(event.target.value)}
            placeholder="Comma-separated product ids"
          />
          <button
            className="secondary-button"
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(
                deleteInput
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean)
              )
            }
          >
            Delete products
          </button>
        </div>
        {sellerProductsQuery.isLoading ? <p className="text-sm text-stone-500">Loading seller products...</p> : null}
        {sellerProductsQuery.isError ? <p className="text-sm text-rose-600">{sellerProductsQuery.error.message}</p> : null}
        {products.length ? (
          <div className="grid gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                editLinkState={(item) => ({ editProduct: item })}
                orderLinkState={(item) => ({ prefillProduct: item })}
              />
            ))}
          </div>
        ) : !sellerProductsQuery.isLoading ? (
          <EmptyState title="No seller products" description="Load a seller id after both sessions are active." />
        ) : null}
      </SectionCard>
    </div>
  );
}
