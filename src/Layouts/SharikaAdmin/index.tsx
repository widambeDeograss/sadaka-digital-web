import React, { useState} from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Menu,
  Layout,
  Input,
} from "antd";
import { PiChurchBold, PiHandsPrayingFill, PiHandshakeBold, PiUsersFourBold  } from "react-icons/pi";
import { GiSwapBag, GiTakeMyMoney, GiPayMoney  } from "react-icons/gi";
import { RiDashboardFill } from "react-icons/ri";
// import Offer
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import { Colors } from "../../Constants/Colors";
import logo from "../../assets/church.png";
import Header from "../../components/ui/Header";
import { useAppSelector } from "../../store/store-hooks";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { ToastContainer } from "react-toastify";
import { FiSettings } from "react-icons/fi";

const { Content, Footer, Sider } = Layout;
const { Search } = Input;

const menuItems = [
    {
        key: "home",
        label: "Home",
        icon: <HomeOutlined style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/",
        permissions:['MANAGE_CHURCH']
    },
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <RiDashboardFill style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/dashboard/home",
        permissions:['MANAGE_SPS']
    },
    {
        key: "sadaka",
        label: "Sadaka",
        icon: <PiHandsPrayingFill style={{  fontWeight: "bold"  ,fontSize: "14px",}} />,
        path: "/dashboard/sadaka",
        permissions:['VIEW_SADAKA']
    },
    {
        key: "zaka",
        label: "Zaka",
        icon: <GiSwapBag style={{ fontSize: "14px", fontWeight: "bold",  }} />,
        path: "/dashboard/zaka",
        permissions:['VIEW_ZAKA']
    },
    {
        key: "michango",
        label: "Michango",
        icon: <PiHandshakeBold style={{ fontSize: "14px", fontWeight: "bold" }} />,
        permissions:['VIEW_MICHANGO'],
        children: [
            { key: "iliyopo", label: "Michango iliyopo", path: "/dashboard/michango/iliyopo",  permissions:['VIEW_MICHANGO'], },
            { key: "ongeza", label: "Ongeza Michango", path: "/dashboard/michango/ongeza",  permissions:['ADD_MICHANGO'], },
        ],
    },
    {
        key: "user",
        label: "Users",
        icon: <PiUsersFourBold style={{ fontSize: "14px", fontWeight: "bold" }} />,
        permissions:['MANAGE_USERS'],
        children: [
            { key: "list", label: "Users", path: "/dashboard/users/list",  permissions:['MANAGE_USERS'], },
            { key: "roles", label: "roles", path: "/dashboard/users/roles" ,  permissions:["MANAGE_ROLES"],},
            { key: "permissions", label: "Permissions", path: "/dashboard/users/permissions",  permissions:['MANAGE_PERMISSIONS'], },
        ],
    },
    {
        key: "sps",
        label: "Service providers",
        icon: <PiChurchBold style={{ fontSize: "14px", fontWeight: "bold" }} />,
        permissions:["MANAGE_SPS"],
        children: [
            { key: "sps", label: "SpList", path: "/dashboard/sps",  permissions:["MANAGE_SPS"], },
            // { key: "roles", label: "roles", path: "/dashboard/users/roles" },
            // { key: "permissions", label: "Permissions", path: "/dashboard/users/permissions" },
        ],
    },
    {
        key: "wahumini",
        label: "Wahumini",
        icon: <UsergroupAddOutlined style={{ fontSize: "14px", fontWeight: "bold" }} />,
        permissions:['VIEW_WAHUMINI'],
        children: [
            { key: "waliopo", label: "Wahhumini waliopo", path: "/dashboard/wahumini/waliopo", permissions:['VIEW_WAHUMINI'], },
            { key: "ongeza", label: "Ongeza Muhumini", path: "/dashboard/wahumini/ongeza", permissions:['VIEW_WAHUMINI'], },
            { key: "bahasha", label: "Bahasha", path: "/dashboard/wahumini/bahasha", permissions:['VIEW_WAHUMINI'], },
        ],

    },
    {
        key: "ahadi",
        label: "Ahadi",
        permissions:['VIEW_AHADI'],
        icon: <GiPayMoney  style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/dashboard/ahadi",
    },
    {
        key: "matumizi",
        label: "Matumizi",
        permissions:['VIEW_EXPENCES'],
        icon: <GiTakeMyMoney style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/dashboard/matumizi",
    },
    {
      key: "settings",
      label: "Settings",
      icon: <FiSettings style={{ fontSize: "14px", fontWeight: "bold" }} />,
      permissions:['VIEW_WAHUMINI'],
      children: [
          { key: "payment", label: "Payment types", path: "/dashboard/settings/payment-type", permissions:['VIEW_WAHUMINI'], },
          { key: "expenditure", label: "Expenditure Category", path: "/dashboard/settings/expenditure-category", permissions:['VIEW_WAHUMINI'], },
          // { key: "bahasha", label: "Bahasha", path: "/dashboard/wahumini/bahasha", permissions:['VIEW_WAHUMINI'], },
      ],

  },
];
const Main: React.FC = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 680);
  const userPermissions = useAppSelector((state:any) => state?.user?.userInfo?.role.permissions)
  const { pathname } = useLocation();
    const navigate = useNavigate();


    console.log(userPermissions);
    

  return (
    <Layout className="">
      <ToastContainer/>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={240}
        style={{
            backgroundColor: Colors.primary,
            height: "100vh",
            position: "fixed", // Set the sidebar to be fixed
            left: 0,
        }}
      >
        <div className=" p-10 flex justify-center items-center">
          <img src={logo} className="h-10 w-10 mr-1" />
          {!collapsed && (
            <h3 className="text-lg text-white font-semibold text-center">
              Sadaka
                <br/>
                Digital
            </h3>
          )}
        </div>
        <Menu
          mode="vertical"
          theme="dark"
          selectedKeys={[pathname]}
          className="text-base text-left"
          onSelect={({ key }) => navigate(key)}
        >
          {menuItems.map((item) => {
            if (  GlobalMethod.hasAnyPermission(
              item.permissions,
              GlobalMethod.getUserPermissionName(userPermissions)
            )) {
              if (item.children) {
                return (
                  <Menu.SubMenu key={item.path} title={item.label} icon={item.icon}>
                    {item.children.map((child) => (
                       GlobalMethod.hasAnyPermission(
                        child.permissions,
                        GlobalMethod.getUserPermissionName(userPermissions)
                      ) && (
                        <Menu.Item key={child.path}>
                          {child.label}
                        </Menu.Item>
                      )
                    ))}
                  </Menu.SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={item.path} icon={item.icon}>
                    {item.label}
                  </Menu.Item>
                );
              }
            }
            return null;
          })}
        </Menu>
      </Sider>
     
      <Layout style={{ marginLeft: collapsed ? 80 : 240 }}>
  <Header/>
        <Content
            className={collapsed ? "" : "  hidden lg:block md:block sm:hidden "}
          style={{
              // margin: "px px",
              padding: 24,
              background: Colors.bgDarkAddon,
              overflowY: "auto",
              // marginBottom:60

          }}
        >
         <Outlet/>
        </Content>
        <Footer style={{ textAlign: "center"}}  className={collapsed ? "" : "  hidden lg:block md:block sm:hidden "} >
          Sadaka Digital ©2023 Created by UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
