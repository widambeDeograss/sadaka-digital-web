import { Card, Table, Typography, DatePicker, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../store/store-hooks.ts";
import { fetchRevenueStatement } from "../../helpers/ApiConnectors.ts";
import Tabletop from "../../components/tables/TableTop.tsx";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import RevenueByPaymentType from "./rev-payment-types.tsx";

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Swahili month names mapping
const swahiliMonths: { [key: string]: string } = {
  January: "Januari",
  February: "Februari",
  March: "Machi",
  April: "Aprili",
  May: "Mei",
  June: "Juni",
  July: "Julai",
  August: "Agosti",
  September: "Septemba",
  October: "Oktoba",
  November: "Novemba",
  December: "Desemba",
};

const RevenueStatementReport = () => {
  const church = useAppSelector((state: any) => state.sp);
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs("2025-01-01"),
    dayjs("2025-12-31"),
  ]);
  const [selectedRevenueType, setSelectedRevenueType] = useState<string | null>(null);

  // Fetch revenue data
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-statement", dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")],
    queryFn: async () => {
      const res: any = await fetchRevenueStatement({
        church_id: church.id,
        start_date: dates[0].format("YYYY-MM-DD"),
        end_date: dates[1].format("YYYY-MM-DD"),
      });
      return res;
    },
  });

  // Helper function to ensure precise addition
  const preciseAdd = (a: number, b: number): number => {
    return parseFloat((a + b).toFixed(2));
  };

  // Normalize revenue_type values
  const normalizeRevenueType = (type: string): string => {
    const normalized = type.toLowerCase();
    if (normalized === "michango") return "mchango";
    if (normalized === "sadata") return "sadaka";
    if (normalized.includes("ahadi")) return "ahadi"; // Exclude Ahadi
    return normalized;
  };

  // Process data for monthly breakdown
  const processMonthlyData = () => {
    if (!revenueData?.details) return [];

    const monthlyData: { [key: string]: any } = {};
    let grandMchango = 0;
    let grandSadaka = 0;
    let grandZaka = 0;
    let grandMavuno = 0;
    let grandTotal = 0;

    revenueData.details.forEach((item: any) => {
      const normalizedType = normalizeRevenueType(item.revenue_type);

      // Exclude Ahadi payments
      if (normalizedType === "ahadi") return;

      const monthKey = item.month_name.trim();
      const amount = parseFloat(item.total_amount);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: swahiliMonths[monthKey] || monthKey,
          mchango: 0,
          sadaka: 0,
          zaka: 0,
          mavuno: 0,
          total: 0,
        };
      }

      // Handle Mavuno explicitly
      if (normalizedType === "mavuno") {
        monthlyData[monthKey].mavuno = preciseAdd(monthlyData[monthKey].mavuno, amount);
        grandMavuno = preciseAdd(grandMavuno, amount);
      } else {
        monthlyData[monthKey][normalizedType] = preciseAdd(
          monthlyData[monthKey][normalizedType],
          amount
        );
      }

      // Update totals
      monthlyData[monthKey].total = preciseAdd(monthlyData[monthKey].total, amount);
      grandTotal = preciseAdd(grandTotal, amount);
    });

    // Calculate grand totals for other types
    Object.values(monthlyData).forEach((month: any) => {
      grandMchango = preciseAdd(grandMchango, month.mchango);
      grandSadaka = preciseAdd(grandSadaka, month.sadaka);
      grandZaka = preciseAdd(grandZaka, month.zaka);
    });

    // Sort data by month
    const sortedData = Object.values(monthlyData).sort((a, b) =>
      new Date(`2025 ${a.month}`).getTime() - new Date(`2025 ${b.month}`).getTime()
    );

    // Add grand totals row
    const finalData = [
      ...sortedData,
      {
        month: "Jumla",
        mchango: grandMchango,
        sadaka: grandSadaka,
        zaka: grandZaka,
        mavuno: grandMavuno,
        total: grandTotal,
        isTotal: true,
      },
    ];

    return finalData;
  };

  const monthlyBreakdown = processMonthlyData();

  // Generate columns for the table
  const columns = [
    {
      title: "Mwezi",
      dataIndex: "month",
      key: "month",
      render: (text: string, record: any) => (
        <Text strong={record.isTotal}>{text}</Text>
      ),
    },
    {
      title: "Mchango (Tsh)",
      dataIndex: "mchango",
      key: "mchango",
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      ),
    },
    {
      title: "Sadaka (Tsh)",
      dataIndex: "sadaka",
      key: "sadaka",
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      ),
    },
    {
      title: "Zaka (Tsh)",
      dataIndex: "zaka",
      key: "zaka",
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      ),
    },
    {
      title: "Mavuno (Tsh)",
      dataIndex: "mavuno",
      key: "mavuno",
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      ),
    },
    {
      title: "Jumla (Tsh)",
      dataIndex: "total",
      key: "total",
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      ),
    },
  ];

  // Filter the details based on the selected revenue type (excluding Ahadi)
  const filteredDetails = selectedRevenueType
    ? revenueData?.details.filter(
        (item: any) =>
          normalizeRevenueType(item.revenue_type) === selectedRevenueType &&
          !normalizeRevenueType(item.revenue_type).includes("ahadi")
      )
    : revenueData?.details?.filter(
        (item: any) => !normalizeRevenueType(item.revenue_type).includes("ahadi")
      );

  return (
    <div>
      <Card>
        <RevenueByPaymentType />
      </Card>
      <Card title="RIPOTI YA MAPATO" className="mt-14">
        <div className="mb-6">
          <RangePicker
            value={dates}
            // @ts-ignore
            onChange={(values) => values && setDates(values)}
            format="YYYY-MM-DD"
            className="mb-4"
          />

          <div className="flex gap-4">
            {/* <div className="flex-1">
              <Text strong>Jumla ya mapato:</Text>
              <Text className="block text-lg">
                Tsh {revenueData?.summary?.total_revenue?.toLocaleString()}
              </Text>
            </div> */}
            <div className="flex-1">
              <Text strong>Jumla ya miamala:</Text>
              <Text className="block text-lg">
                {revenueData?.summary?.total_records}
              </Text>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Select
            placeholder="Chagua aina ya mapato"
            style={{ width: 200 }}
            onChange={(value) => setSelectedRevenueType(value)}
            allowClear
          >
            <Option value="mchango">Mchango</Option>
            <Option value="sadaka">Sadaka</Option>
            <Option value="zaka">Zaka</Option>
            <Option value="mavuno">Mavuno</Option>
          </Select>
        </div>

        <div className="table-responsive">
          <Tabletop
            inputfilter={false}
            showFilter={false}
            data="revenue-table"
            togglefilter={() => {}}
            searchTerm=""
            onSearch={() => {}}
          />
          <Table
            id="revenue-table"
            columns={columns}
            dataSource={monthlyBreakdown}
            loading={isLoading}
            scroll={{ x: true }}
            pagination={false}
            rowClassName={(record) => (record.isTotal ? "total-row" : "")}
          />
        </div>

        {selectedRevenueType && (
          <Card title={`Maelezo ya ${selectedRevenueType}`} className="mt-14">
            <Table
              columns={[
                { title: "Aina ya Mapato", dataIndex: "revenue_type_record", key: "revenue_type_record" },
                { title: "Aina ya Malipo", dataIndex: "payment_type_name", key: "payment_type_name" },
                { title: "Kiasi (Tsh)", dataIndex: "total_amount", key: "total_amount" },
                { title: "Mwezi", dataIndex: "month_name", key: "month_name" },
                { title: "Mwaka", dataIndex: "year", key: "year" },
              ]}
              dataSource={filteredDetails}
              loading={isLoading}
              scroll={{ x: true }}
            />
          </Card>
        )}
      </Card>
    </div>
  );
};

export default RevenueStatementReport;