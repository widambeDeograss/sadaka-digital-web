import { useEffect, useState } from "react";
import { Button, Card, Dropdown, Menu, message, Table } from "antd";
import Tabletop from "../../components/tables/TableTop";
import OngezaZaka from "./OngezaZakaModal";
import { useAppSelector } from "../../store/store-hooks";
import {  useQuery } from "@tanstack/react-query";
import { fetchZaka } from "../../helpers/ApiConnectors";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import ViewModal from "./ViewZaka";
import EditZaka from "./EditZaka";
import Widgets from "./Stats";
import CheckZakaPresenceModal from "./ZakaMonthlyCheck";
import ReceiptDocument from "../../components/ZakaReceipt";
import { pdf } from "@react-pdf/renderer";
import { GlobalMethod } from "../../helpers/GlobalMethods";


const MenuReceiptGenerator: React.FC<{ record: any }> = ({ record }) => {
  const generatePDF = async () => {
    
    let url: string | null = null;
    const loadingMessage = message.loading('Generating receipt...', 0);
  
    try {
      // Generate PDF blob
      const blob = await pdf(<ReceiptDocument data={record} />).toBlob();
      url = URL.createObjectURL(blob);
  
      // Download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${record.id}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Open in new tab
      const pdfWindow = window.open(url, '_blank');
      if (pdfWindow) {
        pdfWindow.focus();
      } else {
        message.warning('Pop-up blocked. Please allow pop-ups to view the PDF.');
      }
  
      loadingMessage();
      message.success('Receipt generated successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      message.error('Failed to generate receipt');
    } finally {
      // Cleanup URL object after a short delay to ensure both operations complete
      if (url) {
        setTimeout(() => {
          //@ts-ignore
          URL.revokeObjectURL(url);
        }, 1000);
      }
      
      // Ensure loading message is cleared in case of error
      loadingMessage();
    }
  };

  return (
    <Menu.Item 
      key="generate-receipt" 
      icon={<PrinterOutlined />} 
      onClick={generatePDF}
    >
      Generate Receipt
    </Menu.Item>
  );
};

const Zaka = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [zakaData, setZakaData] = useState([]);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [updateZakaModal, setupdateZakaModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const [openBahashaModal, setOpenBahashaModal] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 100 });
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const tableId = "zaka";


  const {data: zakaPaginated, isLoading: loadingZaka } = useQuery({
    queryKey: ["zaka", pagination.current, pagination.pageSize, yearFilter],
    queryFn: async () => {
      let query = `?church_id=${church.id}&page=${pagination.current}&page_size=${pagination.pageSize}`;
      if (yearFilter) query += `&year=${yearFilter}`;
      const response: any = await fetchZaka(query);
      setZakaData(response.results);
      setFilteredData(response.results);
      return response;
    },
  });


  const handleView = (record: any) => {
    setSelectedData(record);
    setModalVisible(true);
  };

  // const { mutate: deleteZakaMutation } = useMutation({
  //   mutationFn: async (zakaId: any) => {
  //     await deleteZakaById(zakaId);
  //   },
  //   onSuccess: () => {
  //     message.success("Zaka deleted successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["zaka"] });
  //   },
  //   onError: () => {
  //     message.error("Failed to delete Zaka.");
  //   },
  // });



  // const handleDelete = (zakaId: any) => {
  //   modal.confirm({
  //     title: "Confirm Deletion",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Are you sure you want to delete this record?",
  //     okText: "OK",
  //     okType: "danger",
  //     cancelText: "cancel",
  //     onOk: () => {
  //       deleteZakaMutation(zakaId);
  //     },
  //   });
  // };


  const columns = [
    {
      title: "S/No",
      render: (_text: any, _record: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: "Name",
      render: (_text: any, record: any) => (
        <div>
          {record?.bahasha_details?.mhumini_details?.first_name}{" "}
          {record?.bahasha_details?.mhumini_details?.last_name}
        </div>
      ),
    },
    {
      title: "Jumuiya",
      render: (_text: any, record: any) => (
        <div>
          {record?.bahasha_details?.mhumini_details?.jumuiya_details?.name}{" "}
        </div>
      ),
    },
    {
      title: "Bahasha",
      render: (_text: any, record: any) => (
        <div>{record?.bahasha_details?.card_no}</div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "zaka_amount",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Zaka date",
      dataIndex: "date",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Transaction date",
      dataIndex: "date_received",
      render: (text: any) => <div>{new Date(text).toDateString()}</div>,
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
              {GlobalMethod.hasAnyPermission(
                             ["MANAGE_ZAKA"],
                             GlobalMethod.getUserPermissionName(userPermissions)
                           ) && (
                             <Menu.Item
                               key="2"
                               icon={<EditOutlined />}
                               onClick={() => {
                                setSelectedData(record);
                                setupdateZakaModal(true);
                               }}
                             >
                               Edit
                             </Menu.Item>
                           )}
              <MenuReceiptGenerator record={record} />
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

  const handleTableChange = (pagination: any) => {
   
    setPagination((prev) => ({ ...prev, current: pagination }));
  };

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = zakaData.filter((item: any) => {
        return (
          item?.bahasha_details?.mhumini_details?.first_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_details?.mhumini_details?.last_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_details?.card_no.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(zakaData);
    }
  }, [searchTerm, zakaData]);

  return (
    <div className="">
      <Widgets/>
      <Card title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}>
        <div className="text-xs">
          <h3 className="text-left">
            Tarehe: <span>{new Date().toDateString()}</span>
          </h3>
          <div className="flex justify-between flex-wrap mt-3">
            <div>
              <Button.Group className="mt-5">
              {GlobalMethod.hasAnyPermission(
                  ["ADD_ZAKA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setOpenModal(true)}
                >
                  Ongeza Zaka
                </Button>
                    )}
                      {GlobalMethod.hasAnyPermission(
                  ["MANAGE_ZAKA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
              <>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setOpenBahashaModal(true)}
                >
                  Fuatilia Bahasha
                </Button>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => navigate("/dashboard/zaka-monthly-report")}
                >
                  Fuatilia Zaka
                </Button>
              </>
                 )}
               
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
        className="mt-5"
      >
        <div className="table-responsive">
          <Tabletop
            inputfilter={showFilter}
            onSearch={(term: string) => setSearchTerm(term)}
            togglefilter={(value: boolean) => setShowFilter(value)}
            searchTerm={searchTerm}
            data={tableId}
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
              id={tableId}
            columns={columns}
            dataSource={filteredData}
            loading={loadingZaka}
            bordered
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: zakaPaginated?.count,
              onChange: handleTableChange,
            }}
          />
        </div>
      </Card>

      <OngezaZaka
        openModal={openModal}
        handleCancel={() => setOpenModal(false)}
      />
      <EditZaka
        openModal={updateZakaModal}
        handleCancel={() => setupdateZakaModal(false)}
        zakaDetails={selectedData}
      />
      <ViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedData}
      />
       <CheckZakaPresenceModal
        visible={openBahashaModal}
        onClose={() => setOpenBahashaModal(false)}
      />
      {/* <ZakaReceiptModal
      data={selectedData}
      isOpen={viewReceipt}
      onClose={() => setviewReceipt(false)}

      /> */}
    </div>
  );
};

export default Zaka;
