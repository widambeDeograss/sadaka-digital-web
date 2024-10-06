import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Table,
  Timeline,
  Typography,
} from "antd";
import { DownloadOutlined, TransactionOutlined } from "@ant-design/icons";
import { useState } from "react";
import Search from "antd/es/input/Search";
import Column from "antd/es/table/Column";
import OngezaSadaka from "./OngezaSadaka.tsx";
import Widgets from "./Stats.tsx";
import Tabletop from "../../components/tables/TableTop.tsx";
import { fetchSadaka } from "../../helpers/ApiConnectors.ts";
import { useAppSelector } from "../../store/store-hooks.ts";
import { useQuery } from "@tanstack/react-query";

const timelineList = [
  {
    title: "Tsh 2500 - Michael card:20221",
    time: "09 JUN 7:20 PM",
    color: "green",
  },
  {
    title: "Tsh 2500 - Michael card:20221",
    time: "09 JUN 7:20 PM",
    color: "green",
  },
  {
    title: "Tsh 2500 - Michael card:20221",
    time: "09 JUN 7:20 PM",
  },
];

const { Title, Paragraph, Text } = Typography;
const Sadaka = () => {
  const [reverse, setReverse] = useState(false);
  const [openMOdal, setopenMOdal] = useState(false);

  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const {
    data: sadakaToday,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sadakaToday"],
    queryFn: async () => {
      const response: any = await fetchSadaka(
        `?church_id=${church.id}&filter=today`
      );
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const { data: sadaka, isLoading: loadingSadaka } = useQuery({
    queryKey: ["sadaka"],
    queryFn: async () => {
      const response: any = await fetchSadaka(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const columns = [
    {
      title: "s/No",

      dataIndex: "sNo",
      render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Name",

      dataIndex: "name",
      render: (text: any, record: any) => <div>{record?.bahasha_details?.mhumini_details?.first_name} {record?.bahasha_details?.mhumini_details?.last_name}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
        title: "Bahasha",
  
        dataIndex: "",
        render: (text: any, record: any) => (
          <div>
            {record?.bahasha_details?.card_no}
          </div>
        ),
        // sorter: (a, b) => a.name.length - b.name.length,
      },
    {
        title: "Amount",
        dataIndex: "sadaka_amount",
        render: (text: any, record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
 
   

    {
      title: "date",
      dataIndex: "date",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
  ];

  return (
    <div>
      <Widgets />

      <Card title={<h3 className="font-bold text-sm text-left">Sadaka</h3>}>
        <div>
          <div className="flex justify-between flex-wrap mt-5">
            <div>
              <h3 className="text-left font-bold text-xs">
                Tarehe: <span>{new Date().toDateString()}</span>
              </h3>
            </div>
            <div>
              <Button
                type="primary"
                className="bg-[#152033] text-white text-xs"
                onClick={() => setopenMOdal(true)}
              >
                Ongeza Sadaka
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Row gutter={24} className="mt-5">
        <Col xs={24} sm={24} md={12} lg={12} xl={16} className="">
          <Card
            title={<h3 className=" text-sm text-left">Sadaka za Leo </h3>}
            className="mt-5"
          >
            <div className="table-responsive">
              <Tabletop
                showFilter={false}
                inputfilter={false}
                togglefilter={function (value: boolean): void {
                  throw new Error("Function not implemented.");
                }}
              />
              <Table
                columns={columns}
                dataSource={sadakaToday}
                loading={isLoading}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8} className="">
          <Card bordered={false} className="criclebox h-full">
            <div className="timeline-box">
              <h3 className=" text-sm text-left font-bold">Matoleo leo</h3>
              <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                this month <span className="bnb2">20%</span>
              </Paragraph>

              <Timeline
                pending="Matoleo..."
                className="timelinelist lastweek text-xs "
                reverse={reverse}
              >
                {timelineList.map((t, index) => (
                  <Timeline.Item color={t.color} key={index}>
                    <h3 className=" text-xs text-center ">{t.title}</h3>
                    <Text>{t.time}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
              <Button
                type="primary"
                className="width-100 text-xs bg-blue-600"
                onClick={() => setReverse(!reverse)}
              >
                REVERSE
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={<h3 className=" text-sm text-left font-bold">Sadaka</h3>}
        className="mt-5"
      >
        <div className="">
          <Tabletop
            inputfilter={false}
            togglefilter={function (value: boolean): void {
              throw new Error("Function not implemented.");
            }}
          />
          <Table columns={columns} dataSource={sadaka} loading={isLoading} />
        </div>
      </Card>
      {/* <Card title={ <h3 className=" text-sm text-left font-bold">Sadaka za mwaka</h3>}
                className="mt-5">
              <div className="">
                <Tabletop/>
                  <Table
                      dataSource={sadaka}
                      className="ant-border-space table-responsive"
                  >
                      <Column title="Jina la muhumini" dataIndex="name" key="name" />
                      <Column title="Nambari ya simu" dataIndex="phone" key="phone" />

                      <Column title="Sadaka" dataIndex="changio" key="changio"

                      />
                      <Column title="Tarehe" dataIndex="tarehe" key="tarehe" />

                  </Table>
              </div>
          </Card> */}
      <OngezaSadaka openModal={openMOdal}     handleCancel={() => setopenMOdal(!openMOdal)}
    
      />
    </div>
  );
};

export default Sadaka;
