import { Helmet } from "react-helmet-async";
import ReportStatementPage from "./ReportStatementPage";
import ProfitStatement from "../components/report/ProfitStatement";
import { usePermission } from "../hooks/usePermission";

export default function ReportPage() {

  const { hasPermission} = usePermission();

  return (
    <div>
      <Helmet>
        <title>Report | POS System</title>
      </Helmet>
      {hasPermission("report", "report", ["trigger"]) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReportStatementPage />
          <ProfitStatement />
        </div>
      )}
    </div>
  );
}
