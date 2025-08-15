import { useAuth } from "../context/AuthContext";

type Action = "view" | "add" | "edit" | "delete" | "trigger";

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = (
    module: string,
    subModule: string,
    actions: Action[]
  ): boolean => {
    const modulePermission = user?.permissions?.[module];
    if (!modulePermission || modulePermission.trigger === false) return false;

    const subModulePermission = modulePermission?.[subModule];
    if (!subModulePermission || subModulePermission.trigger === false)
      return false;

    return actions.some((action) => subModulePermission[action] === true);
  };

  const hasModuleAccess = (module: string): boolean => {
    return Boolean(user?.permissions?.[module]?.trigger);
  };

  return { hasPermission, hasModuleAccess };
}
