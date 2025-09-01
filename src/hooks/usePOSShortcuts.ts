import { useEffect } from "react";
import shortcutConfig, { ShortcutAction } from "../utils/shortcutConfig";

type ActionsMap = Partial<Record<ShortcutAction, () => void>>;

export default function usePOSShortcuts(actions: ActionsMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let combo = "";
      if (e.shiftKey) combo += "Shift+";
      if (e.altKey) combo += "Alt+";
      combo += e.key.toUpperCase();

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
