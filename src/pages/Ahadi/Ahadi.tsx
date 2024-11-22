import React, { useEffect, useState } from "react";
import { Button, Card, Select, Table, Typography, Progress, Dropdown, Menu, message } from "antd";
import OngezaAhadi from "./OngezaAhadi";
import Tabletop from "../../components/tables/TableTop";
import { useAppSelector } from "../../store/store-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAhadi, fetchAhadi } from "../../helpers/ApiConnectors";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusCircleFilled
} from "@ant-design/icons";
import modal from "antd/es/modal";
import EditAhadi from "./EditAhadi";
import ViewModal from "./ViewAhadi";
import PaymentAhadi from "./PayAhadi";

const { Title } = Typography;
const { Option } = Select;

const Ahadi = () => {
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [updateAhadiModal, setupdateAhadiModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [payAhadiModal, setPayAhadiModal] = useState(false);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const { data: ahadiList, isLoading: loadingAhadi } = useQuery({
    queryKey: ["Ahadi"],
    queryFn: async () => {
      const response: any = await fetchAhadi(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const handleDelete = (AhadiId: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "cancel",
      onOk: () => {
        deleteAhadiMutation(AhadiId);
      },
    });
  };

  const { mutate: deleteAhadiMutation } = useMutation({
    mutationFn: async (AhadiId: any) => {
      await deleteAhadi(AhadiId);
    },
    onSuccess: () => {
      message.success("Ahadi deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["Ahadi"] });
    },
    onError: () => {
      message.error("Failed to delete Ahadi.");
    },
  });

  const handleView = (record: any) => {
    setSelectedData(record);
    setModalVisible(true);
  };

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = ahadiList.filter((item: any) => {
        return (
          item?.mhumini_details?.first_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.mhumini_details?.last_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.mchango_details?.mchango_name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.amount.toLowerCase().includes(lowercasedTerm) ||
          item?.paid_amount.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(ahadiList);
    }
  }, [searchTerm, ahadiList]);


  // Define table columns
  const columns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      key: "sNo",
      render: (_: any, __: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: "Name",
      dataIndex: "mhumini_details",
      key: "wahumini",
      render: (mhumini_details: any) => (
        <div>
          {mhumini_details?.first_name} {mhumini_details?.last_name}
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a?.mhumini_details?.first_name + a.mhumini_details?.last_name).localeCompare(
          b?.mhumini_details?.first_name + b.mhumini_details?.last_name
        ),
    },
    {
      title: "Mchango",
      dataIndex: "mchango_details",
      key: "mchango",
      render: (mchango_details: any) => (
        <div>{mchango_details ? mchango_details?.mchango_name : "Bila Mchango"}</div>
      ),
      sorter: (a: any, b: any) => {
        const nameA = a?.mchango_details?.mchango_name || "";
        const nameB = b?.mchango_details?.mchango_name || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Amount (Tzs)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => <div>Tsh {parseFloat(amount).toLocaleString()}</div>,
      sorter: (a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Paid Amount (Tzs)",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (paid_amount: string) => <div>Tsh {parseFloat(paid_amount).toLocaleString()}</div>,
      sorter: (a: any, b: any) => parseFloat(a.paid_amount) - parseFloat(b.paid_amount),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (_: any, record: any) => {
        const amount = parseFloat(record.amount);
        const paidAmount = parseFloat(record.paid_amount);
        const percent = amount > 0 ? Math.min((paidAmount / amount) * 100, 100) : 0;
        return (
          <Progress
            percent={percent}
            status={percent === 100 ? "success" : "active"}
            size="small"
            format={(percent:any) => `${percent.toFixed(2)}%`}
          />
        );
      },
      sorter: (a: any, b: any) => {
        const percentA = a.amount > 0 ? parseFloat(a.paid_amount) / parseFloat(a.amount) : 0;
        const percentB = b.amount > 0 ? parseFloat(b.paid_amount) / parseFloat(b.amount) : 0;
        return percentA - percentB;
      },
    },
    {
      title: "Tarehe ya ahadi",
      dataIndex: "date_pledged",
      key: "date_pledged",
      render: (date: string) => <div>{new Date(date).toLocaleDateString()}</div>,
      sorter: (a: any, b: any) =>
        new Date(a.date_pledged).getTime() - new Date(b.date_pledged).getTime(),
    },
    {
      title: "Tarehe ya mwisho wa ahadi",
      dataIndex: "due_date",
      key: "due_date",
      render: (date: string) => <div>{new Date(date).toLocaleDateString()}</div>,
      sorter: (a: any, b: any) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    },
 
    {
      title: "",
      render: (text: any, record: any) => (
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
                icon={<PlusCircleFilled />}
                onClick={() => {
                  setSelectedData(record);
                  setPayAhadiModal(true)
                }}
              >
                Lipia Ahadi
              </Menu.Item>
              <Menu.Item
                key="3"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedData(record);
                  setupdateAhadiModal(true);
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                key="4"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record?.id)}
              >
                Delete
              </Menu.Item>
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



  return (
    <div className="">
      {/* <Widgets /> */}
      <Card title={<Title level={4}>Ahadi</Title>} className="mb-10">
        <div className="text-xs">
          <h3 className="text-left">
            Tarehe: <span>{new Date().toDateString()}</span>
          </h3>
          <h3 className="text-left">
          </h3>
          <div className="flex justify-between flex-wrap mt-3">
            <div>
              <Button.Group className="mt-5">
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setOpenModal(true)}
                >
                  Ongeza Ahadi
                </Button>
                {/* Add more buttons if needed */}
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>
      <Card
        title={<Title level={5}>Orodha ya Ahadi</Title>}
        className="mt-5"
      >
           <div className="table-responsive">
          <Tabletop
            inputfilter={showFilter}
            onSearch={(term: string) => setSearchTerm(term)}
            togglefilter={(value: boolean) => setShowFilter(value)}
            searchTerm={searchTerm}
            showFilter={false}
            data={ahadiList}
          />
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loadingAhadi}
            bordered
            rowKey="id"
          />
        </div>
      </Card>
      <OngezaAhadi
        openModal={openModal}
        handleCancel={() => setOpenModal(false)}
      />
      <ViewModal visible={modalVisible} onClose={ ()=> setModalVisible(false)} data={selectedData}/>
      <EditAhadi openModal={updateAhadiModal} ahadiData={selectedData}  handleCancel={()=> setupdateAhadiModal(false) }/>
        <PaymentAhadi ahadiId={selectedData} handleCancel={()=>  setPayAhadiModal(false)} openModal={payAhadiModal}/>
    </div>
  );
};

export default Ahadi;
