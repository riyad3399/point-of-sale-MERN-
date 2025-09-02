// src/hooks/usePOSShortcuts.ts
import { useEffect } from "react";
import shortcutConfig, { SidebarShortcutAction } from "../utils/shortcutConfig";

type ActionsMap = Partial<Record<SidebarShortcutAction, () => void>>;

export default function usePOSShortcuts(actions: ActionsMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      let combo = "";
      if (e.ctrlKey) combo += "Ctrl+";
      if (e.shiftKey) combo += "Shift+";
      if (e.altKey) combo += "Alt+";

      // Normalize key (e.key gives "a", "A", "ArrowUp" etc.)
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      combo += key;

      const actionName = shortcutConfig[combo];
      if (actionName && actions[actionName]) {
        e.preventDefault();
        actions[actionName]!();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actions]);
}
