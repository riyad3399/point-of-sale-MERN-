import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

export default function ThreeDotButton({ purchase }) {
  return (
    <div>
      <div
        className="absolute -top-3 -left-3 border rounded-full ring-1"
        title="Action"
      >
        <button
          onClick={(e) => {}}
          className="p-1.5 rounded-full hover:bg-slate-100"
        >
          <MoreVertical className="w-5 h-5 text-slate-500" />
        </button>

        <div className="absolute z-20 mt-2 bg-white shadow-lg rounded-md py-1 w-40 border">
          {purchase.due > 0 && (
            <button
              onClick={(e) => {}}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
            >
              <Link to="/purchasePayment"> Make Payment</Link>
            </button>
          )}
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
            disabled
          >
            Delete (Coming)
          </button>
        </div>
      </div>
    </div>
  );
}
