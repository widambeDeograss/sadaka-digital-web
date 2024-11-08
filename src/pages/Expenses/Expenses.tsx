// src/components/Expenses.tsx

import React, { useEffect, useState } from "react";
import { Button, Card, Table, Typography, Progress, Spin, message, Dropdown, Menu } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import AddExpenseModal from "./AddExpModal";
import Tabletop from "../../components/tables/TableTop";
import Widgets from "./Stats";
import { useAppSelector } from "../../store/store-hooks";
import { deleteExpence, fetchtExpenses } from "../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import modal from "antd/es/modal";
import ViewModal from "./ViewExpence";

const { Title } = Typography;

interface ExpenseCategoryDetails {
  id: number;
  category_name: string;
  budget:number;
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
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
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

  const handleView = (record: any) => {
    setSelectedData(record);
    setModalVisible(true);
  };

  const handleDelete = (SadakaId: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "cancel",
      onOk: () => {
        deleteSadakaMutation(SadakaId);
      },
    });
  };

  const { mutate: deleteSadakaMutation } = useMutation({
    mutationFn: async (SadakaId: any) => {
      await deleteExpence(SadakaId);
    },
    onSuccess: () => {
      message.success("Sadaka deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["Sadaka"] });
    },
    onError: () => {
      message.error("Failed to delete Sadaka.");
    },
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
      title: "Category Budget",
      dataIndex: ["category_details", "budget"],
      key: "category",
    //   sorter: (a: Expense, b: Expense) =>
    //     a?.category_details?.budget?.localeCompare(b?.category_details?.category_name),
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
        const budget = record?.category_details?.budget;
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
    {
      title: "",
      render: (text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="1"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
              >
                View
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedData(record);
                  setOpenModal(true);
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                key="3"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record?.id)}
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Actions <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = expenses.filter((item: any) => {
        return (
          item?.bahasha_details?.mhumini_details?.first_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_details?.mhumini_details?.last_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_details?.card_no.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(expenses);
    }
  }, [searchTerm, expenses]);

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
      <div className="table-responsive">
          <Tabletop
              inputfilter={showFilter}
              onSearch={(term: string) => setSearchTerm(term)}
              togglefilter={(value: boolean) => setShowFilter(value)}
              searchTerm={searchTerm}
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
        expense={selectedData}
        handleCancel={() => setOpenModal(false)}
      />

      <ViewModal
      data={selectedData}
      onClose={()=>  setModalVisible(false)}
      visible={modalVisible}
      />
    </div>
  );
};

export default Expenses;
