import {
  Card,
  Progress,
  Table,
} from "antd";
import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import {  useQuery, } from "@tanstack/react-query";
import {
  fetchAhadi,
  fetchMchangoStats,
  fetchMichangoPayment,
} from "../../helpers/ApiConnectors.ts";
// import {
//   DownOutlined,
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Tabletop from "../../components/tables/TableTop.tsx";
import { useAppSelector } from "../../store/store-hooks.ts";

const Mchango = () => {
  const params = useParams();
  // const [openModal, setOpenModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const tableId = "data-table";
  // const queryClient = useQueryClient();
  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    categories: string[];
  }>({
    series: [],
    categories: [],
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { data: michango, isLoading: loadingmichango } = useQuery({
    queryKey: ["michango-payment"],
    queryFn: async () => {
      const response: any = await fetchMichangoPayment(
        `?mchango_id=${params?.id}&&church_id=${church.id}`
      );

      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const {
    data: mchango_totals,
  } = useQuery({
    queryKey: ["mchango_totals"],
    queryFn: async () => {
      const response: any = await fetchMchangoStats(params?.id);
      return response;
    },
  });

  useEffect(() => {
    if (mchango_totals) {
      const monthlyData = months?.map((month) => {
        const foundMonth = mchango_totals?.monthly_collections?.find(
          (data: any) => data?.month == month
        );
        console.log(foundMonth);

        return foundMonth ? foundMonth?.total_collected : 0;
      });

      setChartData({
        series: [
          {
            name: "Monthly Collections",
            data: monthlyData,
          },
        ],
        categories: months,
      });
    }
  }, [michango, params]);

  const { data: ahadiList, isLoading: loadingAhadi } = useQuery({
    queryKey: ["Ahadi"],
    queryFn: async () => {
      const response: any = await fetchAhadi( `?mchango_id=${params?.id}&&church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  console.log(chartData);

  // const handleDeletePayment = (id: any) => {
  //   modal.confirm({
  //     title: "Confirm Deletion",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Are you sure you want to delete this payment?",
  //     onOk: () => {
  //       deletePaymentMutation(id);
  //     },
  //   });
  // };

  // const { mutate: deletePaymentMutation } = useMutation({
  //   mutationFn: async () => {
  //     return new Promise((_resolve) => {
  //       // Your delete logic here
  //       // resolve();
  //     });
  //   },
  //   onSuccess: () => {
  //     message.success("Payment deleted successfully!");
  //     //   queryClient.invalidateQueries();
  //   },
  //   onError: () => {
  //     message.error("Failed to delete payment.");
  //   },
  // });

  // const handleDeleteAhadi = (_id: any) => {
  //   modal.confirm({
  //     title: "Confirm Deletion",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Are you sure you want to delete this ahadi?",
  //     onOk: () => {
  //       // deleteAhadiMutation(id);
  //     },
  //   });
  // };

  //   const { mutate: deleteAhadiMutation } = useMutation(deleteAhadi, {
  //     onSuccess: () => {
  //       message.success("Ahadi deleted successfully!");
  //       queryClient.invalidateQueries(["mchangoDetails"]);
  //     },
  //     onError: () => {
  //       message.error("Failed to delete ahadi.");
  //     },
  //   });

  const mchangoPaymentColumns = [
    {
      title: "S/No",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: ["mhumini_details", "first_name"],
      render: (_: any, record: any) => `${record.mhumini_details.first_name} ${record.mhumini_details.last_name}`,
    },
    {
      title: "Payment type",
      dataIndex: ["payment_type_details", "name"],
    },
    {
      title: "Muumini",
      dataIndex: ["mhumini_details", "first_name"],
      render: (_: any, record: any) => `${record.mhumini_details.first_name} ${record.mhumini_details.last_name}`,
    },
    {
      title: "Amount Paid",
      dataIndex: "amount",
      render: (amount: string) => `Tsh ${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "inserted_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    // {
    //   title: "Actions",
    //   render: (_: any, record: any) => (
    //     <Dropdown
    //       overlay={
    //         <Menu>
    //           <Menu.Item
    //             icon={<EyeOutlined />}
    //             onClick={() => console.log("View Payment", record.id)}
    //           >
    //             View
    //           </Menu.Item>
    //           <Menu.Item
    //             icon={<EditOutlined />}
    //             onClick={() => console.log("Edit Payment", record.id)}
    //           >
    //             Edit
    //           </Menu.Item>
    //           <Menu.Item
    //             icon={<DeleteOutlined />}
    //             onClick={() => handleDeletePayment(record.id)}
    //             danger
    //           >
    //             Delete
    //           </Menu.Item>
    //         </Menu>
    //       }
    //     >
    //       <a onClick={(e) => e.preventDefault()}>
    //         Actions <DownOutlined />
    //       </a>
    //     </Dropdown>
    //   ),
    // },
  ];

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
        (
          a?.mhumini_details?.first_name + a.mhumini_details?.last_name
        ).localeCompare(
          b?.mhumini_details?.first_name + b.mhumini_details?.last_name
        ),
    },
    {
      title: "Mchango",
      dataIndex: "mchango_details",
      key: "mchango",
      render: (mchango_details: any) => (
        <div>
          {mchango_details ? mchango_details?.mchango_name : "Bila Mchango"}
        </div>
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
      render: (amount: string) => (
        <div>Tsh {parseFloat(amount).toLocaleString()}</div>
      ),
      sorter: (a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Paid Amount (Tzs)",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (paid_amount: string) => (
        <div>Tsh {parseFloat(paid_amount).toLocaleString()}</div>
      ),
      sorter: (a: any, b: any) =>
        parseFloat(a.paid_amount) - parseFloat(b.paid_amount),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (_: any, record: any) => {
        const amount = parseFloat(record.amount);
        const paidAmount = parseFloat(record.paid_amount);
        const percent =
          amount > 0 ? Math.min((paidAmount / amount) * 100, 100) : 0;
        return (
          <Progress
            percent={percent}
            status={percent === 100 ? "success" : "active"}
            size="small"
            format={(percent: any) => `${percent.toFixed(2)}%`}
          />
        );
      },
      sorter: (a: any, b: any) => {
        const percentA =
          a.amount > 0 ? parseFloat(a.paid_amount) / parseFloat(a.amount) : 0;
        const percentB =
          b.amount > 0 ? parseFloat(b.paid_amount) / parseFloat(b.amount) : 0;
        return percentA - percentB;
      },
    },
    {
      title: "Ahadi date",
      dataIndex: "date_pledged",
      key: "date_pledged",
      render: (date: string) => (
        <div>{new Date(date).toLocaleDateString()}</div>
      ),
      sorter: (a: any, b: any) =>
        new Date(a.date_pledged).getTime() - new Date(b.date_pledged).getTime(),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (date: string) => (
        <div>{new Date(date).toLocaleDateString()}</div>
      ),
      sorter: (a: any, b: any) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (remark: string) => <div>{remark}</div>,
    },
    // {
    //   title: "",
    //   render: (text: any, record: any) => (
    //     <Dropdown
    //       overlay={
    //         <Menu>
    //           <Menu.Item
    //             key="1"
    //             icon={<EyeOutlined />}
    //             // onClick={() => handleView(record)}
    //           >
    //             View
    //           </Menu.Item>
    //           <Menu.Item
    //             key="2"
    //             icon={<PlusCircleFilled />}
    //             onClick={() => {
    //               //   setSelectedData(record);
    //               //   setPayAhadiModal(true)
    //             }}
    //           >
    //             Lipia Ahadi
    //           </Menu.Item>
    //           <Menu.Item
    //             key="3"
    //             icon={<EditOutlined />}
    //             onClick={() => {
    //               //   setSelectedData(record);
    //               //   setupdateAhadiModal(true);
    //             }}
    //           >
    //             Edit
    //           </Menu.Item>
    //           <Menu.Item
    //             key="4"
    //             icon={<DeleteOutlined />}
    //             danger
    //             // onClick={() => handleDelete(record?.id)}
    //           >
    //             Delete
    //           </Menu.Item>
    //         </Menu>
    //       }
    //       trigger={["click"]}
    //     >
    //       <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
    //         Actions <DownOutlined />
    //       </a>
    //     </Dropdown>
    //   ),
    // },
  ];

  return (
    <div>
      <Card
        title={
          <h3 className="text-sm font-bold  ">
            Mchango wa {mchango_totals?.mchango_name}
          </h3>
        }
        className="mt-14"
      >
        <h3 className="text-sm font-bold text-left">
          Jumla ya Makusanyo:{" "}
          <span className="text-gray-800">
            {mchango_totals?.collected_amount} Tzs
          </span>
        </h3>
        <h3 className="text-sm font-bold text-left">
          Jumla ya Iliyobaki:{" "}
          <span className="text-gray-800">
            {mchango_totals?.remaining_amount} Tzs
          </span>
        </h3>
        <div>
          <h3 className="text-sm font-bold text-left">Asilimia</h3>
          <Progress
            percent={Math.round(
              (mchango_totals?.collected_amount /
                (mchango_totals?.collected_amount +
                  mchango_totals?.remaining_amount)) *
                100
            )}
            size="default"
            type="circle"
            className="justify-start"
          />
        </div>

        <div className="mt-5">
          <Chart
            options={{
              colors: ["#28C76F", "#FF9F43"],
              chart: {
                type: "area",
                toolbar: {
                  show: false,
                },
              },
              xaxis: {
                categories: chartData.categories,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },
            }}
            series={chartData.series}
            type="area"
            height={300}
          />
        </div>
      </Card>

      <Card
        title={
          <h3 className="font-bold text-sm text-left ">Mchango payments</h3>
        }
        className="mt-5"
      >
        <div className="table-responsive">
          <Tabletop
            inputfilter={false}
            showFilter={false}
            data={tableId}
            togglefilter={function (_value: boolean): void {
              throw new Error("Function not implemented.");
            }}
            searchTerm={""}
            onSearch={function (_value: string): void {
              throw new Error("Function not implemented.");
            }}
          />
          <Table
              id={tableId}
            columns={mchangoPaymentColumns}
            dataSource={michango}
            loading={loadingmichango}
          />
        </div>
      </Card>
      <Card title={<h3 className="text-left">Orodha ya Ahadi</h3>} className="mt-5">
        <div className="table-responsive">
          <Tabletop
            inputfilter={false}
            showFilter={false}
            data={tableId}
            togglefilter={function (_value: boolean): void {
              throw new Error("Function not implemented.");
            }}
            searchTerm={""}
            onSearch={function (_value: string): void {
              throw new Error("Function not implemented.");
            }}
          />
          <Table
              id={tableId}
            columns={columns}
            dataSource={ahadiList}
            loading={loadingAhadi}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Mchango;
