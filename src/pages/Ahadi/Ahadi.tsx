// src/components/Ahadi.tsx

import React, { useState } from "react";
import { Button, Card, Select, Table, Typography, Progress } from "antd";
import OngezaAhadi from "./OngezaAhadi";
import Widgets from "./Stats";
import Tabletop from "../../components/tables/TableTop";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchAhadi } from "../../helpers/ApiConnectors";

const { Title } = Typography;
const { Option } = Select;

const Ahadi = () => {
  const [openModal, setOpenModal] = useState(false);

  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const { data: ahadiList, isLoading: loadingAhadi } = useQuery({
    queryKey: ["Ahadi"],
    queryFn: async () => {
      const response: any = await fetchAhadi(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  // Define table columns
  const columns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      key: "sNo",
      render: (_: any, __: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: "Name",
      dataIndex: "mhumini_details",
      key: "wahumini",
      render: (mhumini_details: any) => (
        <div>
          {mhumini_details?.first_name} {mhumini_details?.last_name}
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a?.mhumini_details?.first_name + a.mhumini_details?.last_name).localeCompare(
          b?.mhumini_details?.first_name + b.mhumini_details?.last_name
        ),
    },
    {
      title: "Mchango",
      dataIndex: "mchango_details",
      key: "mchango",
      render: (mchango_details: any) => (
        <div>{mchango_details ? mchango_details?.mchango_name : "Bila Mchango"}</div>
      ),
      sorter: (a: any, b: any) => {
        const nameA = a?.mchango_details?.mchango_name || "";
        const nameB = b?.mchango_details?.mchango_name || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Amount (Tzs)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => <div>Tsh {parseFloat(amount).toLocaleString()}</div>,
      sorter: (a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Paid Amount (Tzs)",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (paid_amount: string) => <div>Tsh {parseFloat(paid_amount).toLocaleString()}</div>,
      sorter: (a: any, b: any) => parseFloat(a.paid_amount) - parseFloat(b.paid_amount),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (_: any, record: any) => {
        const amount = parseFloat(record.amount);
        const paidAmount = parseFloat(record.paid_amount);
        const percent = amount > 0 ? Math.min((paidAmount / amount) * 100, 100) : 0;
        return (
          <Progress
            percent={percent}
            status={percent === 100 ? "success" : "active"}
            size="small"
            format={(percent:any) => `${percent.toFixed(2)}%`}
          />
        );
      },
      sorter: (a: any, b: any) => {
        const percentA = a.amount > 0 ? parseFloat(a.paid_amount) / parseFloat(a.amount) : 0;
        const percentB = b.amount > 0 ? parseFloat(b.paid_amount) / parseFloat(b.amount) : 0;
        return percentA - percentB;
      },
    },
    {
      title: "Date Pledged",
      dataIndex: "date_pledged",
      key: "date_pledged",
      render: (date: string) => <div>{new Date(date).toLocaleDateString()}</div>,
      sorter: (a: any, b: any) =>
        new Date(a.date_pledged).getTime() - new Date(b.date_pledged).getTime(),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (date: string) => <div>{new Date(date).toLocaleDateString()}</div>,
      sorter: (a: any, b: any) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (remark: string) => <div>{remark}</div>,
    },
  ];

  return (
    <div className="">
      <Widgets />
      <Card title={<Title level={4}>Ahadi</Title>} className="mb-10">
        <div className="text-xs">
          <h3 className="text-left">
            Tarehe: <span>{new Date().toDateString()}</span>
          </h3>
          <h3 className="text-left">
            Ahadi Zilizorudishwa Mwezi huu: <span>0</span>
          </h3>
          <div className="flex justify-between flex-wrap mt-3">
            <div>
              <Button.Group className="mt-5">
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setOpenModal(true)}
                >
                  Ongeza Ahadi
                </Button>
                {/* Add more buttons if needed */}
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>
      <Card
        title={<Title level={5}>Orodha ya Ahadi</Title>}
        className="mt-5"
      >
        <div className="">
          <Tabletop
            inputfilter={false}
            togglefilter={() => {}}
          />
          <Table
            columns={columns}
            dataSource={ahadiList}
            loading={loadingAhadi}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
      <OngezaAhadi
        openModal={openModal}
        handleCancel={() => setOpenModal(false)}
      />
    </div>
  );
};

export default Ahadi;
