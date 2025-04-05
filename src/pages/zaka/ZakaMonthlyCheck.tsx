import React, { useEffect, useState } from "react";
import {
  Modal,
  DatePicker,
  Table,
  Button,
  message,
  Badge,
  Typography,
  Row,
  Col,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import {
  fetchZakBahashaInfo,
  resolveBahasha,
  sendCustomSms,
} from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import { addAlert } from "../../store/slices/alert/alertSlice";
import Tabletop from "../../components/table-exports/zaka-monthly-check";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

// Define the data type for table rows
interface CardDetail {
  card_no: string;
  mhumini_name: string;
  jumuiya: string;
  kanda: string;
  monthly_presence?: Record<string, boolean>;
  present?: boolean;
}

const CheckZakaPresenceModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const church = useAppSelector((state: any) => state.sp);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [kumbushaLoading, setkumbushaLoading] = useState(false);
  const [loadingBahasha, setloadingBahasha] = useState<string>();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const tableId = "data-table-zaka";

  const sendPushMessage = async (record: CardDetail) => {
    if (!record?.card_no || !church?.id) {
      throw new Error("Invalid parameters: Missing card_no or church ID");
    }

    try {
      setloadingBahasha(record.card_no);
      setkumbushaLoading(true);

      const response: any = await resolveBahasha(
        `${record.card_no}/?church_id=${church.id}`
      );
      console.log("API Response:", response);

      let message = "";

      if (range) {
        const months = Object.entries(record.monthly_presence || {})
          .filter(([_, present]) => !present)
          .map(([month]) => {
            const monthDate = range[0].clone().month(parseInt(month) - 1);
            return monthDate.format("MMMM YYYY");
          });
          // kwa bahasha namba ${record.card_no}
        message = `Kristu,\nMpendwa ${
          response?.mhumini_details?.first_name
        } ${response?.mhumini_details?.last_name},Unakumbushwa kurejesha bahasha zako za zaka ya miezi ya ${months.join(
          ", "
        )}.\nMungu akubariki.\nMawasiliano: 0677050574\nPAROKIA YA BMC MAKABE.
        `;
      } else if (date) {
        if (record.present) {
          dispatch(
            addAlert({
              title: "Muumini ameshatoa zaka kwa mwezi huu",
              message: "Muumini ameshatoa zaka kwa mwezi huu",
              type: "info",
            })
          );
          return;
        }
        message = `Kristu,\nMpendwa ${
          response?.mhumini_details?.first_name
        } ${response?.mhumini_details?.last_name}, Unakumbushwa kurejesha bahasha yako ya zaka ya ${date.format(
          "MMMM YYYY"
        )}.\nMungu akubariki.\nMawasiliano: 0677050574\nPAROKIA YA BMC MAKABE.`;
      }

      const postMessage: any = await sendCustomSms({
        phone: response?.mhumini_details?.phone_number,
        message: message,
      });

      if (postMessage?.message === "Message sent successfully") {
        dispatch(
          addAlert({
            title: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
            message: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
            type: "success",
          })
        );
      }
    } catch (error) {
      console.error("Error fetching Zaka Bahasha info:", error);
      dispatch(
        addAlert({
          title: "Ujumbe wa ukumbusho haujatuma, jaribu tena baaadaye",
          message: "Ujumbe wa ukumbusho haujatuma, jaribu tena baaadaye",
          type: "error",
        })
      );
    } finally {
      setkumbushaLoading(false);
      setloadingBahasha(undefined);
    }
  };

  // Function to show confirmation modal before sending individual SMS
  const showSendConfirmation = (record: CardDetail) => {
    if (!record?.card_no || !church?.id) {
      dispatch(
        addAlert({
          title: "Error",
          message: "Invalid parameters: Missing card_no or church ID",
          type: "error",
        })
      );
      return;
    }

    if (date && record.present) {
      dispatch(
        addAlert({
          title: "Muumini ameshatoa zaka kwa mwezi huu",
          message: "Muumini ameshatoa zaka kwa mwezi huu",
          type: "info",
        })
      );
      return;
    }

    const recipientName = record.mhumini_name;
    const period = range
      ? `miezi kuanzia ${range[0].format("MMMM YYYY")} hadi ${range[1].format(
          "MMMM YYYY"
        )}`
      : `mwezi wa ${date?.format("MMMM YYYY")}`;

    confirm({
      title: "Tuma Ujumbe wa Ukumbusho",
      content: `Unataka kutuma ujumbe wa ukumbusho kwa ${recipientName} (${record.card_no}) kwa ${period}?`,
      okText: "Tuma",
      okType: "default",
      cancelText: "Ghairi",
      onOk() {
        return sendPushMessage(record);
      },
    });
  };

  // Columns for the table
  const columns: ColumnsType<CardDetail> = [
    { title: "Card No", dataIndex: "card_no", key: "card_no" },
    { title: "Muumini Name", dataIndex: "mhumini_name", key: "mhumini_name" },
    { title: "Jumuiya", dataIndex: "jumuiya", key: "jumuiya" },
    { title: "Kanda", dataIndex: "kanda", key: "kanda" },
    {
      title: "Matoleo ya Zaka",
      dataIndex: "monthly_presence",
      key: "monthly_presence",
      render: (
        monthlyPresence: Record<string, boolean> | undefined,
        record: CardDetail
      ) => {
        if (monthlyPresence) {
          return Object.entries(monthlyPresence).map(([month, present]) => (
            <Badge
              key={month}
              count={`${month}: ${present ? "✔" : "✖"}`}
              style={{
                backgroundColor: present ? "green" : "red",
                marginRight: 5,
              }}
            />
          ));
        }
        return record.present ? (
          <span>
            <CheckCircleOutlined style={{ color: "green" }} /> Ametoa
          </span>
        ) : (
          <span>
            <CloseCircleOutlined style={{ color: "red" }} /> Hajatoa
          </span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (_text, record) => (
        <Button
          type="primary"
          className="bg-[#152033] text-white"
          loading={record.card_no === loadingBahasha && kumbushaLoading}
          onClick={() => showSendConfirmation(record)}
        >
          Tuma sms
        </Button>
      ),
    },
  ];

  // Fetch data based on single month or range selection
  const {
    data: cardDetails,
    isLoading,
    refetch,
    error,
  } = useQuery({
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
        setFilteredData(response?.card_details);
        return response.card_details;
      } else if (date) {
        const month = date.month() + 1;
        const year = date.year();
        const response: any = await fetchZakBahashaInfo(
          `?month=${month}&year=${year}&church_id=${church.id}&query_type=check`
        );
        setFilteredData(response?.card_details);
        return response.card_details;
      }
    },
    enabled: (!!date || !!range) && !!church?.id,
  });

  // Send reminders function
  async function fetchZakaBahashaInfoWithCheck() {
    // if ((!range || date) || !church) {
    //   throw new Error("Invalid parameters");
    // }
    setLoadingMessage(true);

    try {
      if (range) {
        const startMonth = range[0]?.month() + 1;
        const startYear = range[0].year();
        const endMonth = range[1].month() + 1;
        const endYear = range[1].year();
        const queryParamsRange = `?month=${startMonth}&year=${startYear}&end_month=${endMonth}&end_year=${endYear}&church_id=${church.id}&query_type=rangereminder`;
        const response = await fetchZakBahashaInfo(queryParamsRange);
        dispatch(
          addAlert({
            title: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
            message: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
            type: "success",
          })
        );
        return response;
      } else {
        //@ts-ignore
        const month = date.month() + 1;
        //@ts-ignore
        const year = date.year();
        const queryParams = `?month=${month}&year=${year}&church_id=${church?.id}&query_type=reminder`;
        const response = await fetchZakBahashaInfo(queryParams);
        dispatch(
          addAlert({
            title: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
            message: "Ujumbe wa ukumbusho umetumwa kwa usahihi",
            type: "success",
          })
        );
        return response;
      }
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
  const handleRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    setDate(null);
    //@ts-ignore
    setRange(dates);
    if (dates) refetch();
  };

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = cardDetails.filter((item: any) => {
        return (
          item?.card_no?.toLowerCase().includes(lowercasedTerm) ||
          item?.mhumini_name?.toLowerCase().includes(lowercasedTerm) ||
          item?.kanda?.toLowerCase().includes(lowercasedTerm) ||
          item?.jumuiya?.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(cardDetails);
    }
  }, [searchTerm, cardDetails]);

  useEffect(() => {
    if (error) {
      message.error("Failed to fetch data.");
    }
  }, [error]);

  const totalPresent = cardDetails?.filter((card: any) => card.present).length;
  const totalNotPresent = cardDetails?.length - totalPresent;

  // Function to show confirmation modal before sending batch SMS
  const showBatchSendConfirmation = () => {
    if ((!date && !range) || !church) {
      dispatch(
        addAlert({
          title: "Error",
          message: "Invalid parameters: Please select a month or range",
          type: "error",
        })
      );
      return;
    }

    const notPresentCount =
      cardDetails?.filter((card: any) => !card.present).length || 0;

    let confirmationMessage = "";
    if (date) {
      confirmationMessage = `Unataka kutuma ujumbe wa ukumbusho kwa waumini ${notPresentCount} ambao hawajarudisha zaka ya mwezi wa ${date.format(
        "MMMM YYYY"
      )}?`;
    } else if (range) {
      confirmationMessage = `Unataka kutuma ujumbe wa ukumbusho kwa waumini ${notPresentCount} ambao hawajarudisha zaka ya miezi kuanzia ${range[0].format(
        "MMMM YYYY"
      )} hadi ${range[1].format("MMMM YYYY")}?`;
    }

    confirm({
      title: "Tuma Ukumbusho kwa Wote",
      content: confirmationMessage,
      okText: "Tuma",
      okType: "default",
      cancelText: "Ghairi",
      onOk() {
        return fetchZakaBahashaInfoWithCheck();
      },
    });
  };

  const disabledDate = (current:any) => {
    // Disable dates that are after the current month
    return current && current > dayjs().endOf('month');
  };
  

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
          size="small"
          picker="month"
          placeholder="Chagua mwaka na mwezi"
          className="w-full"
          disabledDate={disabledDate}
        />
        <RangePicker
          onChange={(dates, _dateStrings) =>
            handleRangeChange(
              dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
            )
          }
          size="small"
          picker="month"
          placeholder={["Mwezi wa mwanzo", "Mwezi wa mwisho"]}
          className="w-full"
          disabledDate={disabledDate}
        />
        {date && (
          <Button
            type="primary"
            onClick={showBatchSendConfirmation}
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

      {date && (
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
      )}

      {range && (
        <div className="flex flex-col justify-center items-center">
          <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
            Bahasha kuanzia: {range[0].format("MMMM YYYY")} hadi{" "}
            {range[1].format("MMMM YYYY")}
          </Title>

          <Button
            type="primary"
            onClick={showBatchSendConfirmation}
            loading={loadingMessage}
            className="bg-[#152033] text-white  "
          >
            Tuma Kukumbusha matoleo ya zaka
          </Button>
        </div>
      )}

      <Tabletop
        inputfilter={false}
        onChangeSearch={(term: string) => setSearchTerm(term)}
        togglefilter={(_value: boolean) => {}}
       docTitle="Bahasha za zaka"
       header={columns.map((col) => col.title)}
       data={filteredData}
       searchQuery={searchTerm}   
      />

      <Table
        id={tableId}
        columns={columns}
        dataSource={filteredData}
        rowKey="card_no"
        loading={isLoading}
      />

    </Modal>
  );
};

export default CheckZakaPresenceModal;
