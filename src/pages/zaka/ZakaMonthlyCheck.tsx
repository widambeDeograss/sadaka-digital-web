import React, { useEffect, useState } from "react";
import { Modal, DatePicker, Table, Button, message, Badge, Typography, Row, Col } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { fetchZakBahashaInfo } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import Tabletop from "../../components/tables/TableTop";
import { addAlert } from "../../store/slices/alert/alertSlice";

const { Title } = Typography;

// Define the data type for table rows
interface CardDetail {
  card_no: string;
  mhumini_name: string;
  jumuiya: string;
  kanda: string;
  present: boolean;
}

// Define the component
const CheckZakaPresenceModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const church = useAppSelector((state: any) => state.sp);
  const [LaodingMessage, setLaodingMessage] = useState(false);
  const dispatch = useAppDispatch();
  // Columns for the table
  const columns: ColumnsType<CardDetail> = [
    { title: "Card No", dataIndex: "card_no", key: "card_no" },
    { title: "Muhumini Name", dataIndex: "mhumini_name", key: "mhumini_name" },
    { title: "Jumuiya", dataIndex: "jumuiya", key: "jumuiya" },
    { title: "Kanda", dataIndex: "kanda", key: "kanda" },
    {
      title: "Present",
      dataIndex: "present",
      key: "present",
      render: (present: boolean) =>
        present ? (
          <Badge
            status="success"
            text={<CheckCircleOutlined style={{ color: "green" }} />}
          />
        ) : (
          <Badge
            status="error"
            text={<CloseCircleOutlined style={{ color: "red" }} />}
          />
        ),
    },
  ];

  // Fetch data based on date selection and church ID
  const { data: cardDetails, isLoading, refetch, error } = useQuery({
    queryKey: ["zakaPresence", date, church?.id],
    queryFn: async () => {
      if (!date || !church?.id) throw new Error("Invalid parameters");
      const month = date.month() + 1;
      const year = date.year();
      const response: any = await fetchZakBahashaInfo(`?month=${month}&year=${year}&church_id=${church.id}&query_type=check`);
      return response.card_details;
    },
    enabled: !!date && !!church?.id, // Only run if date and church ID are available
    // onError: () => message.error("Failed to fetch data."),
  });

  async function fetchZakaBahashaInfoWithCheck() {
    if (!date || !church) {
        throw new Error("Invalid parameters");
    }
     setLaodingMessage(true);
    const month = date.month() + 1;  // Adjust month to be 1-based
    const year = date.year();
    const queryParams = `?month=${month}&year=${year}&church_id=${church?.id}&query_type=reminder`;

    // Call the API endpoint
    try {
        const response = await fetchZakBahashaInfo(queryParams);
        dispatch(
            addAlert({
              title: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
              message: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
              type: "success",
            })
          );
        return response;
    } catch (error) {
        console.error("Error fetching Zaka Bahasha info:", error);
        throw error;  // Re-throw the error to handle it elsewhere if needed
    }finally{
      setLaodingMessage(false);
    }
}


  // Handle date selection
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setDate(date);
    if (date) refetch(); // Trigger data refetch on date change
  };

  useEffect(() => {
    if (error) {
        message.error("Failed to fetch data.")
    }
  }, [error])

  // Calculate totals for present and not present
  const totalPresent = cardDetails?.filter((card:any) => card.present).length;
  const totalNotPresent = cardDetails?.length - totalPresent;

  return (
    <Modal
      title="Bahasha za zaka"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      
      width={900}
    >
      <div style={{ marginBottom: 16 }} className="flex items-center gap-4">
        <DatePicker
          onChange={handleDateChange}
          size="large"
          picker="month"
          placeholder="chagua mwaka na mwexi"
          className="w-full"
        />
         {
            date && (
                <Button type="primary" onClick={() =>  fetchZakaBahashaInfoWithCheck()} loading={LaodingMessage}  className="bg-[#152033] text-white">
          Tuma Kukumbusha matoleo ya zaka
        </Button>
            )
         }
      </div>

      {/* Display selected month and year */}
      {date && (
        <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
          Bahasha mwezi: {date.format("MMMM YYYY")}
        </Title>
      )}

      {/* Display totals for present and not present */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Badge
            count={totalPresent}
            style={{ backgroundColor: "green" }}
            overflowCount={999}
          >
            <CheckCircleOutlined style={{ color: "green", fontSize: 23 }} />
          </Badge>
          <span style={{ marginLeft: 8 }}>Zilizorudishwa</span>
        </Col>
        <Col>
          <Badge
            count={totalNotPresent || 0}
            style={{ backgroundColor: "red" }}
            overflowCount={999}
          >
            <CloseCircleOutlined style={{ color: "red", fontSize: 23 }} />
          </Badge>
          <span style={{ marginLeft: 8 }}>Zisizorudisha</span>
        </Col>
      </Row>

      {/* Table to display card details */}
      <Tabletop
            inputfilter={false}
            onSearch={(term: string) => {}}
            togglefilter={(value: boolean) =>{}}
            showFilter={false}
            searchTerm={""}
            data={cardDetails}
          />
      <Table
        columns={columns}
        dataSource={cardDetails}
        rowKey="card_no"
        loading={isLoading}
        // pagination={true}
      />
    </Modal>
  );
};

export default CheckZakaPresenceModal;
