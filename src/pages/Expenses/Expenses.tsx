// src/components/Expenses.tsx

import React, { useState } from "react";
import { Button, Card, Table, Typography, Progress, Spin, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import AddExpenseModal from "./AddExpModal";
import Tabletop from "../../components/tables/TableTop";
import Widgets from "./Stats";
import { useAppSelector } from "../../store/store-hooks";
import { fetchtExpenses } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";

const { Title } = Typography;

interface ExpenseCategoryDetails {
  id: number;
  category_name: string;
  inserted_by: string;
  inserted_at: string;
  updated_by: string;
  updated_at: string;
  church: number;
}

interface Expense {
  id: number;
  expense_category: number;
  category_details: ExpenseCategoryDetails;
  amount: string;
  date: string;
  spent_by: string;
  inserted_by: string;
  inserted_at: string;
  updated_by: string;
  updated_at: string;
  church: number;
}

const Expenses = () => {
  const [openModal, setOpenModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response: any = await fetchtExpenses(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {?
    //   enabled: false,
    // }
  });

  // Define Table Columns
  const columns = [
    {
      title: "s/No",
      key: "sNo",
      render: (_: any, __: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: "Category",
      dataIndex: ["category_details", "category_name"],
      key: "category",
      sorter: (a: Expense, b: Expense) =>
        a?.category_details?.category_name?.localeCompare(b?.category_details?.category_name),
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Spent By",
      dataIndex: "spent_by",
      key: "spent_by",
      sorter: (a: Expense, b: Expense) => a?.spent_by?.localeCompare(b.spent_by),
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Amount (Tzs)",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: Expense, b: Expense) => parseFloat(a.amount) - parseFloat(b.amount),
      render: (text: string) => <div>Tsh {parseFloat(text).toLocaleString()}</div>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: Expense, b: Expense) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (text: string) => <div>{new Date(text).toLocaleDateString()}</div>,
    },
    {
      title: "Progress",
      key: "progress",
      render: (_: any, record: Expense) => {
        const budget = 5000000;
        const spent = parseFloat(record.amount);
        const percent = Math.min((spent / budget) * 100, 100);

        return (
          <Progress
            percent={percent}
            status={percent === 100 ? "success" : "active"}
            size="small"
            format={(percent:any) => `${percent.toFixed(2)}%`}
          />
        );
      },
    },
  ];

  return (
    <div className="">
      <Widgets />
      <Card title={<Title level={4}>Matumizi</Title>} className="mb-10">
        <div className="text-xs">
          <h3 className="text-left">
            Tarehe: <span>{new Date().toDateString()}</span>
          </h3>
          <div className="flex justify-between flex-wrap mt-3">
            <div>
              <h3 className="text-left">
                Matumizi za mwezi: <span>Tsh 2,000,000/=</span>
              </h3>
              <h3 className="text-left">
                Matumizi mwaka huu: <span>Tsh 30,000,000/=</span>
              </h3>
            </div>
            <div>
              <Button.Group className="mt-5">
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setOpenModal(true)}
                >
                  Ongeza Matumizi
                </Button>
                {/* Add more buttons if needed */}
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>

      <Card title={<Title level={5}>Orodha ya Matumizi</Title>} className="mt-5">
        <div className="">
          <Tabletop
            inputfilter={false}
            togglefilter={() => {}}
          />

     
            <Table
              columns={columns}
              dataSource={expenses}
              loading={isLoading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              bordered
            />

        </div>
      </Card>

      <AddExpenseModal
        openModal={openModal}
        handleCancel={() => setOpenModal(false)}
      />
    </div>
  );
};

export default Expenses;
