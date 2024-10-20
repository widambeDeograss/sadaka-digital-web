import { Button, Card, Col, Dropdown, Menu, Row, Table } from "antd";
import Column from "antd/es/table/Column";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router-dom";
import Tabletop from "../../components/tables/TableTop";
import { fetchWahumini } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { useAppSelector } from "../../store/store-hooks";
import { DownOutlined } from "@ant-design/icons";

const michango = [
  {
    id: 1,
    name: "Widambe Deograss",
    phone: "0716058802",
    nambayakadi: "2343CD",
    changio: 500000,
    ahadi: 3400000,
    dob: "1/11/2023",
  },
];
const Wahumini = () => {
  const navigate = useNavigate();
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const {
    data: wahumini,
    isLoading,
    error,
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

  const columns = [
    {
      title: "s/No",

      dataIndex: "sNo",
      render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      render: (text: any, record: any) => <div>{text}</div>,
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
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Location",
      dataIndex: "address",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: <strong>Has a login account</strong>,
      dataIndex: "has_loin_account",
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
                  Change Password
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
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => navigate("/dashboard/wahumini/ongeza")}
                >
                  Ongeza Muhumini
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
            title="Wahumini"
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
                dataSource={wahumini}
                loading={isLoading}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Wahumini;
