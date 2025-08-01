import { Navigate } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";

interface ProtectedRouteProps {
  module: string;
  subModule: string;
  actions: ("view" | "add" | "edit" | "delete"| "trigger")[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  module,
  subModule,
  actions,
  children,
}: ProtectedRouteProps) {
  const { hasPermission } = usePermission();

  const isAuthorized = hasPermission(module, subModule, actions);

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
