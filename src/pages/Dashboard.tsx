import { Button, Card, Col, List, Row, Statistic } from "antd";
import { Colors } from "../Constants/Colors.ts";
import { WalletOutlined } from "@ant-design/icons";
import EChart from "../components/chart/bChart.tsx";
import LineChart from "../components/chart/lineChart.tsx";
import { UsersIcon } from "lucide-react";
import { BiCard, BiMoney } from "react-icons/bi";
import { FaHandsBound } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query"; 
import { useAppSelector } from "../store/store-hooks.ts";
import { fetchDashboard } from "../helpers/ApiConnectors.ts";

const textColor = "black"; 

const Dashboard = () => {
const church = useAppSelector((state: any) => state.sp)

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
        const response: any = await fetchDashboard(`?church_id=${church?.id}`);
        return response;
    },
});


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: Unable to fetch data</div>;

  // Extract statistics from the API response
  const { total_wahumini, total_card_numbers, total_revenue, total_jumuiya } =
    data || {};

  return (
    <div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        <Card style={{ minHeight: "125px", minWidth: "83px" }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Statistic
                title="Total Wahumini"
                value={total_wahumini}
                valueStyle={{
                  fontSize: "medium",
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
                  backgroundColor: Colors.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "40px",
                }}
              >
                <UsersIcon className="text-white font-bold" />
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
            <span className="ml-10">Since started</span>
          </p>
        </Card>

        <Card style={{ minHeight: "125px", minWidth: "83px" }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Statistic
                title="Total bahasha"
                value={total_card_numbers}
                valueStyle={{
                    fontSize: "medium",
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
                  backgroundColor: Colors.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "40px",
                }}
              >
                <BiCard className="text-white font-bold" />
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
                  +8%{" "}
                </span>
            <span className="ml-10">Since started</span>
          </p>
        </Card>

        <Card style={{ minHeight: "125px", minWidth: "83px" }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Statistic
                title="Total Revenue"
                value={`${total_revenue}`}
                valueStyle={{
                  fontSize: "medium",
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
                  backgroundColor: Colors.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "40px",
                }}
              >
                <BiMoney className="text-white font-bold" />
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
                  +8%{" "}
                </span>
            <span className="ml-10">This year</span>
          </p>
        </Card>

        <Card style={{ minHeight: "125px", minWidth: "83px" }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <Statistic
                title="Total Jumuiya"
                value={total_jumuiya}
                valueStyle={{
                  fontSize: "medium",
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
                  backgroundColor: Colors.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "40px",
                }}
              >
                <FaHandsBound className="text-white font-bold" />
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
                  +8%{" "}
                </span>
            <span className="ml-10">Since started</span>
          </p>
        </Card>
      </div>

      {/* Charts */}
      <Row gutter={[24, 0]} className="mt-10">
        <Col xs={24} sm={24} md={12} lg={12} xl={10}>
          <Card bordered={false} className="criclebox h-full">
            <EChart />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14}>
          <Card bordered={false} className="criclebox h-full">
            <LineChart />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
