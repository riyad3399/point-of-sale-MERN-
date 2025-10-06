import { useState } from "react";
import PurchaseReturnModal from "./PurchaseReturnModal";

interface PurchaseItem {
  _id?: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
}
interface Purchase {
  _id: string;
  invoiceNumber?: string | number;
  supplierId?: string;
  supplierName?: string;
  purchaseDate?: string;
  total?: number;
  grandTotal?: number;
  items: PurchaseItem[];
}

export default function PurchaseShowList({ purchases }: { purchases: Purchase[] }) {
  const [selected, setSelected] = useState<Purchase | null>(null);

  if (!purchases || purchases.length === 0) {
    return <div className="mt-4 text-gray-600">No purchases found</div>;
  }

  return (
    <div>
      <div className="grid gap-2">
        {purchases.map((p) => (
          <div
            key={p._id}
            className="border rounded p-3 flex justify-between items-center hover:shadow cursor-pointer"
            onClick={() => setSelected(p)}
          >
            <div>
              <div className="text-sm text-gray-600">Invoice</div>
              <div className="font-semibold">{p.invoiceNumber}</div>
              <div className="text-xs text-gray-500">
                {p.purchaseDate
                  ? new Date(p.purchaseDate).toLocaleString()
                  : ""}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="font-semibold">
                {p.grandTotal ?? p.total ?? 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <PurchaseReturnModal
          purchase={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
