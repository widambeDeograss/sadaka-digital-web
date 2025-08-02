import { useState } from "react";
import { Card, Typography, Row, Col, DatePicker } from "antd";
import dayjs from "dayjs";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPaymentTypeRev } from "../../helpers/ApiConnectors";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const RevenueByPaymentType = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('week'),
    dayjs().endOf('week')
  ]);
  const church = useAppSelector((state: any) => state.sp);
  const queryClient = useQueryClient();
  const [selectedPaymentType, setSelectedPaymentType] = useState<number | null>(
    null
  );

 const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["revenue", church.id, dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")],
    queryFn: async () => {
      const response: any = await fetchPaymentTypeRev(`${church.id}`, {
        start_date: dateRange[0].format("YYYY-MM-DD"),
        end_date: dateRange[1].format("YYYY-MM-DD"),
      });
      return response;
    },
  });

  const handlePaymentTypeClick = (paymentTypeId: number) => {
    console.log("Selected Payment Type ID:", paymentTypeId);

    setSelectedPaymentType(paymentTypeId);
    queryClient.invalidateQueries({ queryKey: ["revenue"] });
    console.log("Selected Payment Type:", selectedPaymentType);
    
  };

  console.log("Revenue Data:", revenueData);

 const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  return (
    <Card
      title="Mapato kwa aina ya makusanyo"
      className="mt-14"
      loading={isRevenueLoading}
        extra={
          <RangePicker
            defaultValue={[dateRange[0], dateRange[1]]}
            onChange={handleDateChange}
          />
        }
    >
      {/* <div className="mb-6">
       
      </div> */}

      {revenueData && (
        <>
          <Text strong>Period:</Text>
          <Text className="block">
            {dayjs(revenueData.start_date).format("YYYY-MM-DD")} to{" "}
            {dayjs(revenueData.end_date).format("YYYY-MM-DD")}
          </Text>

          <Row gutter={[16, 16]} className="mt-6">
            {revenueData?.revenue_summary.map((item: any) => (
              <Col key={item.payment_type__name} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="text-center"
                  style={{ borderRadius: 10 }}
                  onClick={() => handlePaymentTypeClick(item.payment_type__id)}
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

      {/* {selectedPaymentType && (
        <PaymentTypeTransfers
          paymentTypeId={selectedPaymentType}
          initialStartDate={revenueData.start_date}
          initialEndDate={revenueData.end_date}
          // onTransfersChange={() => {
          //   // This will trigger a refetch when transfers are updated
          //   queryClient.invalidateQueries({ queryKey: ["revenue"] });
          // }}

        revenueData={revenueData}
        />
      )} */}
    </Card>
  );
};

export default RevenueByPaymentType;
