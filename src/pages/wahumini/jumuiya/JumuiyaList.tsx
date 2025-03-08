import { Button, Card, Col, Row, Table, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import Tabletop from "../../../components/tables/TableTop.tsx";
import { fetchtJumuiya, fetchtKanda } from "../../../helpers/ApiConnectors.ts";
import { useAppSelector } from "../../../store/store-hooks.ts";
import { useQuery } from "@tanstack/react-query";
import KandaFormModal from "./AddEditKanda.tsx";
import JumuiyaFormModal from "./AddEditJumuiya.tsx";
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import { GlobalMethod } from "../../../helpers/GlobalMethods.ts";

const KandaJumuiya = () => {
  const [openKandaModal, setOpenKandaModal] = useState(false);
  const [openJumuiyaModal, setOpenJumuiyaModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermJumuiya, setSearchTermJumuiya] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataJumuiya, setFilteredDataJumuiya] = useState([]);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editData, setEditData] = useState<any | null>(null);
  const tableId = "kanda-jumuiya";
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const church = useAppSelector((state: any) => state.sp);

  const { data: kanda, isLoading: loadingKanda } = useQuery({
    queryKey: ["kanda"],
    queryFn: async () => {
      const response: any = await fetchtKanda(`?church_id=${church.id}`);
      return response;
    },
  });

  const { data: jumuiya, isLoading: loadingJumuiya } = useQuery({
    queryKey: ["jumuiya"],
    queryFn: async () => {
      const response: any = await fetchtJumuiya(`?church_id=${church.id}`);
      console.log(response);

      return response;
    },
  });

  const handleOpenKandaModal = (type: "add" | "edit", data?: any) => {
    setMode(type);
    setEditData(data || null);
    setOpenKandaModal(true);
  };

  const handleOpenJumuiyaModal = (type: "add" | "edit", data?: any) => {
    setMode(type);
    setEditData(data || null);
    setOpenJumuiyaModal(true);
  };

  // Define columns for Kanda
  const kandaColumns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => (
        <div>{index + 1}</div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Leader's Name",
      dataIndex: "jina_kiongozi",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Phone Number",
      dataIndex: "namba_ya_simu",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Action",
      render: (_text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
               {GlobalMethod.hasAnyPermission(
                  ["MANAGE_JUMUIYA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
              <Menu.Item
                icon={<EditOutlined />}
                onClick={() => handleOpenKandaModal("edit", record)}
              >
                Edit
              </Menu.Item>
                )}
              {/* <Menu.Item
              icon={<EyeOutlined />}
              onClick={() => handleOpenKandaModal("edit", record)}>
                View
              </Menu.Item> */}
                {GlobalMethod.hasAnyPermission(
                  ["MANAGE_JUMUIYA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
              <Menu.Item
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleOpenKandaModal("edit", record)}
              >
                Delete
              </Menu.Item>
                )}
            </Menu>
          }
        >
          <Button type="link">Actions</Button>
        </Dropdown>
      ),
    },
  ];

  const jumuiyaColumns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => (
        <div>{index + 1}</div>
      ),
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Jumuiya Name",
      dataIndex: "name",
      render: (_text: any, record: any) => <div>{record?.name}</div>,
    },
    {
      title: "Kanda Name",
      dataIndex: "kanda_details",
      render: (_text: any, record: any) => (
        <div>{record?.kanda_details?.name}</div>
      ),
    },
    {
      title: "Leader's Name",
      dataIndex: "jina_kiongozi",
      render: (_text: any, record: any) => <div>{record?.jina_kiongozi}</div>,
    },
    {
      title: "Phone Number 1",
      dataIndex: "namba_ya_simu",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Phone Number 2",
      dataIndex: "address",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (text: any, _record: any) => <div>{text}</div>,
    },
    {
      title: "Actions",
      dataIndex: "",
      render: (_text: any, record: any) => (
        <div>
          <Dropdown
            overlay={
              <Menu>
                {GlobalMethod.hasAnyPermission(
                  ["MANAGE_JUMUIYA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
                  <Menu.Item
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenJumuiyaModal("edit", record)}
                  >
                    Edit
                  </Menu.Item>
                )}
                {/* <Menu.Item
              icon={<EyeOutlined />}
              onClick={() => handleOpenJumuiyaModal("edit", record)}>
                View
              </Menu.Item> */}
                {GlobalMethod.hasAnyPermission(
                  ["MANAGE_JUMUIYA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
                  <Menu.Item
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleOpenKandaModal("edit", record)}
                  >
                    Delete
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              Actions <DownOutlined />
            </a>
          </Dropdown>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = kanda?.filter((item: any) => {
        return (
          item?.name?.toLowerCase()?.includes(lowercasedTerm) ||
          item?.jina_kiongozi?.toLowerCase()?.includes(lowercasedTerm) ||
          item?.location?.toLowerCase()?.includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(kanda);
    }
  }, [searchTerm, kanda]);

  useEffect(() => {
    if (searchTermJumuiya) {
      const lowercasedTerm = searchTermJumuiya.toLowerCase();
      const filtered = jumuiya.filter((item: any) => {
        return (
          item?.name?.toLowerCase()?.includes(lowercasedTerm) ||
          item?.kanda_details?.name?.toLowerCase().includes(lowercasedTerm) ||
          item?.jina_kiongozi?.toLowerCase()?.includes(lowercasedTerm) ||
          item?.location?.toLowerCase()?.includes(lowercasedTerm)
        );
      });
      setFilteredDataJumuiya(filtered);
    } else {
      setFilteredDataJumuiya(jumuiya);
    }
  }, [searchTermJumuiya, jumuiya]);

  return (
    <div>
      <Card
        title={
          <h3 className="font-bold text-sm text-left">Kanda na Jumuiya</h3>
        }
      >
        <div className="flex justify-between mt-3">
          <div>
            <h3 className="text-left font-bold text-xs">
              Jumla Kanda: <span>{kanda?.length}</span>
            </h3>
            <h3 className="text-left font-bold text-xs mt-2">
              Jumla Jumuiya: <span>{jumuiya?.length}</span>
            </h3>
          </div>
          <div>
            <Button.Group>
            {GlobalMethod.hasAnyPermission(
                  ["MANAGE_JUMUIYA"],
                  GlobalMethod.getUserPermissionName(userPermissions)
                ) && (
           <>
              <Button
                type="primary"
                className="bg-[#152033] text-white text-xs"
                onClick={() => handleOpenKandaModal("add")}
              >
                Ongeza Kanda
              </Button>
              <Button
                type="primary"
                className="bg-[#152033] text-white text-xs"
                onClick={() => handleOpenJumuiyaModal("add")}
              >
                Ongeza Jumuiya
              </Button>
           </>
                )}
            </Button.Group>
          </div>
        </div>
      </Card>

      <Row gutter={24} className="mt-5">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            title={<h3 className="text-sm text-left">Kanda</h3>}
            className="mt-5"
          >
            <div className="table-responsive">
              <Tabletop
                showFilter={false}
                inputfilter={false}
                onSearch={(term: string) => setSearchTerm(term)}
                togglefilter={() => {}}
                searchTerm={searchTerm}
                data={tableId}
              />

              <Table
                id={tableId}
                columns={kandaColumns}
                dataSource={filteredData}
                loading={loadingKanda}
                bordered
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className="mt-5">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            title={<h3 className="text-sm text-left">Jumuiya</h3>}
            className="mt-5"
          >
            <div className="table-responsive">
              <Tabletop
                showFilter={false}
                inputfilter={false}
                onSearch={(term: string) => setSearchTermJumuiya(term)}
                togglefilter={() => {}}
                searchTerm={searchTermJumuiya}
                data={tableId}
              />
              <Table
                id={tableId}
                columns={jumuiyaColumns}
                dataSource={filteredDataJumuiya}
                loading={loadingJumuiya}
                bordered
              />
            </div>
          </Card>
        </Col>
      </Row>

      {openKandaModal && (
        <KandaFormModal
          mode={mode}
          initialData={editData}
          handleCancel={() => setOpenKandaModal(false)}
        />
      )}

      {openJumuiyaModal && (
        <JumuiyaFormModal
          mode={mode}
          initialData={editData}
          handleCancel={() => setOpenJumuiyaModal(false)}
        />
      )}
    </div>
  );
};

export default KandaJumuiya;
