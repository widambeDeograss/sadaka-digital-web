import { Card, Table, Typography, DatePicker, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../store/store-hooks.ts";
import { fetchExpenseStatement } from "../../helpers/ApiConnectors.ts";
import Tabletop from "../../components/tables/TableTop.tsx";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

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
  December: "Desemba"
};

const ExpenseStatementReport = () => {
  const church = useAppSelector((state: any) => state.sp);
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('year'),
    dayjs().endOf('year')
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: expenseData, isLoading } = useQuery({
    queryKey: ["expense-statement", dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')],
    queryFn: () => {
      const response: any = fetchExpenseStatement({
        church_id: church.id,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD')
      });
      return response;
    }
  });

  // Generate dynamic columns based on API response
  const columns = [
    {
      title: 'Aina ya Matumizi',
      dataIndex: 'category',
      key: 'category',
      fixed: 'left' as const,
      width: 300,
    },
    ...(expenseData?.monthly_data || []).map((month: any) => ({
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
  const tableData = () => {
    if (!expenseData?.monthly_data) return [];

    // Get all unique categories
    const categories = Array.from(new Set(expenseData.monthly_data.flatMap((month: any) =>
      month.categories.map((cat: any) => cat.category_name)
    )));

    // Filter categories if a specific category is selected
    const filteredCategories = selectedCategory
      ? categories.filter((cat) => cat === selectedCategory)
      : categories;

    // Generate table data for each category
    return filteredCategories.map((category) => {
      const monthValues: { [key: string]: number } = {};
      let total = 0;

      expenseData.monthly_data.forEach((month: any) => {
        const monthKey = month.month_name.toLowerCase();
        const cat = month.categories.find((c: any) => c.category_name === category);
        monthValues[monthKey] = cat?.total_amount || 0;
        total += cat?.total_amount || 0;
      });

      return {
        key: category,
        category: category,
        ...monthValues,
        total,
      };
    });
  };

  // Get unique categories for the filter dropdown
  const categories = Array.from(new Set(expenseData?.monthly_data?.flatMap((month: any) => month.categories.map((cat: any) => cat.category_name)
    )) as unknown as string[]);

  return (
    <div>
      <Card title="RIPOTI YA MATUMIZI" className="mt-14">
        <div className="mb-6">
          <RangePicker
            value={dates}
            // @ts-ignore
            onChange={(values) => values && setDates(values)}
            format="YYYY-MM-DD"
            className="mb-4"
          />

          <div className="flex gap-4 mb-4">
            <Select
              placeholder="Chagua Aina ya Matumizi"
              style={{ width: 200 }}
              onChange={(value) => setSelectedCategory(value)}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Text strong>Jumla ya Matumizi:</Text>
              <Text className="block text-lg">
                Tsh {expenseData?.summary?.total_expenses?.toLocaleString()}
              </Text>
            </div>
            <div className="flex-1">
              <Text strong>Bajeti ya Jumla:</Text>
              <Text className="block text-lg">
                Tsh {expenseData?.summary?.total_budget?.toLocaleString()}
              </Text>
            </div>
           
          </div>
        </div>

        <div className="table-responsive">
          <Tabletop
            inputfilter={false}
            showFilter={false}
            data="expense-table"
            togglefilter={() => {}}
            searchTerm=""
            onSearch={() => {}}
          />
          <Table
            id="expense-table"
            columns={columns}
            dataSource={tableData()}
            loading={isLoading}
            scroll={{ x: true }}
            pagination={false}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={1}>
                    <Text strong>Jumla</Text>
                  </Table.Summary.Cell>
                  {(expenseData?.monthly_data || []).map((month: any, index: number) => (
                    <Table.Summary.Cell key={month.month_name} index={index + 1}>
                      <Text strong>
                        Tsh {month.month_total.toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                  ))}
                  <Table.Summary.Cell index={(expenseData?.monthly_data?.length || 0) + 1}>
                    <Text strong>
                      Tsh {expenseData?.summary?.total_expenses?.toLocaleString()}
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

export default ExpenseStatementReport;