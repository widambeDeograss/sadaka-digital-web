import React from "react";
import { Card, Col, Row, Skeleton, Alert, Typography } from "antd";
import { Colors } from "../Constants/Colors.ts";
import EChart from "../components/chart/bChart.tsx";
import LineChart from "../components/chart/lineChart.tsx";
import { 
  CreditCard, 
  Users, 
  TrendingUp,
  Activity
} from "lucide-react";
import { FaHandsBound } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query"; 
import { useAppSelector } from "../store/store-hooks.ts";
import { fetchDashboard, fetchtKanda } from "../helpers/ApiConnectors.ts";

const { Title } = Typography;

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  loading = false 
}) => (
  <Col xs={24} sm={12} lg={6}>
    <Card
      className="stat-card"
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid #f0f0f0",
        background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
      }}
      bodyStyle={{ padding: "20px" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1 font-medium">{title}</p>
              {loading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <h3 
                  className="text-2xl font-bold mb-0"
                  style={{ color: Colors.primary }}
                >
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
              )}
            </div>
          </div>
          
          {trend && !loading && (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                  trend.isPositive 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                {trend.value}
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  </Col>
);

const Dashboard: React.FC = () => {
  const church = useAppSelector((state: any) => state?.sp);
  const user =  useAppSelector((state:any) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response: any = await fetchDashboard(`?church_id=${church?.id}`);
      return response;
    },
  });

    const { data: kanda } = useQuery({
      queryKey: ["kanda"],
      queryFn: async () => {
        const response: any = await fetchtKanda(`?church_id=${church.id}`);
        return response;
      },
    });


  // Define statistics configuration
  const statisticsConfig = [
    {
      title: "Total Waumini",
      value: data?.total_wahumini || 0,
      icon: <Users className="w-5 h-5" />,
      color: Colors.primary,
      trend: {
        value: "+3.48%",
        isPositive: true,
        label: "Since started"
      }
    },
    {
      title: "Card Numbers",
      value: data?.total_card_numbers || 0,
      icon: <CreditCard className="w-5 h-5" />,
      color: "#52c41a",
      trend: {
        value: "+8%",
        isPositive: true,
        label: "Since started"
      }
    },
    {
      title: "Total Jumuiya",
      value: data?.total_jumuiya || 0,
      icon: <FaHandsBound className="w-5 h-5" />,
      color: "#722ed1",
    trend: {
        value: "+8%",
        isPositive: true,
        label: "Since started"
      }
    },
    {
      title: "Total kanda",
      value: kanda?.length || 0,
      icon: <Activity className="w-5 h-5" />,
      color: "#fa8c16",
      trend: {
        value: "+8%",
        isPositive: true,
        label: "Since started"
      }
    }
  ];

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Dashboard"
          description="Unable to fetch dashboard data. Please try again later."
          type="error"
          showIcon
          style={{
            borderRadius: "12px",
            border: "1px solid #ff4d4f20"
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "0"
    }}>
      {/* Header */}
      <div className="mb-6">
        <Title 
          level={2} 
          style={{ 
            color: Colors.primary,
            marginBottom: "8px",
            fontWeight: "600"
          }}
        >
          Dashboard Overview
        </Title>
        <p className="text-gray-600 text-base">
          Welcome back! {user?.userInfo?.username}
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        {statisticsConfig.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            loading={isLoading}
          />
        ))}
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" style={{ color: Colors.primary }} />
                <span style={{ color: Colors.primary, fontWeight: "600" }}>
                  Analytics Overview
                </span>
              </div>
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <EChart />
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: Colors.primary }} />
                <span style={{ color: Colors.primary, fontWeight: "600" }}>
                  Trends & Growth
                </span>
              </div>
            }
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f0f0f0",
            }}
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <LineChart />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;