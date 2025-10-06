import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { Purchase, PurchaseItem } from "./types";

type Props = {
  purchase: Purchase;
  onClose: () => void;
};

export default function PurchaseReturnModal({ purchase, onClose }: Props) {
  // local state for return qtys per item
  const initialReturnQtys = purchase.items.map((it) => ({
    id: it._id ?? it.productId ?? Math.random().toString(),
    qty: 0,
  }));
  const [returnQtys, setReturnQtys] = useState(initialReturnQtys);

  const { register, handleSubmit } = useForm<{ reason: string }>();

  const onQtyChange = (id: string, val: number) => {
    setReturnQtys((s) =>
      s.map((r) => (r.id === id ? { ...r, qty: Math.max(0, val) } : r))
    );
  };

  const rows = purchase.items;

  const lineTotals = useMemo(() => {
    return rows.map((row) => {
      const r = returnQtys.find((x) => x.id === (row._id ?? row.productId));
      const qty = r?.qty ?? 0;
      const price = row.price ?? 0;
      const discount = row.discount ?? 0;
      // apply discount per unit if provided
      const unitAfterDiscount = price - (discount || 0);
      return Math.max(0, qty * unitAfterDiscount);
    });
  }, [rows, returnQtys]);

  const grandReturnTotal = useMemo(
    () => lineTotals.reduce((a, b) => a + b, 0),
    [lineTotals]
  );

  const submitReturn = async (data: { reason: string }) => {
    // build payload
    const itemsToReturn = rows
      .map((row) => {
        const r = returnQtys.find((x) => x.id === (row._id ?? row.productId));
        const qty = r?.qty ?? 0;
        return qty > 0
          ? {
              productId: row.productId ?? row._id,
              name: row.name,
              qty,
              price: row.price,
              discount: row.discount,
            }
          : null;
      })
      .filter(Boolean);

    if (itemsToReturn.length === 0) {
      alert("Please add at least one return qty");
      return;
    }

    const payload = {
      purchaseId: purchase._id,
      invoiceNumber: purchase.invoiceNumber,
      supplierId: purchase.supplierId,
      items: itemsToReturn,
      totalReturnAmount: grandReturnTotal,
      reason: data.reason,
      returnDate: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/purchase-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        alert("Return submitted");
        onClose();
      } else {
        alert(json.message || "Error");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-6 z-50">
      <div className="bg-white w-full max-w-5xl rounded shadow-lg overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              Purchase Return - Invoice #{purchase.invoiceNumber}
            </h3>
            <div className="text-sm text-gray-600">{purchase.supplierName}</div>
          </div>
          <div>
            <button onClick={onClose} className="px-3 py-1 border rounded">
              Close
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(submitReturn)}>
          <div className="p-4">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Ingredient Name</th>
                  <th className="p-2 text-center">Purchase Qty</th>
                  <th className="p-2 text-center">Return Qty *</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Discount</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const rId = row._id ?? row.productId ?? `${idx}`;
                  const rQty = returnQtys.find((x) => x.id === rId)?.qty ?? 0;
                  const unitAfterDiscount =
                    (row.price ?? 0) - (row.discount ?? 0);
                  const lineTotal = rQty * unitAfterDiscount;
                  return (
                    <tr key={rId} className="border-t">
                      <td className="p-2">{row.name}</td>
                      <td className="p-2 text-center">{row.quantity}</td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={row.quantity}
                          value={rQty}
                          onChange={(e) =>
                            onQtyChange(rId, Number(e.target.value))
                          }
                          className="w-28 p-1 border rounded text-center"
                        />
                      </td>
                      <td className="p-2 text-right">
                        {(row.price ?? 0).toFixed(3)}
                      </td>
                      <td className="p-2 text-right">
                        {(row.discount ?? 0).toFixed(2)}
                      </td>
                      <td className="p-2 text-right font-semibold">
                        {lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium">Reason</label>
                <textarea
                  {...register("reason")}
                  className="w-full border rounded h-24 p-2 mt-1"
                  placeholder="Reason"
                />
              </div>
              <div className="col-span-1 border rounded p-3">
                <div className="text-sm text-gray-600">Total:</div>
                <div className="text-2xl font-bold">
                  {grandReturnTotal.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Return
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
