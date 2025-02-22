import { Card, Table, Typography, DatePicker } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../store/store-hooks.ts";
import { fetchRevenueStatement } from "../../helpers/ApiConnectors.ts";
import Tabletop from "../../components/tables/TableTop.tsx";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

const { Text } = Typography;
const { RangePicker } = DatePicker;

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
  December: "Desemba"
};

const RevenueStatementReport = () => {
  const church = useAppSelector((state: any) => state.sp);
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs('2025-01-01'),
    dayjs('2025-12-31')
  ]);

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-statement", dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')],
    queryFn: () => fetchRevenueStatement({
      church_id: church.id,
      start_date: dates[0].format('YYYY-MM-DD'),
      end_date: dates[1].format('YYYY-MM-DD')
    }),
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
    return normalized;
  };

  // Process data for monthly breakdown
  const processMonthlyData = () => {
    if (!revenueData?.details) return [];

    // Group data by month
    const monthlyData: { [key: string]: any } = {};

    revenueData.details.forEach((item: any) => {
      const monthKey = item.month_name.trim();
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: swahiliMonths[monthKey] || monthKey,
          mchango: 0,
          sadaka: 0,
          zaka: 0,
          total: 0
        };
      }

      const amount = parseFloat(item.total_amount);
      const normalizedType = normalizeRevenueType(item.revenue_type);
      monthlyData[monthKey][normalizedType] = preciseAdd(
        monthlyData[monthKey][normalizedType],
        amount
      );
    });

    // Calculate monthly totals and grand totals
    let grandMchango = 0;
    let grandSadaka = 0;
    let grandZaka = 0;
    let grandTotal = 0;

    const sortedData = Object.values(monthlyData).map((month: any) => {
      // Calculate monthly total
      month.total = preciseAdd(
        preciseAdd(month.mchango, month.sadaka),
        month.zaka
      );

      // Add to grand totals
      grandMchango = preciseAdd(grandMchango, month.mchango);
      grandSadaka = preciseAdd(grandSadaka, month.sadaka);
      grandZaka = preciseAdd(grandZaka, month.zaka);
      grandTotal = preciseAdd(grandTotal, month.total);

      return month;
    }).sort((a, b) => 
      new Date(`2025 ${a.month}`).getTime() - new Date(`2025 ${b.month}`).getTime()
    );

    // Add grand totals row
    const finalData = [
      ...sortedData,
      {
        month: 'Jumla',
        mchango: grandMchango,
        sadaka: grandSadaka,
        zaka: grandZaka,
        total: grandTotal,
        isTotal: true
      }
    ];

    return finalData;
  };

  const monthlyBreakdown = processMonthlyData();

  // Generate columns for the table
  const columns = [
    {
      title: 'Mwezi',
      dataIndex: 'month',
      key: 'month',
      render: (text: string, record: any) => (
        <Text strong={record.isTotal}>{text}</Text>
      )
    },
    {
      title: 'Mchango (Tsh)',
      dataIndex: 'mchango',
      key: 'mchango',
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      )
    },
    {
      title: 'Sadaka (Tsh)',
      dataIndex: 'sadaka',
      key: 'sadaka',
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      )
    },
    {
      title: 'Zaka (Tsh)',
      dataIndex: 'zaka',
      key: 'zaka',
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      )
    },
    {
      title: 'Jumla (Tsh)',
      dataIndex: 'total',
      key: 'total',
      render: (value: number, record: any) => (
        <Text strong={record.isTotal}>{value.toLocaleString()}</Text>
      )
    }
  ];

  return (
    <div>
      <Card title="RIPOTI YA MAPATO" className="mt-14">
        <div className="mb-6">
          <RangePicker
            value={dates}
            onChange={(values) => values && setDates(values)}
            format="YYYY-MM-DD"
            className="mb-4"
          />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Text strong>Jumla ya mapato:</Text>
              <Text className="block text-lg">
                Tsh {revenueData?.summary?.total_revenue?.toLocaleString()}
              </Text>
            </div>
            <div className="flex-1">
              <Text strong>Jumla ya miamala:</Text>
              <Text className="block text-lg">
                {revenueData?.summary?.total_records}
              </Text>
            </div>
          </div>
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
            rowClassName={(record) => record.isTotal ? 'total-row' : ''}
          />
        </div>
      </Card>
    </div>
  );
};

export default RevenueStatementReport;
// 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