import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, fetchtSpManagers, deactivateActivateUsers } from "../../helpers/ApiConnectors.js";
import { Button, Card, Dropdown, Menu, Modal } from "antd"; // Import Modal
import { Table } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks.js";
import { GlobalMethod } from "../../helpers/GlobalMethods.js";
import Tabletop from "../../components/tables/TableTop.js";
import CreateUserModal from "./SpManagers.js";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { addAlert } from "../../store/slices/alert/alertSlice.js";

function SpManagerList() {
  const navigate = useNavigate();
  const tableId = "data-table";
  const [openModal, setOpenModal] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // State for confirmation modal
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for deactivation
  const church = useAppSelector((state: any) => state.sp);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const { data: spManagers, isLoading } = useQuery({
    queryKey: ["spManagers"],
    queryFn: async () => {
      const response: any = await fetchtSpManagers(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response: any = await fetchRoles();
      return response?.map((role: any) => ({
        name: role.role_name,
        value: role.id,
      }));
    },
  });

  const handleActivateDeactivate = async (record: any) => {

      const response: any = await deactivateActivateUsers(`?id=${record.sp_manager_details.id}`);
      if (response?.message === "Staff activated successfully" || response?.message === "Staff deactivated successfully") {
        queryClient.invalidateQueries({ queryKey: ["spManagers"] });
        dispatch(
          addAlert({
            title: "Success",
            message: record?.sp_manager_details?.user_active ? "User deactivated successfully": "User activated successfully",
            type: "success",
          })
        );
      } else {
        dispatch(
          addAlert({
            title: "Success",
            message: "action failed",
            type: "error",
          })
        );
      }
    
  };

  const handleChangePassword = (_record: any) => {
    const modalTrigger = document.getElementById("resetPassword");
    if (modalTrigger) modalTrigger.click();
  };

  const showConfirmModal = (record: any) => {
    setSelectedUser(record); // Set the selected user
    setConfirmModalVisible(true); // Show the confirmation modal
  };

  const handleConfirmDeactivate = async () => {
    if (selectedUser) {
      await handleActivateDeactivate(selectedUser); // Deactivate the user
      setConfirmModalVisible(false); // Hide the confirmation modal
    }
  };

  const handleCancelDeactivate = () => {
    setConfirmModalVisible(false); // Hide the confirmation modal
  };

  const columns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "First Name",
      dataIndex: ["sp_manager_details", "firstname"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.firstname.localeCompare(b.sp_manager.firstname),
    },
    {
      title: "Last Name",
      dataIndex: ["sp_manager_details", "lastname"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.lastname.localeCompare(b.sp_manager.lastname),
    },
    {
      title: "Role",
      dataIndex: ["sp_manager_details", "role"],
      render: (text: any) => {
        const role = roles?.find((r: any) => r.value === text);
        return <div>{role?.name}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: ["sp_manager_details", "email"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.email.localeCompare(b.sp_manager.email),
    },
    {
      title: "Phone",
      dataIndex: ["sp_manager_details", "phone"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.phone.localeCompare(b.sp_manager.phone),
    },
    {
      title: <strong>Status</strong>,
      dataIndex: ["sp_manager_details", "user_active"],
      render: (text: any) => (
        <>
          {text ? (
            <span className="bg-green-300 rounded-lg p-1 text-white">Active</span>
          ) : (
            <span className="bg-red-300 rounded-lg p-1 text-white">Disabled</span>
          )}
        </>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Disabled', value: false },
      ],
      onFilter: (value: boolean | any, record: any) => record.sp_manager.user_active === value,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              {GlobalMethod.hasAnyPermission(
                ["VIEW_SP_ADMINS", "VIEW_USER"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  icon={<EyeOutlined />}
                  onClick={() =>
                    navigate("/usersManagement/viewUser", { state: { record } })
                  }
                >
                  View
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["ADD_SP_MANAGERS", "EDIT_USER"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  icon={<EditOutlined />}
                  onClick={() =>
                    navigate("/usersManagement/editUser", { state: { record } })
                  }
                >
                  Edit
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["ADD_SP_MANAGERS"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() => showConfirmModal(record)}
                  icon={<ExclamationCircleOutlined />}
                >
                  {record.sp_manager_details.user_active ? "Deactivate User" : "Activate User"}
                </Menu.Item>
              )}
              {GlobalMethod.hasAnyPermission(
                ["ADD_SP_MANAGERS"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item
                  onClick={() => handleChangePassword(record)}
                  data-bs-toggle="modal"
                  icon={<ExclamationCircleOutlined />}
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
    <div className="max-h-max">
      <Card
        title={<h3 className=" text-sm text-left"> Users </h3>}
        className="mt-5"
        extra={
          <Button onClick={() => setOpenModal(true)}>
            Add User
          </Button>
        }
      >
   
        <div className="table-responsive">
        <Tabletop
          inputfilter={false}
          togglefilter={function (_value: boolean): void {
            throw new Error("Function not implemented.");
          }}
          searchTerm={""}
          onSearch={function (_value: string): void {
            throw new Error("Function not implemented.");
          }}
          data={tableId}
        />
          <Table
            id={tableId}
            columns={columns}
            dataSource={spManagers}
            loading={isLoading}
          />
        </div>
      </Card>
      <CreateUserModal openModal={openModal} handleCancel={() => setOpenModal(false)} />

      {/* Confirmation Modal */}
      <Modal
        title="Confirm User status change"
        visible={confirmModalVisible}
        onOk={handleConfirmDeactivate}
        onCancel={handleCancelDeactivate}
        okText="Proeed"
        cancelText="Cancel"
      >
        <p>Are you sure you want to change this user status?</p>
      </Modal>
    </div>
  );
}

export default SpManagerList;