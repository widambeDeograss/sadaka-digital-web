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
  import { fetchSpPackage } from "../../helpers/ApiConnectors";
  import { useNavigate } from "react-router-dom";
  import { DownOutlined } from "@ant-design/icons";
import AddPackage from "./AddPackageModal";
  
  const SpPackages = () => {
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
      queryKey: ["spPackages"],
      queryFn: async () => {
        const response: any = await fetchSpPackage();
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
      title: "S/No",
      dataIndex: "sNo",
      render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Package Name",
      dataIndex: ["package_details", "package_name"],
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Package Description",
      dataIndex: ["package_details", "package_description"],
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Package Price",
      dataIndex: ["package_details", "package_price"],
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Duration (months)",
      dataIndex: ["package_details", "package_duration"],
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Church Name",
      dataIndex: ["church_details", "church_name"],
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Church Location",
      dataIndex: ["church_details", "church_location"],
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Paid Amount",
      dataIndex: "payed_amount",
      render: (text: any) => <div>{text}</div>,
    },
    {
      title: "Start Date",
      dataIndex: "package_start_date",
      render: (text: any) => <div>{new Date(text).toLocaleDateString()}</div>,
    },
    {
      title: "End Date",
      dataIndex: "package_end_date",
      render: (text: any) => <div>{new Date(text).toLocaleDateString()}</div>,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text: any) => (
        <span className={`p-1 text-white rounded-lg ${text ? "bg-green-300" : "bg-red-300"}`}>
          {text ? "Active" : "Inactive"}
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
              <Menu.Item onClick={() => navigate("/packages/viewPackage", { state: { record } })}>
                View
              </Menu.Item>
              <Menu.Item onClick={() => handleEdit(record)}>
                Edit
              </Menu.Item>
              <Menu.Item onClick={() => handleEdit(record)}>
                {record.is_active ? "Deactivate Package" : "Activate Package"}
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
        <Card title={<h3 className="font-bold text-sm text-left">Packages</h3>}>
          <div className="text-xs">
            <h3 className="text-left">
              Total Packages: <span>{systemPackages?.length || 0}</span>
            </h3>
            <div className="flex justify-between flex-wrap mt-3">
              <div>
                <Button.Group className="mt-5">
                  <Button type="primary" className="bg-[#152033] text-white" onClick={handleAdd}>
                    Add Packages
                  </Button>
                </Button.Group>
              </div>
            </div>
          </div>
        </Card>
  
        <Card title={<h3 className="font-bold text-sm text-left">Packages List</h3>} className="mt-5">
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
          <AddPackage
            mode={mode}
            //@ts-ignore
            initialData={initialData}
            handleCancel={handleCancel}
          />
        )}
      </div>
    );
  };
  
  export default SpPackages;
  