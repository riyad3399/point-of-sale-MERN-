import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

type PurchaseItem = {
  product?: string;
  productName?: string;
  purchaseQty: number;
  purchasePrice: number;
  returnQty?: number;
  discount?: number;
  lineTotal?: number;
  _id?: string;
};

type Purchase = {
  _id: string;
  invoiceNumber?: string | number;
  invoiceNo?: string | number;
  supplier?: { _id?: string; name?: string } | string;
  supplierName?: string;
  date?: string;
  items?: any[];
  total?: number;
  grandTotal?: number;
};

export default function PurchaseReturn() {
  const { token, user } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URI;

  console.log(user);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      supplier: null as any,
      invoice: null as any,
      returnDate: new Date().toISOString().slice(0, 10),
      reason: "",
    },
  });

  const returnDate = watch("returnDate");
  const watchedSupplier = watch("supplier");
  const watchedInvoice = watch("invoice");

  const [suppliers, setSuppliers] = useState<
    { value: string; label: string }[]
  >([]);
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([]);
  const [invoices, setInvoices] = useState<{ value: string; label: string }[]>(
    []
  );
  const [purchasesCache, setPurchasesCache] = useState<
    Record<string, Purchase>
  >({});

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  console.log(allPurchases);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data ?? res.data ?? [];
        setSuppliers(
          data.map((s: any) => ({
            value: s._id ?? s.id ?? s.value,
            label: s.name ?? s.label ?? s.title ?? "Unknown",
          }))
        );
      } catch (err) {
        console.warn(
          "Failed to load suppliers (endpoint /suppliers). If you don't have one, pass supplier/invoice client-side.",
          err
        );
      }
    };
    fetchSuppliers();
  }, [BASE_URL, token]);

  useEffect(() => {
    const handleGetAllPurchases = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data ?? res.data ?? [];
        setAllPurchases(data);

        const invoiceOptions = data
          .map((inv: any) => {
            const val = inv.invoiceNumber ?? inv.invoiceNo ?? inv._id;
            return {
              value: String(val),
              label: String(inv.invoiceNumber ?? inv.invoiceNo ?? inv._id),
            };
          })
          .filter(
            (v: any, i: number, arr: any[]) =>
              arr.findIndex((a: any) => a.value === v.value) === i
          );

        setInvoices(invoiceOptions);

        const cache: Record<string, Purchase> = {};
        data.forEach((inv: any) => {
          const key = String(inv.invoiceNumber ?? inv.invoiceNo ?? inv._id);
          cache[key] = inv;
        });
        setPurchasesCache(cache);
      } catch (error) {
        console.error("Failed to load purchases", error);
      }
    };
    handleGetAllPurchases();
  }, [BASE_URL, token]);

  useEffect(() => {
    if (!watchedSupplier) {
      const invoiceOptions = allPurchases
        .map((inv: any) => {
          const val = inv.invoiceNumber ?? inv.invoiceNo ?? inv._id;
          return {
            value: String(val),
            label: String(inv.invoiceNumber ?? inv.invoiceNo ?? inv._id),
          };
        })
        .filter(
          (v: any, i: number, arr: any[]) =>
            arr.findIndex((a: any) => a.value === v.value) === i
        );
      setInvoices(invoiceOptions);
      return;
    }

    const sid = watchedSupplier?.value;
    const filtered = allPurchases.filter((p) => {
      if (!p) return false;
      if (typeof p.supplier === "string") {
        return p.supplier === sid || p.supplierName === watchedSupplier.label;
      }
      if (p.supplier && typeof p.supplier === "object") {
        return (
          p.supplier._id === sid || p.supplier.name === watchedSupplier.label
        );
      }
      if (p.supplierName) {
        return p.supplierName === watchedSupplier.label;
      }
      return false;
    });

    const invoiceOptions = filtered
      .map((inv: any) => {
        const val = inv.invoiceNumber ?? inv.invoiceNo ?? inv._id;
        return {
          value: String(val),
          label: String(inv.invoiceNumber ?? inv.invoiceNo ?? inv._id),
        };
      })
      .filter(
        (v: any, i: number, arr: any[]) =>
          arr.findIndex((a: any) => a.value === v.value) === i
      );

    setInvoices(invoiceOptions);
    if (
      watchedInvoice &&
      !invoiceOptions.find((i) => i.value === watchedInvoice.value)
    ) {
      setValue("invoice", null);
      setSelectedPurchase(null);
      setItems([]);
    }
  }, [watchedSupplier, allPurchases, watchedInvoice, setValue]);

  useEffect(() => {
    const inv = watchedInvoice;
    if (!inv) {
      setSelectedPurchase(null);
      setItems([]);
      return;
    }
    const key = String(inv.value);
    const p = purchasesCache[key];
    if (!p) {
      const byId = allPurchases.find((ap) => String(ap._id) === key);
      if (byId) {
        setSelectedPurchase(byId);
        buildItemsFromPurchase(byId);
        syncSupplierSelection(byId);
        return;
      }
      console.warn("Selected invoice not found in cache", key);
      setSelectedPurchase(null);
      setItems([]);
      return;
    }
    setSelectedPurchase(p);
    buildItemsFromPurchase(p);
    syncSupplierSelection(p);
  }, [watchedInvoice, purchasesCache, allPurchases]);

  const syncSupplierSelection = (p: Purchase) => {
    const sid = typeof p.supplier === "string" ? p.supplier : p.supplier?._id;
    const sname =
      typeof p.supplier === "string"
        ? p.supplier
        : p.supplier?.name ?? p.supplierName;
    if (!sid && !sname) return;
    const found =
      suppliers.find((s) => s.value === sid) ??
      suppliers.find((s) => s.label === sname);
    if (found) {
      setValue("supplier", found, { shouldDirty: true });
    } else {
      setValue(
        "supplier",
        { value: sid ?? sname, label: sname ?? String(sid) },
        { shouldDirty: true }
      );
    }
  };

  const buildItemsFromPurchase = (p: Purchase) => {
    const rows: PurchaseItem[] = (p.items ?? []).map((it: any) => {
      const purchaseQty = Number(it.quantity ?? it.qty ?? it.purchaseQty ?? 0);
      const purchasePrice = Number(
        it.price ?? it.purchasePrice ?? it.unitPrice ?? 0
      );
      const discount = Number(it.discount ?? 0);
      return {
        _id: it._id ?? it.productId ?? it.product ?? Math.random().toString(),
        product: it.productId ?? it.product ?? it._id,
        productName: it.productName,
        purchaseQty,
        purchasePrice,
        discount,
        returnQty: 0,
        lineTotal: 0,
      };
    });
    setItems(rows);
  };

  console.log(items);

  const onReturnQtyChange = (index: number, val: number) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const safeVal = Number.isFinite(val)
          ? Math.max(0, Math.min(val, it.purchaseQty))
          : 0;
        const unitAfterDiscount = (it.purchasePrice ?? 0) - (it.discount ?? 0);
        const lineTotal = safeVal * unitAfterDiscount;
        return { ...it, returnQty: safeVal, lineTotal };
      })
    );
  };

  const grandTotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.lineTotal ?? 0) || 0), 0),
    [items]
  );

  const atLeastOneReturn = useMemo(
    () => items.some((it) => Number(it.returnQty ?? 0) > 0),
    [items]
  );

  const onSubmit = async (values: any) => {
    // prevent double submit
    if (loading) return;

    console.log("submit values:", values);
    if (!values.supplier) {
      toast.error("Select supplier");
      return;
    }
    if (!values.invoice) {
      toast.error("Select invoice");
      return;
    }
    if (!atLeastOneReturn) {
      toast.error("Add at least one return quantity");
      return;
    }

    for (const it of items) {
      if (Number(it.returnQty ?? 0) > Number(it.purchaseQty ?? 0)) {
        toast.error(
          `Return qty cannot be greater than purchased qty for ${it.productName}`
        );
        return;
      }
      if (Number(it.returnQty ?? 0) < 0) {
        toast.error(`Invalid return qty for ${it.productName}`);
        return;
      }
    }

    const payloadItems = items
      .filter((it) => Number(it.returnQty ?? 0) > 0)
      .map((it) => {
        const qty = Number(it.returnQty ?? 0);
        const price = Number(it.purchasePrice ?? 0);
        const discount = Number(it.discount ?? 0);
        const unitAfterDiscount = price - discount;
        const lineTotal = Number((qty * unitAfterDiscount).toFixed(3));

        return {
          productId: it.product,
          productName: it.productName ?? "",
          qty,
          price,
          discount,
          lineTotal,
        };
      });

    if (payloadItems.length === 0) {
      toast.error("Add at least one return item");
      return;
    }

    const computedTotal = payloadItems.reduce(
      (s, i) => s + (Number(i.lineTotal) || 0),
      0
    );

    const createdBy = user.userName;

    const payload = {
      purchaseId: selectedPurchase?._id,
      invoiceNumber:
        selectedPurchase?.invoiceNumber ??
        selectedPurchase?.invoiceNo ??
        values.invoice?.value ??
        values.invoice,
      supplierId: values.supplier?.value ?? null,
      supplierName: values.supplier?.label ?? values.supplier ?? null,
      items: payloadItems,
      totalReturnAmount: Number(computedTotal || grandTotal || 0),
      reason: values.reason ?? "",
      returnDate: values.returnDate
        ? new Date(values.returnDate).toISOString()
        : new Date().toISOString(),
      createdBy,
    };

    console.log("payload", payload);

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/purchases/return`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // success
      if (res.status >= 200 && res.status < 300) {
        toast.success("Return submitted successfully");

        // reset UI
        reset({
          supplier: null,
          invoice: null,
          returnDate: new Date().toISOString().slice(0, 10),
          reason: "",
        });
        setSelectedPurchase(null);
        setItems([]);
      } else {
        toast.error(res.data?.message || "Failed to submit return");
      }
    } catch (err: any) {
      console.error("Submit return error:", err);

      // handle axios / server validation errors neatly
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        err.message ||
        "Network/server error";

      if (err?.response?.data?.errors) {
        const errs = err.response.data.errors;
        // err.response.data.errors can be object keyed by path or array
        if (Array.isArray(errs)) {
          toast.error(errs.map((e: any) => e.msg || e.message).join("; "));
        } else if (typeof errs === "object") {
          // object: map values to string messages
          const msgs = Object.values(errs)
            .flat()
            .map((v: any) => (v && (v.msg || v.message)) || String(v));
          toast.error(msgs.join("; "));
        } else {
          toast.error(String(serverMsg));
        }
      } else {
        toast.error(String(serverMsg));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (v: number | undefined) => Number(v ?? 0).toFixed(3);

  return (
    <div className="bg-white border rounded-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supplier Name
            </label>
            <Controller
              control={control}
              name="supplier"
              render={({ field }) => (
                <Select
                  {...field}
                  options={suppliers}
                  placeholder="Select supplier..."
                  isClearable
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice
            </label>
            <Controller
              control={control}
              name="invoice"
              render={({ field }) => (
                <Select
                  {...field}
                  options={invoices}
                  placeholder="Select invoice..."
                  isClearable
                  onChange={(val) => {
                    field.onChange(val);
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-600">
                <th className="px-4 py-3 w-1/4">Ingredient Name</th>
                <th className="px-4 py-3 w-1/6">Purchase Qty</th>
                <th className="px-4 py-3 w-1/6">Return Qty *</th>
                <th className="px-4 py-3 w-1/6">Price</th>
                <th className="px-4 py-3 w-1/6">Discount</th>
                <th className="px-4 py-3 w-1/6 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">
                    Select an invoice to load items
                  </td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={it._id ?? idx} className="border-t">
                    <td className="px-4 py-3">{it.productName}</td>
                    <td className="px-4 py-3">{it.purchaseQty}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        min={0}
                        max={it.purchaseQty}
                        value={it.returnQty}
                        onChange={(e) =>
                          onReturnQtyChange(idx, Number(e.target.value))
                        }
                        className="input-sm w-28"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {formatNumber(it.purchasePrice)}
                    </td>
                    <td className="px-4 py-3">{formatNumber(it.discount)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatNumber(it.lineTotal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason
            </label>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Reason"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                />
              )}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="text-sm text-slate-600 mb-2">Total:</div>
            <div className="text-2xl font-bold text-slate-800 mb-4">
              ৳ {grandTotal.toFixed(3)}
            </div>
            <div className="text-xs text-slate-500 mb-4">
              Return Date: <span className="font-medium">{returnDate}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
            >
              {loading ? "Processing..." : "Return"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
