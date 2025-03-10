import {
  Badge,
  Button,
  Card,
  Dropdown,
  Menu,
  message,
  Progress,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import Widgets from "./Stats";
import Tabletop from "../../components/tables/TableTop";
import { useAppSelector } from "../../store/store-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMichango, fetchMichango } from "../../helpers/ApiConnectors";
import { useNavigate } from "react-router-dom";
import OngezaChagizo from "./OngezaChangizo";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import modal from "antd/es/modal";
import { GlobalMethod } from "../../helpers/GlobalMethods";

const MichangoList = () => {
  const [openMOdal, setopenMOdal] = useState(false);
  const navigate = useNavigate();
  const church = useAppSelector((state: any) => state.sp);
  const queryClient = useQueryClient();
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const tableId = "data-table";

  const { data: michango, isLoading: loadingmichango } = useQuery({
    queryKey: ["michango"],
    queryFn: async () => {
      const response: any = await fetchMichango(`?church_id=${church.id}`);

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
      await deleteMichango(ID);
    },
    onSuccess: () => {
      message.success("mchango deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["michango"] });
    },
    onError: () => {
      message.error("Failed to delete mchango.");
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
      title: "Name",
      dataIndex: "mchango_name",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Amount",
      dataIndex: "mchango_amount",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Collected Amount",
      dataIndex: "collected_amount",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Lengo",
      dataIndex: "target_amount",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Lengo",
      dataIndex: "status",
      render: (text: any, _record: any) => (
        <div>
          {text === true ? (
            <Badge className="" color="green">
              Active
            </Badge>
          ) : (
            <Badge color="yellow">Inactive</Badge>
          )}
        </div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Progress",
      dataIndex: "status",
      render: (_text: any, record: any) => (
        <div>
          <Progress
            percent={Math.floor(
              (record.collected_amount / record.target_amount) * 100
            )}
            status="active"
          />
        </div>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "date",
      dataIndex: "date",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              {GlobalMethod.hasAnyPermission(
                ["VIEW_MICHANGO"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/dashboard/mchango/${record.id}`)}
                >
                  View
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_MICHANGO"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  icon={<EditOutlined />}
                  onClick={() =>
                    navigate("/dashboard/michango/update", {
                      state: { record },
                    })
                  }
                >
                  Edit
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_MICHANGO"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() => handleDelete(record?.id)}
                  data-bs-toggle="modal"
                  icon={<DeleteOutlined />}
                  data-bs-target="#resetPassword"
                  danger
                >
                  Delete Mchango
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
      const filtered = michango.filter((item: any) => {
        return (
          item?.mchango_name.toLowerCase().includes(lowercasedTerm) ||
          item?.mchango_amount.toLowerCase().includes(lowercasedTerm) ||
          item?.date.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(michango);
    }
  }, [searchTerm, michango]);

  return (
    <div className="">
      <Widgets />
      <Card
        className="mt-4"
        title={<h3 className="font-bold text-sm text-left ">michango</h3>}
      >
        <div className="text-xs">
          <h3 className="text-left">
            Tarehe: <span>{new Date().toDateString()}</span>
          </h3>
          {/* <h3 className="text-left">Bahasha Zilizorudishwa Mwezi huu: <span>0</span></h3> */}
          <div className="flex justify-between flex-wrap mt-3">
            <div>
              <Button.Group className="mt-5">
              {GlobalMethod.hasAnyPermission(
                ["MANAGE_MICHANGO"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => navigate("/dashboard/michango/ongeza")}
                >
                  Ongeza michango
                </Button>
                  )}
                     {GlobalMethod.hasAnyPermission(
                ["VIEW_MICHANGO"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setopenMOdal(true)}
                >
                  Ongeza changizo
                </Button>
                  )}
                {/* </Radio.Button> */}
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>
      <Card
        title={<h3 className="font-bold text-sm text-left ">michango</h3>}
        className="mt-5"
      >
        <div className="table-responsive">
          <Tabletop
           inputfilter={false}
           onSearch={(term: string) => setSearchTerm(term)}
           togglefilter={(_value: boolean) => {}}
           searchTerm={searchTerm}
           data={tableId}
           showFilter={false}
          />
          <Table
              id={tableId}
              columns={columns}
              dataSource={filteredData}
              bordered
            loading={loadingmichango}
          />
        </div>
      </Card>
      <OngezaChagizo visible={openMOdal} onCancel={() => setopenMOdal(false)} />
    </div>
  );
};

export default MichangoList;
