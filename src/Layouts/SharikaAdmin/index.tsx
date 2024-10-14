// src/pages/Main/Main.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Menu, Layout } from "antd";
import {
  PiChurchBold,
  PiHandsPrayingFill,
  PiHandshakeBold,
  PiUsersFourBold,
} from "react-icons/pi";
import { GiSwapBag, GiTakeMyMoney, GiPayMoney } from "react-icons/gi";
import { RiDashboardFill } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Colors } from "../../Constants/Colors";
import logo from "../../assets/church.png";
import Header from "../../components/ui/Header";
import { useAppSelector } from "../../store/store-hooks";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { ToastContainer } from "react-toastify";
import useWindowSize from "../../hooks/useWindowSize";
// import "./Main.css"; 

const { Content, Footer, Sider } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permissions: string[];
  children?: MenuItem[];
}

const menuItems:MenuItem[] = [
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
      permissions:['VIEW_DASHBOARD']
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
        { key: "expenditure", label: "Expenditure Category", path: "/dashboard/settings/expense-categories", permissions:['VIEW_WAHUMINI'], },
        // { key: "bahasha", label: "Bahasha", path: "/dashboard/wahumini/bahasha", permissions:['VIEW_WAHUMINI'], },
    ],

},
];

const Main: React.FC = () => {
  const size = useWindowSize();
  const [collapsed, setCollapsed] = useState<boolean>(size.width < 768);
  const userPermissions = useAppSelector(
    (state: any) => state?.user?.userInfo?.role.permissions || []
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Update collapsed state based on window size
  useEffect(() => {
    setCollapsed(size.width < 768);
  }, [size.width]);

  // Function to filter menu items based on user permissions
  const filteredMenuItems = useMemo(() => {
    return menuItems
      .filter((item) =>
        GlobalMethod.hasAnyPermission(
          item.permissions,
          GlobalMethod.getUserPermissionName(userPermissions)
        )
      )
      .map((item) => {
        if (item.children) {
          const filteredChildren = item.children.filter((child) =>
            GlobalMethod.hasAnyPermission(
              child.permissions,
              GlobalMethod.getUserPermissionName(userPermissions)
            )
          );
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return null;
        }
        return item;
      })
      .filter(Boolean) as MenuItem[];
  }, [userPermissions]);

  // Determine selected keys for active menu highlighting
  const selectedKeys = useMemo(() => {
    const key = filteredMenuItems.find((item) => item.path === pathname)?.key;
    if (key) return [key];
    // Check for nested paths
    for (const item of filteredMenuItems) {
      if (item.children) {
        const child = item.children.find((child) => child.path === pathname);
        if (child) return [child.key];
      }
    }
    return [];
  }, [pathname, filteredMenuItems]);

  return (
    <Layout>
      <ToastContainer />
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={250}
        breakpoint="lg"
        collapsedWidth={80}
        style={{
          backgroundColor: Colors.primary,
          // height: "100vh",
          overflowY:"scroll",
          position: "fixed",
          zIndex:1000,
          left: 0,
          top: 0,
          bottom: 0,
        }}
        trigger={null} 
      >
        <div className="logo-container p-6 flex justify-center items-center">
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
          {!collapsed && (
            <h3 className="logo-text text-lg text-white font-semibold">
              Sadaka
              <br />
              Digital
            </h3>
          )}
        </div>
        <Menu
          mode="inline"
          theme="dark"

          selectedKeys={selectedKeys}
          className="menu-items text-base text-left"
          onClick={({ key }) => {
            const selectedItem = menuItems.find(
              (item) => item.key === key || item.children?.some((child) => child.key === key)
            );
            if (selectedItem) {
              if (selectedItem.path) {
                navigate(selectedItem.path);
              } else if (selectedItem.children) {
                // Handle navigation for submenu items
                const child = selectedItem.children.find((child) => child.key === key);
                if (child && child.path) {
                  navigate(child.path);
                }
              }
            }
          }}
          style={{ borderRight: 0 }}
        >
          {filteredMenuItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <Menu.SubMenu
                  key={item.key}
                  title={item.label}
                  icon={item.icon}
                  popupClassName="submenu-popup"
                >
                  {item.children.map((child) => (
                    <Menu.Item key={child.key}>
                      {child.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            }
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 80 : 240,
          minHeight: "100vh",
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          toggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        <Content
          className="content-wrapper"
          style={{
            margin: "24px 16px",
            padding: 24,
            background: Colors.bgDarkAddon,
            minHeight: 280,
            overflowY: "auto",
            marginTop: 64, // Height of the fixed header
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{ textAlign: "center" }}
          className="footer-bg"
        >
          Sadaka Digital ©2023 Created by UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
