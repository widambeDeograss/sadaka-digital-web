import {Button, Card, Col, List, Row, Statistic} from "antd";
import {Colors} from "../Constants/Colors.ts";
import {WalletOutlined} from "@ant-design/icons";
import EChart from "../components/chart/bChart.tsx";
import LineChart from "../components/chart/lineChart.tsx";

const textColor = "black"; // Define the color for the StatNumber
const data = [
    {
        title: "Zaka March, 01, 2023",
        description: "#MS-415646",
        amount: "180",
    },
    {
        title: "Sadaka February, 12, 2023",
        description: "#RV-126749",
        amount: "250",
    },
    {
        title: "Wahumini April, 05, 2023",
        description: "#FB-212562",
        amount: "550",
    },
    {
        title: "Ahadi June, 25, 2023",
        description: "#QW-103578",
        amount: "400",
    },

];
const download = [
    <svg
        width="15"
        height="15"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key="0"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 17C3 16.4477 3.44772 16 4 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17ZM6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289L9 10.5858L9 3C9 2.44772 9.44771 2 10 2C10.5523 2 11 2.44771 11 3L11 10.5858L12.2929 9.29289C12.6834 8.90237 13.3166 8.90237 13.7071 9.29289C14.0976 9.68342 14.0976 10.3166 13.7071 10.7071L10.7071 13.7071C10.5196 13.8946 10.2652 14 10 14C9.73478 14 9.48043 13.8946 9.29289 13.7071L6.29289 10.7071C5.90237 10.3166 5.90237 9.68342 6.29289 9.29289Z"
            fill="#111827"
        ></path>
    </svg>,
];
const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1  gap-10 xl:grid-cols-4  lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        <Card style={{ minHeight: "125px", minWidth: "83x" }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Statistic
                  title="Today's Money"
                  value="$53,897"
                  valueStyle={{
                    fontSize: "xx-small",
                    fontWeight: "bold",
                    color: textColor,
                  }}
              />
            </Col>
            <Col span={12}>
              <div
                  style={{
                    borderRadius: "50%",
                    height: "45px",
                    maxWidth: "45px",
                    minWidth:"43px",
                    backgroundColor: Colors.secondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "40px",
                    // padding:"10px"
                    // boxShadow: '200px rgba(0, 0, 0, 0.1)'
                  }}
                  className="min"
              >
                <WalletOutlined className="text-white font-bold" />
              </div>
            </Col>
          </Row>
          <p
              style={{
                color: "gray.400",
                fontSize: "xx-small",
                display: "inline-flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
          >
                <span style={{ color: "green", fontWeight: "bold" }}>
                  +3.48%{" "}
                </span>
            <span className="ml-10">Since last month</span>
          </p>
        </Card>
        <Card style={{ minHeight: "125px", minWidth: "83x" }}>
            <Row gutter={16} align="middle">
                <Col span={12}>
                    <Statistic
                        title="Today's Money"
                        value="$53,897"
                        valueStyle={{
                            fontSize: "smaller",
                            fontWeight: "bold",
                            color: textColor,
                        }}
                    />
                </Col>
                <Col span={12}>
                    <div
                        style={{
                            borderRadius: "50%",
                            height: "45px",
                            maxWidth: "45px",
                            minWidth:"43px",
                            backgroundColor: Colors.secondary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "40px",
                            // padding:"10px"
                            // boxShadow: '200px rgba(0, 0, 0, 0.1)'
                        }}
                        className="min"
                    >
                        <WalletOutlined className="text-white font-bold" />
                    </div>
                </Col>
            </Row>
            <p
                style={{
                    color: "gray.400",
                    fontSize: "xx-small",
                    display: "inline-flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                }}
            >
                <span style={{ color: "green", fontWeight: "bold" }}>
                  +3.48%{" "}
                </span>
                <span className="ml-10">Since last month</span>
            </p>
        </Card>
        <Card style={{ minHeight: "125px", minWidth: "83x" }}>
            <Row gutter={16} align="middle">
                <Col span={12}>
                    <Statistic
                        title="Today's Money"
                        value="$53,897"
                        valueStyle={{
                            fontSize: "smaller",
                            fontWeight: "bold",
                            color: textColor,
                        }}
                    />
                </Col>
                <Col span={12}>
                    <div
                        style={{
                            borderRadius: "50%",
                            height: "45px",
                            maxWidth: "45px",
                            minWidth:"43px",
                            backgroundColor: Colors.secondary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "40px",
                            // padding:"10px"
                            // boxShadow: '200px rgba(0, 0, 0, 0.1)'
                        }}
                        className="min"
                    >
                        <WalletOutlined className="text-white font-bold" />
                    </div>
                </Col>
            </Row>
            <p
                style={{
                    color: "gray.400",
                    fontSize: "xx-small",
                    display: "inline-flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                }}
            >
                <span style={{ color: "green", fontWeight: "bold" }}>
                  +3.48%{" "}
                </span>
                <span className="ml-10">Since last month</span>
            </p>
        </Card>
        <Card style={{ minHeight: "125px", minWidth: "83x" }}>
            <Row gutter={16} align="middle">
                <Col span={12}>
                    <Statistic
                        title="Today's Money"
                        value="$53,897"
                        valueStyle={{
                            fontSize: "smaller",
                            fontWeight: "bold",
                            color: textColor,
                        }}
                    />
                </Col>
                <Col span={12}>
                    <div
                        style={{
                            borderRadius: "50%",
                            height: "45px",
                            maxWidth: "45px",
                            minWidth:"43px",
                            backgroundColor: Colors.secondary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "40px",
                            // padding:"10px"
                            // boxShadow: '200px rgba(0, 0, 0, 0.1)'
                        }}
                        className="min"
                    >
                        <WalletOutlined className="text-white font-bold" />
                    </div>
                </Col>
            </Row>
            <p
                style={{
                    color: "gray.400",
                    fontSize: "xx-small",
                    display: "inline-flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                }}
            >
                <span style={{ color: "green", fontWeight: "bold" }}>
                  +3.48%{" "}
                </span>
                <span className="ml-10">Since last month</span>
            </p>
        </Card>
      </div>

        <Row gutter={[24, 0]} className="mt-10">
            <Col xs={24} sm={24} md={12} lg={12} xl={10} className="">
                <Card bordered={false} className="criclebox h-full">
                    <EChart />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={14} className="">
                <Card bordered={false} className="criclebox h-full">
                    <LineChart />
                </Card>
            </Col>
        </Row>
        <Card
            bordered={false}
            className="header-solid h-full ant-invoice-card mt-10"
            title={[<h6 className="font-bold m-0 py-10 text-xs">Taarifa za hivi karibuni.</h6>]}
            extra={[
                <Button>
                    <span className="text-xs">VIEW ALL</span>
                </Button>
            ]}
        >
            <List
                itemLayout="horizontal"
                className="invoice-list text-left"
                dataSource={data}

                renderItem={(item:any) => (
                    <List.Item

                        actions={[<Button className="flex justify-center items-center" type="link">{download} PDF</Button>]}
                    >
                        <List.Item.Meta
                            title={item.title}
                            description={item.description}
                        />
                        <div className="amount">{item.amount}</div>
                    </List.Item>
                )}
            />
        </Card>
    </div>
  )
}

export default Dashboard
