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
import Tabletop from "../../components/tables/TableTop";
import { useAppSelector } from "../../store/store-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMavuno, fetchMavuno } from "../../helpers/ApiConnectors";
import { useNavigate } from "react-router-dom";
import OngezaMavuno from "./AddEditMavuno";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import modal from "antd/es/modal";
import OngezaMavunoPayments from "./AddMavunoPayment";
import Widgets from "./Stats";

const MavunoList = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const church = useAppSelector((state: any) => state.sp);
  const queryClient = useQueryClient();
  // const userPermissions = useAppSelector(
  //     (state: any) => state.user.userInfo.role.permissions
  // );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [ongezaMavunoModal, setOngezaMavunoModal] = useState(false);
  const { data: mavuno, isLoading: loadingMavuno } = useQuery({
    queryKey: ["mavuno"],
    queryFn: async () => {
      const response: any = await fetchMavuno(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
  });
  const tableId = "data-table";

  const handleDelete = (id: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteMutation(id);
      },
    });
  };

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (ID: any) => {
      await deleteMavuno(ID);
    },
    onSuccess: () => {
      message.success("Mavuno deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["mavuno"] });
    },
    onError: () => {
      message.error("Failed to delete Mavuno.");
    },
  });

  const columns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => (
        <div>{index + 1}</div>
      ),
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Year Target Amount",
      dataIndex: "year_target_amount",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Collected Amount",
      dataIndex: "collected_amount",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Status",
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
    },
    {
      title: "Progress",
      dataIndex: "status",
      render: (_text: any, record: any) => (
        <div>
          <Progress
            percent={Math.floor(
              (record.collected_amount / record.year_target_amount) * 100
            )}
            status="active"
          />
        </div>
      ),
    },
    {
      title: "Inserted At",
      dataIndex: "inserted_at",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                icon={<EyeOutlined />}
                onClick={() => navigate(`/dashboard/mavuno/${record.id}`)}
              >
                View
              </Menu.Item>

              <Menu.Item
                icon={<EditOutlined />}
                onClick={() =>
                  navigate("/dashboard/mavuno/update", {
                    state: { record },
                  })
                }
              >
                Edit
              </Menu.Item>

              <Menu.Item
                onClick={() => handleDelete(record?.id)}
                data-bs-toggle="modal"
                icon={<DeleteOutlined />}
                data-bs-target="#resetPassword"
                danger
              >
                Delete Mavuno
              </Menu.Item>
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
      const filtered = mavuno.filter((item: any) => {
        return (
          item?.name.toLowerCase().includes(lowercasedTerm) ||
          item?.description.toLowerCase().includes(lowercasedTerm) ||
          item?.inserted_at.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(mavuno);
    }
  }, [searchTerm, mavuno]);

  return (
    <div className="">
      <Widgets/>
      <Card
        className="mt-4"
        title={<h3 className="font-bold text-sm text-left ">Mavuno</h3>}
      >
        <div className="text-xs">
          <h3 className="text-left">
            Tarehe: <span>{new Date().toDateString()}</span>
          </h3>
          <div className="flex justify-between flex-wrap mt-3">
            <div>
              <Button.Group className="mt-5">
                <Button
                  type="primary"
                  className="bg-[#152033] text-white"
                  onClick={() => setOpenModal(true)}
                >
                  Mavuno kwa jumuiya
                </Button>
                <Button type="primary" className="bg-[#152033] text-white"
                onClick={() => setOngezaMavunoModal(true)}
                >
                  Ongeza Mavuno
                </Button>
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>
      <Card
        title={<h3 className="font-bold text-sm text-left ">Mavuno</h3>}
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
            loading={loadingMavuno}
          />
        </div>
      </Card>
      <OngezaMavuno
        openModal={openModal}
        handleCancel={() => setOpenModal(false)}
      />
      <OngezaMavunoPayments
      onCancel={() => setOngezaMavunoModal(false)}
      visible={ongezaMavunoModal}
      />
    </div>
  );
};

export default MavunoList;
