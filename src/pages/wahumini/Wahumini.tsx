import { Button, Card, Col, Dropdown, Menu, message, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Tabletop from "../../components/tables/TableTop";
import { deleteMuhumini, fetchWahumini } from "../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { useAppSelector } from "../../store/store-hooks";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import modal from "antd/es/modal";
import { useEffect, useState } from "react";

const Wahumini = () => {
  const navigate = useNavigate();
  const church = useAppSelector((state: any) => state.sp);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const tableId = "wahumini";
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const queryClient = useQueryClient();
  const {
    data: wahumini,
    isLoading,
  } = useQuery({
    queryKey: ["wahumini"],
    queryFn: async () => {
      const response: any = await fetchWahumini(`?church_id=${church.id}`);
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

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (ID: any) => {
      await deleteMuhumini(ID);
    },
    onSuccess: () => {
      message.success("Muhumini deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["Sadaka"] });
    },
    onError: () => {
      message.error("Failed to delete muhumini.");
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
      title: "First Name",
      dataIndex: "first_name",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Jumuiya",
      dataIndex: ["jumuiya_details", "name"],
      key: "category",
    //   sorter: (a: Expense, b: Expense) =>
    //     a?.category_details?.budget?.localeCompare(b?.category_details?.category_name),
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Location",
      dataIndex: "address",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: <strong>Active</strong>,
      dataIndex: "has_loin_account",
      render: (text: any, _record: any) => (
        <>
          {text === true && (
            <span className="bg-red-300 rounded-lg p-1 text-white">
              In active
            </span>
          )}
          {text === false && (
            <span className="bg-green-300  rounded-lg p-1 text-white">
              Active
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
                ["VIEW_WAHUMINI"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                icon={<EyeOutlined />}
                  onClick={() =>
                    navigate(`/dashboard/muhumini/${record.id}`, {state:{record:record}})
                  }
                >
                  View
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_WAHUMINI", "EDIT_WAHUMINI"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                icon={<EditOutlined />}
                  onClick={() =>
                    navigate("/dashboard/wahumini/update", { state: { record } })
                  }
                >
                  Edit
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["DELETE_WAHUMINI", "MANAGE_WAHUMINI"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() => handleDelete(record?.id)}
                  data-bs-toggle="modal"
                  icon={<DeleteOutlined />}
                  data-bs-target="#resetPassword"
                  danger
                >
                  Delete Muhumini
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
      const filtered = wahumini.filter((item: any) => {
        return (
          item?.jumuiya_details?.name?.toLowerCase()
            .includes(lowercasedTerm) ||
          item?.last_name?.toLowerCase()
            .includes(lowercasedTerm) ||
          item?.first_name.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(wahumini);
    }
  }, [searchTerm, wahumini]);
  return (
    <div>
      <Card
        title={<h3 className="font-bold text-sm text-left">Wahumini</h3>}
        className=""
      >
        <div>
          <div className="flex justify-between mt-3">
            <div>
              <h3 className="text-left font-bold text-xs">
                Jumla Wahumini: <span>{wahumini?.length}</span>
              </h3>
            </div>
            <div>
              <Button.Group>
              {GlobalMethod.hasAnyPermission(
                ["ADD_WAHUMINI", "MANAGE_WAHUMINI"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => navigate("/dashboard/wahumini/ongeza")}
                >
                  Ongeza Muhumini
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
            title="Wahumini"
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
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Wahumini;
