import { Helmet } from "react-helmet-async";
import ReportStatementPage from "./ReportStatementPage";
import ProfitStatement from "../components/report/ProfitStatement";

export default function ReportPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Helmet>
        <title>Report | POS System</title>
      </Helmet>
      <ReportStatementPage />
      <ProfitStatement/>
    </div>
  );
}
