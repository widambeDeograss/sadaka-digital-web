import { Button, Card, Col, Dropdown, Menu, message, Row, Table } from "antd";
import Tabletop from "../../components/tables/TableTop";
import { deleteBahasha, fetchBahasha } from "../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { useAppSelector } from "../../store/store-hooks";
import { useState } from "react";
import CreateCardNumberModal from "./AddCardModal";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import modal from "antd/es/modal";
import EditCardModal from "./EditBahasha";
import ViewModal from "./ViewBahasha";

const CardNumberList = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 100 });
  const [filteredData, setFilteredData] = useState([]);
  const queryClient = useQueryClient();
  const [selectedCard, setselectedCard] = useState<any>(null);
  const tableId = "data-table";
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const [viewBahasha, setviewBahasha] = useState(false);

  const {
    data: bahasha,
    isLoading,
  } = useQuery({
    queryKey: ["bahasha", searchTerm, pagination.current, pagination.pageSize],
    queryFn: async () => {
      let query = `?church_id=${church.id}&page=${pagination.current}&page_size=${pagination.pageSize}&search=${searchTerm}`;
      const response: any = await fetchBahasha(query);
      setFilteredData(response.results);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const handleDelete = (id: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "cancel",
      onOk: () => {
        deleteMutation(id);
      },
    });
  };

  const handleEdit = (record: any) => {
    setselectedCard(record);
    setshowEditModal(true);
  };

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (ID: any) => {
      await deleteBahasha(ID);
    },
    onSuccess: () => {
      message.success("Muumini deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bahasha"] });
    },
    onError: () => {
      message.error("Failed to delete muumini.");
    },
  });

  const columns = [
    {
      title: "s/No",

      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Card No",

      dataIndex: "card_no",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Name",

      dataIndex: "mhumini",
      render: (_text: any, record: any) => (
        <div>
          {record?.mhumini_details?.first_name}{" "}
          {record?.mhumini_details?.last_name}
        </div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Phone",

      dataIndex: "mhumini",
      render: (_text: any, record: any) => (
        <div>{record?.mhumini_details?.phone_number}</div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Jumuiya",

      dataIndex: "mhumini",
      render: (_text: any, record: any) => (
        <div>{record?.mhumini_details?.jumuiya_details?.name}</div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "bahasha_type",
      dataIndex: "bahasha_type",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },

    {
      title: "created_at",
      dataIndex: "created_at",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: <strong>Card status</strong>,
      dataIndex: "card_status",
      render: (text: any, _record: any) => (
        <>
          {text === true && (
            <span className="bg-green-300 rounded-lg p-1 text-white">
              Active
            </span>
          )}
          {text === false && (
            <span className="bg-red-300 rounded-lg p-1 text-white">
              Disabled
            </span>
          )}
        </>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              {GlobalMethod.hasAnyPermission(
                ["EDIT_WAHUMINI"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  icon={<EyeOutlined />}
                  onClick={() =>   {
                    setselectedCard(record)
                    setviewBahasha(true);
                  }}
                >
                  View
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_BAHAASHA"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  icon={<EditOutlined />}
                  onClick={() =>
                   handleEdit(record)
                  }
                >
                  Edit
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_BAHAASHA"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() => handleDelete(record?.id)}
                  data-bs-toggle="modal"
                  icon={<DeleteOutlined />}
                  data-bs-target="#resetPassword"
                  danger
                >
                  Delete Bahasha
                </Menu.Item>
              )}
            </Menu>
          }
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


  
  return (
    <div>
      <Card
        title={
          <h3 className="font-bold text-sm text-left">Namba za bahasha</h3>
        }
        className=""
      >
        <div>
          <div className="flex justify-between mt-3">
            <div>
              <h3 className="text-left font-bold text-xs">
                Jumla ya Bahasha: <span>{bahasha?.count}</span>
              </h3>
            </div>
            <div>
              <Button.Group>
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_MAVUNO"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => setIsVisible(true)}
                >
                  Ongeza Bahasha
                </Button>
                   )}
                {/* </Radio.Button> */}
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 0]} className="mt-5">
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            //   className="criclebox tablespace mb-24"
            title="Bahasha"
          >
            <div className="table-responsive">
              <Tabletop
             showFilter={false}
             inputfilter={false}
            onSearch={(term: string) => setSearchTerm(term)}
            togglefilter={() =>  {}}
            searchTerm={searchTerm}
            data={tableId}
              />

              <Table
              id={tableId}
                columns={columns}
                dataSource={filteredData}
                loading={isLoading}
                bordered
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: bahasha?.count,
                  onChange: handleTableChange,
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <CreateCardNumberModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />
      <EditCardModal
        visible={showEditModal}
        onClose={() => setshowEditModal(false)}
        bahashaData={selectedCard}
      />
      <ViewModal
      data={selectedCard}
      onClose={() => setviewBahasha(false)}
      visible={viewBahasha}
      />
    </div>
  );
};

export default CardNumberList;