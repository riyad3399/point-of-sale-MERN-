import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import axios from "axios";
import { HiCurrencyBangladeshi } from "react-icons/hi";
import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  fetchDefaultDueCustomers,
  fetchOverviewData,
  fetchRecentTransactions,
  fetchTodaySales,
  fetchTotalSales,
} from "../utils/api";
import Loading from "../components/Loading";

type SalesSummaryType = {
  totalSales: number;
  totalDue: number;
  wholeSale: number;
  retailSale: number;
};

type DueCustomerType = {
  name: string;
  phone: string;
  totalDue: number;
  totalPaid: number;
  invoiceCount: number;
  invoiceIds: number[];
};

type RecentTransactionType = {
  _id: string;
  transactionId: number;
  createdAt: string; // ISO date string
  paymentMethod: string;
  totals: {
    total: number;
    due: number;
  };
};

const DashboardPage: React.FC = () => {
  const [todaySales, setTodaySales] = useState<SalesSummaryType>({
    totalSales: 0,
    totalDue: 0,
    wholeSale: 0,
    retailSale: 0,
  });
  const [totalSales, setTotalSales] = useState<SalesSummaryType>({
    totalSales: 0,
    totalDue: 0,
    wholeSale: 0,
    retailSale: 0,
  });

  const [dueCustomers, setDueCustomers] = useState<DueCustomerType[]>([]);

  const [chartData, setChartData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransactionType[]
  >([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const { t } = useTranslation();

  useEffect(() => {
    fetchTodaySales(setTodaySales, setLoading);
    fetchTotalSales(setTotalSales, setLoading);
    fetchOverviewData(setChartData, setLoading);
    fetchRecentTransactions(setRecentTransactions, setLoading);
    fetchDefaultDueCustomers(setLoading, setDueCustomers);
  }, []);

  const sendSMS = async (
    phone: string,
    name: string,
    due: number,
    index: number
  ) => {
    // const formatter = new Intl.NumberFormat("bn-BD");
    const message = `প্রিয় ${name}, আপনার মোট বাকি আছে ৳${due}। অনুগ্রহ করে পরিশোধ করুন।`;

    try {
      setLoadingIndex(index);
      await fetch("http://localhost:3000/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phone,
          message: message,
        }),
      });
      toast.success("SMS পাঠানো হয়েছে!");
    } catch (err) {
      toast.error("SMS পাঠাতে ব্যার্থ!");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleFetch = async () => {
    setLoading(true);

    try {
      let response;

      if (selectedDate) {
        const formattedDate = formatDateToYYYYMMDD(selectedDate);
        response = await axios.get(
          "http://localhost:3000/invoice/due-customers",
          {
            params: { dueDate: formattedDate },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.get(
          "http://localhost:3000/invoice/due-customers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setDueCustomers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("ডাটা আনতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Helmet>
        <title>Dashboard | POS System</title>
      </Helmet>

      {/* Stats Grid */}
      <div className="mb-5">
        <h2 className="mb-2.5 lg:text-xl text-lg font-semibold text-gray-500">
          {t("Dashboard.todaySales")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t("Dashboard.todaySales")}
            value={todaySales?.totalSales}
            trend="up"
            percentage="24%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="primary"
          />
          <StatsCard
            title={t("Dashboard.todayWholeSale")}
            value={todaySales?.wholeSale}
            trend="up"
            percentage="12%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="success"
          />
          <StatsCard
            title={t("Dashboard.todayRetailSale")}
            value={todaySales?.retailSale}
            trend="up"
            percentage="18%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="warning"
          />
          <StatsCard
            title={t("Dashboard.todayDue")}
            value={todaySales?.totalDue}
            trend="down"
            percentage="5%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="danger"
          />
        </div>
      </div>
      <div className="">
        <h2 className="mb-2.5 lg:text-xl text-lg font-semibold text-gray-500">
          {t("Dashboard.totalSales")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t("Dashboard.totalSales")}
            value={totalSales?.totalSales}
            trend="up"
            percentage="24%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="primary"
          />
          <StatsCard
            title={t("Dashboard.totalWholeSale")}
            value={totalSales?.wholeSale}
            trend="up"
            percentage="12%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="success"
          />
          <StatsCard
            title={t("Dashboard.totalRetailSale")}
            value={totalSales?.retailSale}
            trend="up"
            percentage="18%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="warning"
          />
          <StatsCard
            title={t("Dashboard.totalDue")}
            value={totalSales?.totalDue}
            trend="down"
            percentage="5%"
            icon={<HiCurrencyBangladeshi className="h-5 w-5" />}
            color="danger"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className=" p-6">
          <h2 className="text-lg font-bold mb-4">
            {t("Dashboard.salesOverview")}
          </h2>
          <div className=" flex items-center justify-center">
            <SalesOverviewChart data={chartData} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex md:justify-between items-center mb-4">
            <h2 className="text-lg font-bold ">
              {t("Dashboard.dueCustomers")}
            </h2>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                onCalendarClose={handleFetch}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={50}
                placeholderText={t("Dashboard.selectDate")}
                className="w-full input border rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dueCustomers?.map((dueCustomer, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg "
              >
                <div className="flex-1">
                  <h3 className="font-medium">
                    {capitalizeFirstLetter(dueCustomer.name)}
                  </h3>
                  <p className="text-sm text-gray-500">{dueCustomer.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium flex items-center gap-0.5">
                    <FaBangladeshiTakaSign size={13} />
                    {dueCustomer.totalDue}
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    className="btn-primary text-white text-sm px-3 py-1 rounded"
                    onClick={() =>
                      sendSMS(
                        dueCustomer.phone,
                        dueCustomer.name,
                        dueCustomer.totalDue,
                        index
                      )
                    }
                    disabled={loadingIndex === index}
                  >
                    {loadingIndex === index
                      ? t("Dashboard.sending")
                      : t("Dashboard.sendSms")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">
          {t("Dashboard.recentTransactions")}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  {t("Dashboard.invoiceId")}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  {t("Dashboard.date")}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  {t("Dashboard.payment")}
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">
                  {t("Dashboard.total")}
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">
                  {t("Dashboard.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions?.map((transction) => (
                <tr
                  key={transction._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-800">
                    #{transction.transactionId}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(transction.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td className="py-3 px-4 ">
                    {capitalizeFirstLetter(transction.paymentMethod)}
                  </td>
                  <td className="py-3 px-4 font-medium flex justify-end items-center gap-0.5">
                    <span>
                      <FaBangladeshiTakaSign size={13} />
                    </span>
                    <span>{transction.totals.total}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {transction.totals.due ? (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-warning-100 text-warning-600">
                        {t("Dashboard.partial")}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success-100 text-success-600">
                        {t("Dashboard.completed")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  trend: "up" | "down";
  percentage: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  percentage,
  icon,
  color,
}) => {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    danger: "bg-danger-50 text-danger-600",
  };

  return (
    <motion.div
      className="card p-5"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="flex items-center mt-3">
        {trend === "up" ? (
          <ArrowUpRight className="h-4 w-4 text-success-600 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-danger-600 mr-1" />
        )}
        <span
          className={`text-sm font-medium ${
            trend === "up" ? "text-success-600" : "text-danger-600"
          }`}
        >
          {percentage}
        </span>
        <span className="text-gray-500 text-sm ml-1">vs last week</span>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
