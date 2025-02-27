import { useState } from "react";
import { Card, Typography, Select, Row, Col } from "antd";
import dayjs from "dayjs";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentTypeRev } from "../../helpers/ApiConnectors";

const { Text, Title } = Typography;
const { Option } = Select;

const RevenueByPaymentType = () => {
  const [period, setPeriod] = useState("monthly");
  const church = useAppSelector((state: any) => state.sp);

  const { data:revenueData, isLoading} =  useQuery({
    queryKey: ["revenue", church.id, period],
    queryFn: async () => {
      const response:any = await fetchPaymentTypeRev(`${church.id}`, 
    { period },
      );
      return response;
    },
  });

  console.log(revenueData);
  


  // Handle period change
  const handlePeriodChange = (value:any) => {
    setPeriod(value);
  };

  return (
    <Card title="Mapato kwa aina ya makusanyo" className="mt-14" loading={isLoading}>
      <div className="mb-6">
        <Text strong>Select Period:</Text>
        <Select
          defaultValue="monthly"
          style={{ width: 120, marginLeft: 10 }}
          onChange={handlePeriodChange}
        >
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
      </div>

      {revenueData && (
        <>
          <Text strong>Period:</Text>
          <Text className="block">
            {dayjs(revenueData.start_date).format("YYYY-MM-DD")} to{" "}
            {dayjs(revenueData.end_date).format("YYYY-MM-DD")}
          </Text>

          <Row gutter={[16, 16]} className="mt-6">
            {revenueData?.revenue_summary.map((item:any) => (
              <Col key={item.payment_type__name} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="text-center"
                  style={{ borderRadius: 10 }}
                >
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {item.payment_type__name}
                  </Title>
                  <Text strong className="block text-lg text-blue-600">
                    Tsh {item.total_amount.toLocaleString()}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Card>
  );
};

export default RevenueByPaymentType;