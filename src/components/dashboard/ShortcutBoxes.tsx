import React, { useCallback, useEffect, useRef } from "react";
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
  icon?: React.ReactNode;
  accent?: string; // tailwind color class like "bg-indigo-50"
  route?: string;
};

type Props = {
  shortcuts?: ShortcutBoxDef[];
  cols?: number; // preferred columns at large screens (clamped internally)
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

  // keep a ref to shortcuts so global key handler sees latest
  const shortcutsRef = useRef<ShortcutBoxDef[]>(shortcuts);
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const activate = useCallback(
    (s: ShortcutBoxDef) => {
      if (s.handler) {
        try {
          s.handler();
        } catch (err) {
          // swallow but you might want to log in real app
        }
      } else if (s.route) {
        navigate(s.route);
      }
    },
    [navigate]
  );

  const onItemKeyDown = (e: React.KeyboardEvent, s: ShortcutBoxDef) => {
    if (isEditableTarget(e.target)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(s);
    }
  };

  // --- responsive grid class generation (clamped to sensible range) ---
  const lgCols = Math.min(Math.max(1, Math.floor(cols)), 6);
  const mdCols = Math.min(Math.max(1, Math.floor(Math.max(2, lgCols - 1))), 6);
  const xlCols = Math.min(lgCols + 1, 6);
  const gridColsClass = `grid-cols-1 sm:grid-cols-2 md:grid-cols-${mdCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols}`;

  // --- global keyboard shortcuts support (parses combos like "Alt+P" or "Ctrl+Shift+S") ---
  function parseCombo(combo?: string) {
    if (!combo) return null;
    const parts = combo.split("+").map((p) => p.trim().toLowerCase());
    const key = parts.find(
      (p) =>
        !["alt", "ctrl", "control", "shift", "meta", "cmd", "command"].includes(
          p
        )
    );
    return {
      ctrl: parts.includes("ctrl") || parts.includes("control"),
      alt: parts.includes("alt"),
      shift: parts.includes("shift"),
      meta:
        parts.includes("meta") ||
        parts.includes("cmd") ||
        parts.includes("command"),
      key: key || null,
    };
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ignore when typing in inputs
      if (isEditableTarget(e.target)) return;

      for (const s of shortcutsRef.current) {
        if (!s.combo) continue;
        const parsed = parseCombo(s.combo);
        if (!parsed || !parsed.key) continue;

        // match modifier keys
        if (parsed.ctrl !== !!e.ctrlKey) continue;
        if (parsed.alt !== !!e.altKey) continue;
        if (parsed.shift !== !!e.shiftKey) continue;
        if (parsed.meta !== !!e.metaKey) continue;

        // match main key (compare as lowercase single char or string)
        const pressed = (e.key || "").toLowerCase();
        if (pressed === parsed.key.toLowerCase()) {
          e.preventDefault();
          try {
            activate(s);
          } catch (err) {
            // ignore
          }
          break; // only trigger the first matching shortcut
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activate]);

  return (
    <div className="w-full">
      <div
        className={`grid gap-4 ${gridColsClass}`}
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
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`relative group flex items-start gap-3 p-4 sm:p-4 md:p-5 rounded-lg border transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 cursor-pointer min-h-[72px] ${
              s.accent ?? "bg-white"
            }`}
            aria-label={s.label}
            title={s.label}
            data-shortcut-first={idx === 0 ? true : undefined}
          >
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-2xl shrink-0 bg-white/0"
              aria-hidden
            >
              {s.icon ?? <span className="text-2xl">📦</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-sm md:text-base font-semibold text-gray-800 truncate">
                    {s.label}
                  </div>
                  {s.description && (
                    <div className="text-xs md:text-sm text-gray-500 truncate">
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

              <div className="text-xs md:text-sm text-gray-400 mt-2">
                Click or press Enter
              </div>
            </div>

            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hidden sm:block">
              Open →
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
