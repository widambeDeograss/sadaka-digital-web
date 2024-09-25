import React from "react";
import Dropdown from "./DropDown";
import { Button } from "@material-tailwind/react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";



const Profile = ({ sticky }:any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const ProfileMenu = [
    {
      label: "Profile",
      icon: "ph:user-circle-light",
      status: "green",
      action: () => {
        navigate("/profile");
      },
    },
    {
      label: "Reports",
      icon: "ph:chart-bar-light",
      status: "blue",
      action: () => {
        navigate("/chats");
      },
    },
    {
      label: "Settings",
      icon: "ph:gear-light",
      status: "yellow",
      action: () => {
        navigate("/todos");
      },
    },
    {
      label: "Get Help",
      icon: "ph:question-light",
      status: "cyan",
      action: () => {
        navigate("/settings");
      },
    },
  ];

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user");
  };

  const ProfileLabel = ({ sticky }:any) => {
    return (

            <span className="user-img avatar-letter">
                <div className="avatar">
                  <span className="status online online-dot" />
                  {/* {GlobalMethod.makeInitialsFromName(
                    `${userDetail.FNm} ${userDetail.LNm}`
                  )} */}
                </div>
              </span>

    );
  };
  return (
    <Dropdown
      label={<ProfileLabel sticky={sticky} />}
      classMenuItems="w-[220px] top-[58px]  "
    >
      <div className="flex items-center px-4 py-3 border-b border-gray-10 mb-3">
        <div className="flex-none ltr:mr-[10px] rtl:ml-[10px]">
          <div className="h-[46px] w-[46px] rounded-full">
          <span className="user-img avatar-letter">
                <div className="avatar">
                  <span className="status online online-dot" />
                  {/* {GlobalMethod.makeInitialsFromName(
                    `${userDetail.FNm} ${userDetail.LNm}`
                  )} */}
                </div>
              </span>
          </div>
        </div>
        <div className="flex-1 text-gray-700 dark:text-white text-sm font-semibold  ">
          <span className=" truncate w-full block">Deo</span>
          <span className="block font-light text-xs   capitalize">
          </span>
        </div>
      </div>
      <div className=" space-y-3">
        {ProfileMenu.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <div
                onClick={() => item.action()}
                className={`${
                  active
                    ? " text-indigo-500 "
                    : "text-gray-600 dark:text-gray-300"
                } block transition-all duration-150 group     `}
              >
                <div className={`block cursor-pointer px-4 `}>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse ">
                    <span
                      className={`flex-none h-9 w-9  inline-flex items-center justify-center group-hover:scale-110 transition-all duration-200  rounded-full text-2xl  text-white
                       ${item.status === "cyan" ? "bg-cyan-500 " : ""} 
                       ${item.status === "blue" ? "bg-[#13317d] " : ""} 
                      ${item.status === "red" ? "bg-red-500 " : ""} 
                      ${item.status === "green" ? "bg-green-500 " : ""}${
                        item.status === "yellow" ? "bg-yellow-500 " : ""
                      }
                      `}
                    >
                      {/* <Icon icon={item.icon} /> */}
                    </span>
                    <span className="block text-sm">{item.label}</span>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
        <Menu.Item >
          <div
            className={`block cursor-pointer px-4 border-t border-gray-10 py-3 mt-1 text-indigo-500 `}
          >
            <Button
              // icon="ph:upload-simple-light"
              // rotate={1}
              // text="Logout"
              className="btn-primary block w-full btn-sm "
            >
              Logout
            </Button>
          </div>
        </Menu.Item>
      </div>
    </Dropdown>
  );
};

export default Profile;
