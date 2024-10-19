import {
    Button,
    Card,
    Dropdown,
    Menu,
    Table,
  } from "antd";
  import { useState } from "react";
  import Tabletop from "../../components/tables/TableTop";
  import { useQuery } from "@tanstack/react-query";
  import { fetchSystemPackage } from "../../helpers/ApiConnectors";
  import { useNavigate } from "react-router-dom";
  import AddSystemPackage from "./AddSystemPackage";
  import { DownOutlined } from "@ant-design/icons";
  
  const SystemPackagesList = () => {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState<"add" | "edit">("add");
    const [initialData, setInitialData] = useState<{
      id: number;
      name: string;
      description: string;
      price: number;
      duration: string;
      status: boolean;
    } | null>(null);
  
    const navigate = useNavigate();
  
    // Fetch system packages using react-query
    const { data: systemPackages, isLoading: loadingSystemPackages } = useQuery({
      queryKey: ["SystemPackages"],
      queryFn: async () => {
        const response: any = await fetchSystemPackage();
        return response;
      },
    });
  
    // Add system package
    const handleAdd = () => {
      setMode("add");
      setInitialData(null);
      setShowModal(true);
    };
  
    const handleEdit = (record: { id: number; package_name: string; package_description: string; package_price: number; package_duration: string; status: boolean }) => {
        setMode("edit");
        setInitialData({
          id: record.id,
          name: record.package_name,
          description: record.package_description,
          price: record.package_price,
          duration: record.package_duration,
          status: record.status,
        });
        setShowModal(true);
      };
  
    // Close modal
    const handleCancel = () => {
      setShowModal(false);
    };
  
    // Table columns
    const columns = [
      {
        title: "s/No",
        dataIndex: "sNo",
        render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
        sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
      },
      {
        title: "Name",
        dataIndex: "package_name",
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: "Description",
        dataIndex: "package_description",
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: "Price",
        dataIndex: "package_price",
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: "Duration(months)",
        dataIndex: "package_duration",
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (text: any) => (
          <span className={`p-1 text-white rounded-lg ${text ? "bg-green-300" : "bg-red-300"}`}>
            {text ? "Active" : "Disabled"}
          </span>
        ),
      },
      {
        title: "Actions",
        dataIndex: "actions",
        render: (text: any, record: any) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => navigate("/usersManagement/viewUser", { state: { record } })}>
                  View
                </Menu.Item>
                <Menu.Item onClick={() => handleEdit(record)}>
                  Edit
                </Menu.Item>
                <Menu.Item onClick={() => handleEdit(record)}>
                  {record.status === "DISABLED" ? "Activate Package" : "Deactivate Package"}
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
  
    return (
      <div>
        <Card title={<h3 className="font-bold text-sm text-left">System Packages</h3>}>
          <div className="text-xs">
            <h3 className="text-left">
              Total Packages: <span>{systemPackages?.length || 0}</span>
            </h3>
            <div className="flex justify-between flex-wrap mt-3">
              <div>
                <Button.Group className="mt-5">
                  <Button type="primary" className="bg-[#152033] text-white" onClick={handleAdd}>
                    Add System Packages
                  </Button>
                </Button.Group>
              </div>
            </div>
          </div>
        </Card>
  
        <Card title={<h3 className="font-bold text-sm text-left">System Packages List</h3>} className="mt-5">
          <div className="table-responsive">
            <Tabletop
              inputfilter={false}
              togglefilter={(value: boolean) => {
                // Implement filter logic here if necessary
              }}
            />
            <Table columns={columns} dataSource={systemPackages} loading={loadingSystemPackages} />
          </div>
        </Card>
  
        {/* Modal for Add/Edit */}
        {showModal && (
          <AddSystemPackage
            mode={mode}
            //@ts-ignore
            initialData={initialData}
            handleCancel={handleCancel}
          />
        )}
      </div>
    );
  };
  
  export default SystemPackagesList;
  