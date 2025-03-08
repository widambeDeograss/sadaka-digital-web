import { Card, Progress, Table } from "antd";
import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMavunoPayments,
  fetchMavunoStats,
  retrieveMavuno,
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

const MavunoDetails = () => {
  const params = useParams();
  // const [openModal, setOpenModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const tableId = "mavuno-payments";
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

  const { data: mavunoPay, isLoading: loadingMavuno } = useQuery({
    queryKey: ["mavuno-payment"],
    queryFn: async () => {
      const response: any = await fetchMavunoPayments(
        `?mavuno_id=${params?.id}&&church_id=${church.id}`
      );

      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const { data: mavunoDetails } = useQuery({
    queryKey: ["vuno"],
    queryFn: async () => {
      const response: any = await retrieveMavuno(`${params?.id}`);

      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const { data: mavuno_totals } = useQuery({
    queryKey: ["mavuno_totals"],
    queryFn: async () => {
      let query = `?church_id=${church.id}&&type=chart&&mavuno_id=${params?.id}`;
      const response: any = await fetchMavunoStats(query);
      return response;
    },
  });

  useEffect(() => {
    if (mavuno_totals) {
      const monthlyData = months?.map((_month, index) => {
        const foundMonth = mavuno_totals?.chart_data?.find(
          (data: any) => data.month === index + 1
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
  }, [mavuno_totals]);

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
      render: (_: any, record: any) =>
        `${record.mhumini_details.first_name} ${record.mhumini_details.last_name}`,
    },
    {
      title: "Payment type",
      dataIndex: ["payment_type_details", "name"],
    },
    {
      title: "Muhumini",
      dataIndex: ["mhumini_details", "first_name"],
      render: (_: any, record: any) =>
        `${record.mhumini_details.first_name} ${record.mhumini_details.last_name}`,
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

  return (
    <div>
      <Card
        title={
          <h3 className="text-sm font-bold  ">
            Mavuno wa {mavunoDetails?.name}
          </h3>
        }
        className="mt-14"
      >
        <h3 className="text-sm font-bold text-left">
          Jumuiya:{" "}
          <span className="text-gray-800">
            {mavunoDetails?.jumuiya_details?.name}
          </span>
        </h3>
        <h3 className="text-sm font-bold text-left">
          Jumla ya Makusanyo:{" "}
          <span className="text-gray-800">
            {mavunoDetails?.collected_amount} Tzs
          </span>
        </h3>
        <h3 className="text-sm font-bold text-left">
          Jumla kusudio:{" "}
          <span className="text-gray-800">
            {mavunoDetails?.year_target_amount} Tzs
          </span>
        </h3>
        <div>
          <h3 className="text-sm font-bold text-left">Asilimia</h3>
          <Progress
            percent={100} // Cap the visual progress at 100% full circle
            size="default"
            type="circle"
            className="justify-start"
            status={
              Math.round(
                (mavunoDetails?.collected_amount /
                  mavunoDetails?.year_target_amount) *
                  100
              ) >= 100
                ? "success" // Use success to indicate target achieved
                : "normal"
            }
            format={() => {
              // Calculate the actual percentage even when it's over 100%
              const actualPercent = Math.round(
                (mavunoDetails?.collected_amount /
                  mavunoDetails?.year_target_amount) *
                  100
              );
              return `${actualPercent}%`; // This will show values like "150%"
            }}
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
            dataSource={mavunoPay}
            loading={loadingMavuno}
          />
        </div>
      </Card>
    </div>
  );
};

export default MavunoDetails;
