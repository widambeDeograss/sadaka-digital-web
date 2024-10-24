import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers } from "../../helpers/ApiConnectors.js";
import { Button, Card, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useAppSelector } from "../../store/store-hooks.js";
import { GlobalMethod } from "../../helpers/GlobalMethods.js";
import Tabletop from "../../components/tables/TableTop.js";
import CreateUserModal from "./AddUser.js";

function UsersList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUserForPasswordEdit, setSelectedUserForPasswordEdit] =
    useState(null);
    const [openMOdal, setopenMOdal] = useState(false);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response:any = await fetchAllUsers(`?query_type=sp_admins`);
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
      sorter: (a:any, b:any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Name",
      dataIndex: "firstname",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Name",

      dataIndex: "lastname",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "User name",
      dataIndex: "username",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
    {
      title: <strong>Status</strong>,
      dataIndex: "user_active",
      render: (text: any, record: any) => (
        <>
          {text === true && (
            <span className="bg-green-300 rounded-lg p-1 text-white">Active</span>
          )}
          {text === false && (
            <span className="bg-red-300 rounded-lg p-1 text-white">Disabled</span>
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
                <Menu.Item onClick={() => handleActivateDeactivate(record)}>
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
                  onClick={() => handleChangePassword(record)}
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
    <div className="max-h-max">
      <Card
        title={<h3 className=" text-sm text-left">Users </h3>}
        className="mt-5"
        extra={
            <Button onClick={() =>  setopenMOdal(true)}>
                Add User
            </Button>
        }
      >
        <Tabletop inputfilter={false} togglefilter={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } searchTerm={""} onSearch={function (value: string): void {
          throw new Error("Function not implemented.");
        } }/>
        <div className="table-responsive">
          <Table columns={columns} dataSource={users} loading={isLoading}/>
        </div>
      </Card>
      <CreateUserModal openModal={openMOdal} handleCancel={() => setopenMOdal(false)}/>
    </div>
  );
}

export default UsersList;
