import { Card, Col, Row, Table, Progress,  } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/store-hooks.ts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAhadi, fetchMhuminiStats } from "../../helpers/ApiConnectors.ts";
import Tabletop from "../../components/tables/TableTop.tsx";
import Chart from "react-apexcharts";
import {
    PiHandsPrayingFill,
    PiHandshakeBold,
  } from "react-icons/pi";
  import { GiSwapBag, GiTakeMyMoney, } from "react-icons/gi";

const Muhumini = () => {
    const params = useParams();
    const location = useLocation();
    const muhumi_details = location?.state?.record;
    const church = useAppSelector((state: any) => state.sp);
    const [chartData, setChartData] = useState<{
        series: { name: string; data: number[] }[];
        categories: string[];
    }>({ series: [], categories: [] });

    const months = Array.from({ length: 12 }, (_, i) => i + 1);  // Array for 12 months

    const { data: mhumini_totals } = useQuery({
        queryKey: ["mhumini_totals"],
        queryFn: async () => {
            const response: any = await fetchMhuminiStats(`?mhumini=${params?.id}`);
            return response;
        },
    });

    const { data: ahadiList, isLoading:ahadiLoading } = useQuery({
        queryKey: ["Ahadi"],
        queryFn: async () => {
            const response: any = await fetchAhadi(`?mhumini=${params?.id}&church_id=${church.id}`);
            return response;
        },
    });

    useEffect(() => {
        if (mhumini_totals) {
            const zakaData = months.map(month => {
                const monthData = mhumini_totals?.monthly?.zaka.find((data: any) => data.date__month === month);
                return monthData ? monthData.monthly_total : 0;
            });

            const sadakaData = months.map(month => {
                const monthData = mhumini_totals?.monthly?.sadaka.find((data: any) => data.date__month === month);
                return monthData ? monthData.monthly_total : 0;
            });

            setChartData({
                series: [
                    { name: "Zaka", data: zakaData },
                    { name: "Sadaka", data: sadakaData },
                ],
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            });
        }
    }, [mhumini_totals]);

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
    const icons = [<PiHandsPrayingFill style={{ fontSize: '22px' }}/>, <GiSwapBag style={{ fontSize: '22px' }}/>, <PiHandshakeBold style={{ fontSize: '22px' }}/>, <GiTakeMyMoney style={{ fontSize: '22px' }}/>]
    return (
        <div className="mt-4">
            <Row gutter={[24, 0]} className="mb-5">
                {['Sadaka', 'Zaka', 'Michango', 'Ahadi'].map((title, i) => (
                    <Col xs="24" xl={6} key={title}>
                        <div className="bg-white p-1 h-32 rounded-lg mb-1 hover:scale-105 transition-transform">
                            <div className="flex flex-col justify-center items-center mt-5 text-black">
                                {icons[i]}
                                <h3 className="font-bold text-sm mt-3">Jumla {title}</h3>
                                <h3 className="font-bold text-xs ">{mhumini_totals?.totals[title.toLowerCase()].toLocaleString()} Tzs</h3>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            <Card title="Matoleo ya Muhumini">
                <h3 className="text-sm font-bold text-left">JINA LA MUHUMINI: <span className="text-gray-800">
                  {muhumi_details?.first_name} {muhumi_details?.last_name}
                  
                  </span></h3>
                <h3 className="text-sm font- text-left">JUMUIYA: <span className="text-gray-800">
                  {muhumi_details?.jumuiya_details?.name}
                  </span></h3>
                
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

            <Card title={<h3 className="text-left">Orodha ya Ahadi</h3>} className="mt-5">
                <div className="table-responsive">
                    <Tabletop
                        inputfilter={false}
                        showFilter={false}
                        togglefilter={() => {}}
                        searchTerm={""}
                        onSearch={() => {}}
                        data={ahadiList}
                    />
                    <Table
                        columns={columns}
                        dataSource={ahadiList}
                        loading={ahadiLoading}
                        rowKey="id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Muhumini;

