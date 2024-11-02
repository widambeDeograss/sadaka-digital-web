import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {  fetchtSpManagers } from "../../helpers/ApiConnectors.js";
import { Button, Card, Dropdown, Menu } from "antd";
import { Table } from "antd";
import { useAppSelector } from "../../store/store-hooks.js";
import { GlobalMethod } from "../../helpers/GlobalMethods.js";
import Tabletop from "../../components/tables/TableTop.js";
import CreateUserModal from "./SpManagers.js";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

function SpManagerList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUserForPasswordEdit, setSelectedUserForPasswordEdit] =
    useState(null);
    const [openMOdal, setopenMOdal] = useState(false);
    const church = useAppSelector((state: any) => state.sp);
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
      // {
      //   enabled: false,
      // }
    });
  const handleActivateDeactivate = async (record: any) => {
    if (record.status === "ACTIVE") {
      const response = "";
      //   await userEnableDisable(record.id, "disable");
      //   if (response === "User Disabled successfully") {
      //     queryClient.invalidateQueries(['users']);
      //     dispatch(
      //       addAlert({
      //         title: "Success",
      //         message: "User deactivated successfully",
      //         type: "success",
      //       })
      //     )
      //   }else{

      //     dispatch(
      //       addAlert({
      //         title: "Success",
      //         message: "User deactivation failed",
      //         type: "error",
      //       })
      //     )
      //   }
    } else {
      //   const response = await userEnableDisable(record.id, "enable");
      //   if (response?.message === "User enabled successfully") {
      //     queryClient.invalidateQueries(['users']);
      //     dispatch(
      //       addAlert({
      //         title: "Success",
      //         message: "User activation successfully",
      //         type: "success",
      //       })
      //     )
      //   }else{
      //     dispatch(
      //       addAlert({
      //         title: "Success",
      //         message: "User activation failed",
      //         type: "error",
      //       })
      //     )
      //   }
    }
  };

  const handleChangePassword = (record: any) => {
    setSelectedUserForPasswordEdit(record);
    const modalTrigger = document.getElementById("resetPassword");
    console.log(modalTrigger);

    if (modalTrigger) modalTrigger.click();
  };

  const columns = [
    {
      title: "s/No",
      dataIndex: "sNo",
      render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "First Name",
      dataIndex: ["sp_manager", "firstname"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.firstname.localeCompare(b.sp_manager.firstname),
    },
    {
      title: "Last Name",
      dataIndex: ["sp_manager", "lastname"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.lastname.localeCompare(b.sp_manager.lastname),
    },
    {
      title: "Username",
      dataIndex: ["sp_manager", "username"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.username.localeCompare(b.sp_manager.username),
    },
    {
      title: "Email",
      dataIndex: ["sp_manager", "email"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.email.localeCompare(b.sp_manager.email),
    },
    {
      title: "Phone",
      dataIndex: ["sp_manager", "phone"],
      render: (text: any) => <div>{text}</div>,
      sorter: (a: any, b: any) => a.sp_manager.phone.localeCompare(b.sp_manager.phone),
    },
    {
      title: <strong>Status</strong>,
      dataIndex: ["sp_manager", "user_active"],
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
      onFilter: (value: boolean, record: any) => record.sp_manager.user_active === value,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text: any, record: any) => (
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
                ["MANAGE_USER", "EDIT_USER"],
                GlobalMethod.getUserPermissionName(userPermissions)
              ) && (
                <Menu.Item onClick={() => handleActivateDeactivate(record)}
                icon={<ExclamationCircleOutlined />}
                >
                  {record.sp_manager.user_active ? "Deactivate User" : "Activate User"}
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
        title={<h3 className=" text-sm text-left">Church Users </h3>}
        className="mt-5"
        extra={
            <Button onClick={() =>  setopenMOdal(true)}>
                Add Church User
            </Button>
        }
      >
        <Tabletop inputfilter={false} togglefilter={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } searchTerm={""} onSearch={function (value: string): void {
          throw new Error("Function not implemented.");
        } }/>
        <div className="table-responsive">
          <Table columns={columns} dataSource={spManagers} loading={isLoading}/>
        </div>
      </Card>
      <CreateUserModal openModal={openMOdal} handleCancel={() => setopenMOdal(false)}/>
    </div>
  );
}

export default SpManagerList;
