import { Card, Table, Typography, DatePicker } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../store/store-hooks.ts";
import { fetchExpenseStatement, fetchRevenueStatement } from "../../helpers/ApiConnectors.ts";
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
    dayjs().startOf('year'),
    dayjs().endOf('year')
  ]);

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ["revenue-statement", dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')],
    queryFn: () => {
      const response:any =  fetchRevenueStatement({
        church_id:   church.id,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD')});
      
      return response;
     }
     
  });

  console.log(revenueData);
  

  // Generate dynamic columns based on API response
  const columns = [
    {
      title: 'A',
      dataIndex: 'revenue_type_record',
      key: 'revenue_type_record',
      fixed: 'left' as const,
      width: 300,
    },
    ...(revenueData?.details || []).map((month: any) => ({
      title: swahiliMonths[month.month_name] || month.month_name,
      dataIndex: month.month_name.toLowerCase(),
      key: month.month_name.toLowerCase(),
      render: (value: number) => value ? `Tsh ${value.toLocaleString()}` : '-',
    })),
    {
      title: 'JUMLA',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `Tsh ${value.toLocaleString()}`,
    }
  ];

  // Process data for table
  const tableData = revenueData?.details?.map((category: any) => {
    const monthValues: { [key: string]: number } = {};
    let total = 0;

    revenueData.details.forEach((month: any) => {
      const monthKey = month.month_name.toLowerCase();
      const cat = month.find((c: any) => c.revenue_type_record === category.revenue_type_record);
      monthValues[monthKey] = cat?.total_amount || 0;
      total += cat?.total_amount || 0;
    });

    return {
      key: category.revenue_type_record,
      revenue_type_record: category.revenue_type_record,
      ...monthValues,
      total,
    };
  }) || [];

  return (
    <div>
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
            <div className="flex-1">
              <Text strong>Jumla ya mapato:</Text>
              <Text className="block text-lg">
                Tsh {revenueData?.summary?.total_revenue?.toLocaleString()}
              </Text>
            </div>
            <div className="flex-1">
              <Text strong>Jumla ya miamala:</Text>
              <Text className="block text-lg">
                Tsh {revenueData?.summary?.total_records?.toLocaleString()}
              </Text>
            </div>
            {/* <div className="flex-1">
              <Text strong>Ulinganifu wa bajeti:</Text>
              <Text className="block text-lg" type="danger">
                Tsh {expenseData?.summary?.total_remaining?.toLocaleString()}
              </Text>
            </div> */}
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
            dataSource={tableData}
            loading={isLoading}
            scroll={{ x: true }}
            pagination={false}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={1}>
                    <Text strong>Jumla</Text>
                  </Table.Summary.Cell>
                  {(revenueData?.details || []).map((month: any, index: number) => (
                    <Table.Summary.Cell key={month.month_name} index={index + 1}>
                      <Text strong>
                        Tsh {month.month_total.toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                  ))}
                  <Table.Summary.Cell index={(revenueData?.details?.length || 0) + 1}>
                    <Text strong>
                      Tsh {revenueData?.summary?.total_revenue?.toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default RevenueStatementReport;