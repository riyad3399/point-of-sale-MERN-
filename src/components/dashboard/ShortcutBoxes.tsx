// ShortcutBoxes.tsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaTags, FaCashRegister, FaTruck } from "react-icons/fa";
import { AlertCircle, FileSignature, FileText, Users } from "lucide-react";

export type ShortcutBoxDef = {
  id: string;
  label: string;
  description?: string;
  combo?: string; // optional badge text like "Alt+P"
  handler?: () => void;
  icon?: React.ReactNode; // optional icon or emoji
  accent?: string; // tailwind color class like "bg-indigo-50" (optional)
  route?: string; // optional route string (navigates using react-router)
};

type Props = {
  shortcuts?: ShortcutBoxDef[]; // optional: use defaults when not provided
  cols?: number; // e.g. 4 => lg:grid-cols-4 on large screens
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target instanceof HTMLElement) return target.isContentEditable;
  return false;
}

export default function ShortcutBoxes({
  shortcuts: propShortcuts,
  cols = 4,
}: Props) {
  const navigate = useNavigate();

  // sensible defaults if parent doesn't pass any shortcuts
  const defaultShortcuts: ShortcutBoxDef[] = [
    {
      id: "product",
      label: "Product",
      description: "Open product",
      combo: "Alt+P",
      icon: <FaBoxOpen className="text-primary-600" />,
      route: "/productes",
    },
    {
      id: "categories",
      label: "Categories",
      description: "Manage categories",
      combo: "Alt+C",
      icon: <FaTags className="text-success-600" />,
      route: "/categories",
    },
    {
      id: "retail-pos",
      label: "Retail Sale (POS)",
      description: "Open retail POS",
      combo: "Alt+R",
      icon: <FaCashRegister className="text-warning-600" />,
      route: "/retailSale",
    },
    {
      id: "wholesale",
      label: "Wholesale Sale",
      description: "Open wholesale POS",
      combo: "Alt+W",
      icon: <FaTruck className="text-danger-600" />,
      route: "/wholeSale",
    },
    {
      id: "transactions",
      label: "Transactions",
      description: "Open transactions",
      combo: "Alt+T",
      icon: <FileText className="text-primary-600" />,
      route: "/transactions",
    },
    {
      id: "quotations",
      label: "Quotations",
      description: "Open quotations",
      combo: "Alt+Q",
      icon: <FileSignature className="text-success-600" />,
      route: "/quotation",
    },
    {
      id: "alertItems",
      label: "AlertItems",
      description: "Open alertItems",
      combo: "Alt+A",
      icon: <AlertCircle className="text-warning-600" />,
      route: "/alertItems",
    },
    {
      id: "customers",
      label: "Customers",
      description: "Open customers",
      combo: "Alt+M",
      icon: <Users className="text-danger-600" />,
      route: "/customers",
    },
  ];

  const shortcuts =
    propShortcuts && propShortcuts.length > 0
      ? propShortcuts
      : defaultShortcuts;

  // activation helper: call handler() if exists otherwise navigate(route) if route exists
  const activate = (s: ShortcutBoxDef) => {
    if (s.handler) {
      try {
        s.handler();
      } catch (err) {
        /* swallow */
      }
    } else if (s.route) {
      navigate(s.route);
    }
  };

  // keyboard handler attached to each item (Enter / Space)
  const onItemKeyDown = (e: React.KeyboardEvent, s: ShortcutBoxDef) => {
    if (isEditableTarget(e.target)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(s);
    }
  };

  const gridColsClass = `lg:grid-cols-${cols}`;

  return (
    <div className="w-full">
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 ${gridColsClass} gap-4`}
        role="list"
        aria-label="Shortcut boxes"
      >
        {shortcuts.map((s, idx) => (
          <motion.div
            key={s.id}
            role="button"
            tabIndex={0}
            onClick={() => activate(s)}
            onKeyDown={(e) => onItemKeyDown(e, s)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group flex items-start gap-3 p-4 rounded-lg border transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 cursor-pointer ${
              s.accent ?? "bg-white"
            }`}
            aria-label={s.label}
            title={s.label}
            data-shortcut-first={idx === 0 ? true : undefined}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
              aria-hidden
            >
              {s.icon ?? <span className="text-2xl">📦</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {s.label}
                  </div>
                  {s.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {s.description}
                    </div>
                  )}
                </div>

                {s.combo && (
                  <div className="ml-2 flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-gray-100 border text-xs font-medium text-gray-700">
                      {s.combo}
                    </kbd>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Click or press Enter
              </div>
            </div>

            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400">
              Open →
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
