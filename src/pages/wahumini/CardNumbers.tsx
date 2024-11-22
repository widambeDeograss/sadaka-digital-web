import { Button, Card, Col, Dropdown, Menu, message, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Tabletop from "../../components/tables/TableTop";
import { deleteBahasha, fetchBahasha } from "../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { useAppSelector } from "../../store/store-hooks";
import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const queryClient = useQueryClient();
  const [selectedCard, setselectedCard] = useState<any>(null);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const [viewBahasha, setviewBahasha] = useState(false);

  const {
    data: bahasha,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bahasha"],
    queryFn: async () => {
      const response: any = await fetchBahasha(`?church_id=${church.id}`);
      console.log(response);
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
      message.success("Muhumini deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["bahasha"] });
    },
    onError: () => {
      message.error("Failed to delete muhumini.");
    },
  });

  const columns = [
    {
      title: "s/No",

      dataIndex: "sNo",
      render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Card No",

      dataIndex: "card_no",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Name",

      dataIndex: "mhumini",
      render: (text: any, record: any) => (
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
      render: (text: any, record: any) => (
        <div>{record?.mhumini_details?.phone_number}</div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Jumuiya",

      dataIndex: "mhumini",
      render: (text: any, record: any) => (
        <div>{record?.mhumini_details?.jumuiya_details?.name}</div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: "bahasha_type",
      dataIndex: "bahasha_type",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },

    {
      title: "created_at",
      dataIndex: "created_at",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: <strong>Card status</strong>,
      dataIndex: "card_status",
      render: (text: any, record: any) => (
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
      render: (text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              {GlobalMethod.hasAnyPermission(
                ["VIEW_WAHUMINI", "EDIT_WAHUMINI"],
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
                ["VIEW_WAHUMINI", "EDIT_WAHUMINI"],
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
                ["DELETE_WAHUMINI", "VIEW_WAHUMINI"],
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


  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = bahasha.filter((item: any) => {
        return (
          item?.mhumini_details?.jumuiya_details?.name
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.card_no
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.bahasha_type
            .toLowerCase()
            .includes(lowercasedTerm) ||
          item?.mhumini_details?.first_name?.toLowerCase().includes(lowercasedTerm)||
          item?.mhumini_details?.last_name?.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(bahasha);
    }
  }, [searchTerm, bahasha]);

  
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
                Jumla ya Bahasha: <span>{bahasha?.length}</span>
              </h3>
            </div>
            <div>
              <Button.Group>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => setIsVisible(true)}
                >
                  Ongeza Bahasha
                </Button>
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
            data={filteredData}
              />

              <Table
                columns={columns}
                dataSource={filteredData}
                loading={isLoading}
                bordered
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
