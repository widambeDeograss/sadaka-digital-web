import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Row,
  Table,
  Timeline,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import OngezaSadaka from "./OngezaSadaka.tsx";
import Widgets from "./Stats.tsx";
import Tabletop from "../../components/tables/TableTop.tsx";
import { useAppSelector } from "../../store/store-hooks.ts";
import { useQuery } from "@tanstack/react-query";
import { fetchSadaka } from "../../helpers/ApiConnectors";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ViewModal from "./ViewSadaka.tsx";
import UpdateSadaka from "./UpdateSadaka.tsx";

const { Paragraph, Text } = Typography;
const Sadaka = () => {
  const [reverse, setReverse] = useState(false);
  const [openMOdal, setopenMOdal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [SadakaData, setSadakaData] = useState([]);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [updateSadakaModal, setupdateSadakaModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  // const userPermissions = useAppSelector(
  //   (state: any) => state.user.userInfo.role.permissions
  // );

  const handleView = (record: any) => {
    setSelectedData(record);
    setModalVisible(true);
  };

  const {
    data: sadakaToday,
    isLoading,
  } = useQuery({
    queryKey: ["sadakaToday"],
    queryFn: async () => {
      const response: any = await fetchSadaka(
        `?church_id=${church.id}&filter=today`
      );
      console.log(response);
      return response?.reverse();
    },
    enabled: true,
    // {
    //   enabled: false,
    // }
  });

  const {  isLoading: loadingSadaka } = useQuery({
    queryKey: ["sadaka", yearFilter],
    queryFn: async () => {
      let query = `?church_id=${church.id}`;
      if (yearFilter) query += `&year=${yearFilter}`;
      const response: any = await fetchSadaka(query);
      setSadakaData(response);
      setFilteredData(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  // const handleDelete = (SadakaId: any) => {
  //   modal.confirm({
  //     title: "Confirm Deletion",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Are you sure you want to delete this record?",
  //     okText: "OK",
  //     okType: "danger",
  //     cancelText: "cancel",
  //     onOk: () => {
  //       deleteSadakaMutation(SadakaId);
  //     },
  //   });
  // };

  // const { mutate: deleteSadakaMutation } = useMutation({
  //   mutationFn: async (SadakaId: any) => {
  //     await deleteSadakaById(SadakaId);
  //   },
  //   onSuccess: () => {
  //     message.success("Sadaka deleted successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["Sadaka"] });
  //   },
  //   onError: () => {
  //     message.error("Failed to delete Sadaka.");
  //   },
  // });

  const columns = [
    {
      title: "s/No",

      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Name",

      dataIndex: "name",
      render: (_text: any, record: any) => (
        <div>
          {record?.bahasha_details?.mhumini_details?.first_name}{" "}
          {record?.bahasha_details?.mhumini_details?.last_name}
        </div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Jumuiya",

      dataIndex: "",
      render: (_text: any, record: any) => (
        <div>
          {record?.bahasha_details?.mhumini_details?.jumuiya_details?.name}
        </div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Bahasha",

      dataIndex: "",
      render: (_text: any, record: any) => (
        <div>{record?.bahasha_details?.card_no}</div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Amount",
      dataIndex: "sadaka_amount",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Payment type",
      dataIndex: "sadaka_amount",
      render: (_text: any, record: any) => (
        <div>{record?.payment_type_details?.name}</div>
      ),
    },

    {
      title: "date",
      dataIndex: "date",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "",
      render: (_text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="1"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
              >
                View
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedData(record);
                  setupdateSadakaModal(true);
                }}
              >
                Edit
              </Menu.Item>
              {/* <Menu.Item
                key="3"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record?.id)}
              >
                Delete
              </Menu.Item> */}
            </Menu>
          }
          trigger={["click"]}
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Actions <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = SadakaData.filter((item: any) => {
        return (
          item?.bahasha_details?.mhumini_details?.first_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_details?.mhumini_details?.last_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item.bahasha_details?.mhumini_details?.jumuiya_details?.name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_details?.card_no.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(SadakaData);
    }
  }, [searchTerm, SadakaData]);

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
              <Button.Group className="mt-5">
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => setopenMOdal(true)}
                >
                  Ongeza Sadaka
                </Button>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => navigate("/dashboard/sadaka-monthly-report")}
                >
                  Matoleo mwezi huu
                </Button>
              </Button.Group>
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
              {/* <Tabletop
                inputfilter={false}
                onSearch={(term: string) => setSearchTerm(term)}
                togglefilter={(value: boolean) => setShowFilter(value)}
                searchTerm={searchTerm}
              /> */}
              <Table
                columns={columns}
                dataSource={sadakaToday}
                loading={isLoading}
                bordered
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
                {sadakaToday?.slice(0, 4).map((t: any, index: number) => (
                  <Timeline.Item color="green" key={index}>
                    <h3 className=" text-xs text-center ">
                      {t?.bahasha_details?.mhumini_details?.first_name}-TZS
                      {t?.sadaka_amount}{" "}
                    </h3>
                    <Text>Card No: {t?.bahasha_details?.card_no}</Text>
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
        <div className="table-responsive">
          <Tabletop
            inputfilter={showFilter}
            onSearch={(term: string) => setSearchTerm(term)}
            togglefilter={(value: boolean) => setShowFilter(value)}
            searchTerm={searchTerm}
            data={filteredData}
          />
          {showFilter && (
            <div className="bg-gray-100 p-4 mt-4 rounded-lg">
              <h4 className="font-bold mb-2">Filter Options</h4>
              <label htmlFor="yearFilter" className="block text-sm mb-2">
                Filter by Year:
              </label>
              <input
                type="text"
                id="yearFilter"
                value={yearFilter || ""}
                onChange={(e) => setYearFilter(e.target.value)}
                className="p-2 border rounded-lg w-full"
                placeholder="Enter year (e.g., 2023)"
              />
              <Button
                type="primary"
                className="mt-3 bg-[#152033] text-white"
                onClick={() => {
                  setShowFilter(false);
                }}
              >
                Apply Filter
              </Button>
            </div>
          )}
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loadingSadaka}
            bordered
          />
        </div>
      </Card>
      <OngezaSadaka
        openModal={openMOdal}
        handleCancel={() => setopenMOdal(!openMOdal)}
      />
      <UpdateSadaka
        openModal={updateSadakaModal}
        handleCancel={() => setupdateSadakaModal(false)}
        sadakaData={selectedData}
      />
      <ViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedData}
      />
    </div>
  );
};

export default Sadaka;
