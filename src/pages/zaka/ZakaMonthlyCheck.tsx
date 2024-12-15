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
const { RangePicker } = DatePicker;

// Define the data type for table rows
interface CardDetail {
  card_no: string;
  mhumini_name: string;
  jumuiya: string;
  kanda: string;
  monthly_presence?: Record<string, boolean>;
  present?: boolean; // Only used for single month
}

const CheckZakaPresenceModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const church = useAppSelector((state: any) => state.sp);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const dispatch = useAppDispatch();

  // Columns for the table
  const columns: ColumnsType<CardDetail> = [
    { title: "Card No", dataIndex: "card_no", key: "card_no" },
    { title: "Muhumini Name", dataIndex: "mhumini_name", key: "mhumini_name" },
    { title: "Jumuiya", dataIndex: "jumuiya", key: "jumuiya" },
    { title: "Kanda", dataIndex: "kanda", key: "kanda" },
    {
      title: "Presence",
      dataIndex: "monthly_presence",
      key: "monthly_presence",
      render: (monthlyPresence: Record<string, boolean> | undefined, record: CardDetail) => {
        if (monthlyPresence) {
          return Object.entries(monthlyPresence).map(([month, present]) => (
            <Badge
              key={month}
              count={`${month}: ${present ? "✔" : "✖"}`}
              style={{ backgroundColor: present ? "green" : "red", marginRight: 5 }}
            />
          ));
        }
        return record.present ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        );
      },
    },
  ];

  // Fetch data based on single month or range selection
  const { data: cardDetails, isLoading, refetch, error } = useQuery({
    queryKey: ["zakaPresence", date, range, church?.id],
    queryFn: async () => {
      if (!church?.id) throw new Error("Invalid parameters");

      if (range) {
        const startMonth = range[0].month() + 1;
        const startYear = range[0].year();
        const endMonth = range[1].month() + 1;
        const endYear = range[1].year();
        const response: any = await fetchZakBahashaInfo(
          `?month=${startMonth}&year=${startYear}&end_month=${endMonth}&end_year=${endYear}&church_id=${church.id}&query_type=range`
        );
        return response.card_details;
      } else if (date) {
        const month = date.month() + 1;
        const year = date.year();
        const response: any = await fetchZakBahashaInfo(
          `?month=${month}&year=${year}&church_id=${church.id}&query_type=check`
        );
        return response.card_details;
      }
    },
    enabled: (!!date || !!range) && !!church?.id, // Only run if date or range and church ID are available
  });

  // Send reminders function
  async function fetchZakaBahashaInfoWithCheck() {
    if (!date || !church) {
      throw new Error("Invalid parameters");
    }
    setLoadingMessage(true);
    const month = date.month() + 1; // Adjust month to be 1-based
    const year = date.year();
    const queryParams = `?month=${month}&year=${year}&church_id=${church?.id}&query_type=reminder`;

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
      throw error;
    } finally {
      setLoadingMessage(false);
    }
  }

  // Handle date selection
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setRange(null); // Clear range when a single date is selected
    setDate(date);
    if (date) refetch();
  };

  // Handle range selection
  const handleRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDate(null);
    setRange(dates);
    if (dates) refetch();
  };

  useEffect(() => {
    if (error) {
      message.error("Failed to fetch data.");
    }
  }, [error]);

  return (
    <Modal
      title="Bahasha za zaka"
      visible={visible}
      onCancel={onClose}
      footer={[<Button key="close" onClick={onClose}>Close</Button>]}
      width={900}
    >
      <div style={{ marginBottom: 16 }} className="flex items-center gap-4">
        <DatePicker
          onChange={handleDateChange}
          size="small"
          picker="month"
          placeholder="Chagua mwaka na mwezi"
          className="w-full"
        />
        <RangePicker
          onChange={(dates, dateStrings) => handleRangeChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
          size="small"
          picker="month"
          placeholder={['Mwezi wa mwanzo', 'Mwezi wa mwisho']}
          className="w-full"
        />
        {date && (
          <Button
            type="primary"
            onClick={() => fetchZakaBahashaInfoWithCheck()}
            loading={loadingMessage}
            className="bg-[#152033] text-white"
          >
            Tuma Kukumbusha matoleo ya zaka
          </Button>
        )}
      </div>

      {date && (
        <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
          Bahasha mwezi: {date.format("MMMM YYYY")}
        </Title>
      )}

      {range && (
        <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
          Bahasha kuanzia: {range[0].format("MMMM YYYY")} hadi {range[1].format("MMMM YYYY")}
        </Title>
      )}

      <Tabletop
        inputfilter={false}
        onSearch={(_term: string) => {}}
        togglefilter={(_value: boolean) => {}}
        showFilter={false}
        searchTerm={""}
        data={cardDetails}
      />
      <Table
        columns={columns}
        dataSource={cardDetails}
        rowKey="card_no"
        loading={isLoading}
      />
    </Modal>
  );
};

export default CheckZakaPresenceModal;
