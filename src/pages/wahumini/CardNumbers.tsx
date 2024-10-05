import { Button, Card, Col, Dropdown, Menu, Row, Table } from "antd";
import Column from "antd/es/table/Column";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";
import Tabletop from "../../components/tables/TableTop";
import { fetchBahasha, fetchWahumini } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { useAppSelector } from "../../store/store-hooks";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreateCardNumberModal from "./AddCardModal";

const CardNumberList = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

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
          {record?.mhumini?.first_name} {record?.mhumini?.last_name}
        </div>
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
      title: "",
      dataIndex: "is_main_branch",
      render: (text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_USER", "VIEW_USER"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() =>
                    navigate("/usersManagement/viewUser", { state: { record } })
                  }
                >
                  View
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_USER", "EDIT_USER"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() =>
                    navigate("/usersManagement/editUser", { state: { record } })
                  }
                >
                  Edit
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_USER", "EDIT_USER"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item>
                  {record.status === "DISABLED"
                    ? "Activate User"
                    : "Deactivate User"}
                </Menu.Item>
              )}

              {GlobalMethod.hasAnyPermission(
                ["CHANGE_USER_PASSWORDS"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  //   onClick={() => handleChangePassword(record)}
                  data-bs-toggle="modal"
                  data-bs-target="#resetPassword"
                >
                  Change
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
                inputfilter={false}
                togglefilter={function (value: boolean): void {
                  throw new Error("Function not implemented.");
                }}
              />

              <Table
                columns={columns}
                dataSource={bahasha}
                loading={isLoading}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <CreateCardNumberModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
};

export default CardNumberList;
