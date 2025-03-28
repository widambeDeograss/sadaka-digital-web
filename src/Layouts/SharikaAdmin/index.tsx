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
import { GiSwapBag, GiTakeMyMoney, GiPayMoney,  } from "react-icons/gi";
import { RiDashboardFill, RiExportLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Colors } from "../../Constants/Colors";
import logo from "../../assets/church.png";
import Header from "../../components/ui/Header";
import { useAppSelector } from "../../store/store-hooks";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { ToastContainer } from "react-toastify";
import useWindowSize from "../../hooks/useWindowSize";
import NoActivePackageModal from "../Admin/NoActivePackage";
import { motion } from "framer-motion";

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
      key: "mavuno",
      label: "Mavuno",
      icon: <GiSwapBag style={{ fontSize: "14px", fontWeight: "bold",  }} />,
      path: "/dashboard/mavuno",
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
      permissions:['VIEW_WAHUMINI'],
      children: [
          { key: "list", label: "Users", path: "/dashboard/users/list",  permissions:['ADD_USER'], },
          { key: "spList", label: "Users", path: "/dashboard/sp-users/list",  permissions:['MANAGE_CHURCH_LEADERS'], },
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
      ],
  },
  {
      key: "package",
      label: "Packages",
      icon: <PiChurchBold style={{ fontSize: "14px", fontWeight: "bold" }} />,
      permissions:["MANAGE_SPS"],
      children: [
          { key: "package", label: "Sp Package list", path: "/dashboard/packages",  permissions:["MANAGE_SPS"], },
          // { key: "roles", label: "roles", path: "/dashboard/users/roles" },
          // { key: "permissions", label: "Permissions", path: "/dashboard/users/permissions" },
      ],
  },
  {
      key: "wahumini",
      label: "Waumini",
      icon: <UsergroupAddOutlined style={{ fontSize: "14px", fontWeight: "bold" }} />,
      permissions:['VIEW_WAHUMINI'],
      children: [
          { key: "waliopo", label: "Waumini waliopo", path: "/dashboard/wahumini/waliopo", permissions:['VIEW_WAHUMINI'], },
          { key: "kanda", label: "Jumuiya", path: "/dashboard/wahumini/kanda-jumuiya", permissions:['VIEW_WAHUMINI'], },
          { key: "ongezaWahumini", label: "Ongeza Muumini", path: "/dashboard/wahumini/ongeza", permissions:['VIEW_WAHUMINI'], },
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
    key: "reports",
    label: "Reports",
    icon: <RiExportLine style={{ fontSize: "14px", fontWeight: "bold" }} />,
    permissions:['MANAGE_REPORTS'],
    children: [
        { key: "wahumini-statement", label: "Waumini", path: "/dashboard/reports/mhumini-statement", permissions:['MANAGE_REPORTS_MUUMINI'], },
        { key: "revenue", label: "Revenue", path: "/dashboard/reports/revenue-statement", permissions:['MANAGE_REPORTS_REVENUE'], },
        { key: "expences", label: "Expenses", path: "/dashboard/reports/expenses", permissions:['MANAGE_REPORTS_EXPENSES'], },
        // { key: "bahasha", label: "Bahasha", path: "/dashboard/wahumini/bahasha", permissions:['VIEW_WAHUMINI'], },
    ],

},
  {
    key: "settings",
    label: "Settings",
    icon: <FiSettings style={{ fontSize: "14px", fontWeight: "bold" }} />,
    permissions:['MANAGE_SETTINGS'],
    children: [
        { key: "payment", label: "Payment types", path: "/dashboard/settings/payment-type", permissions:['VIEW_WAHUMINI'], },
        { key: "expenditure", label: "Expenditure Category", path: "/dashboard/settings/expense-categories", permissions:['VIEW_WAHUMINI'], },
        { key: "sytemPackage", label: "Package list", path: "/dashboard/settings/system-package",  permissions:["MANAGE_PACKAGE"], },
        { key: "sadaka-type", label: "Sadaka", path: "/dashboard/sadaka-type", permissions:['VIEW_WAHUMINI'], },
    ],

},
];

const Main: React.FC = () => {
  const size = useWindowSize();
  const [collapsed, setCollapsed] = useState<boolean>(size.width < 768);
  const userPermissions = useAppSelector(
    (state: any) => state?.user?.userInfo?.role.permissions || []
  );
  const activePackage =  useAppSelector((state:any) =>  state.sp.active_package)
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

  <Layout className="bg-transparent">
  <ToastContainer />

    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
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
        background: "linear-gradient(to bottom right, #152033, #3E5C76)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
      }}
      // className="fixed left-0 top-0 bottom-0 z-50 bg-gradient-to-br from-blue-600 to-purple-700 shadow-2xl overflow-y-scroll"
    >
      <div className="logo-container p-6 flex justify-center items-center">
        <motion.img 
          src={logo} 
          alt="Logo" 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="h-10 w-10 mr-2 rounded-full shadow-lg" 
        />
        {!collapsed && (
          <h3 className="logo-text text-lg text-white font-bold">
            Sadaka Digital
          </h3>
        )}
      </div>
      <Menu
        mode="inline"
        theme="dark"
        forceSubMenuRender={true}
        selectedKeys={selectedKeys}
        className="bg-transparent border-none menu-items text-base text-left"
        onClick={({ key }) => {
          const selectedItem = menuItems.find(
            (item) => item.key === key || item.children?.some((child) => child.key === key)
          );
          if (selectedItem) {
            if (selectedItem.path) {
              navigate(selectedItem.path);
            } else if (selectedItem.children) {
              const child = selectedItem.children.find((child) => child.key === key);
              if (child && child.path) {
                navigate(child.path);
              }
            }
          }
        }}
      >
        {filteredMenuItems.map((item) => 
          item.children && item.children.length > 0 ? (
            <Menu.SubMenu
              key={item.key}
              title={item.label}
              icon={item.icon}
              className="hover:bg-white/10 transition-all duration-300"
            >
              {item.children.map((child) => (
                <Menu.Item 
                  key={child.key} 
                  className="hover:bg-white/20 transition-all duration-300"
                >
                  {child.label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item 
              key={item.key} 
              icon={item.icon}
              className="hover:bg-white/10 transition-all duration-300"
            >
              {item.label}
            </Menu.Item>
          )
        )}
      </Menu>
    </Sider>
    
    <Layout
      className="site-layout"
      style={{
        marginLeft: collapsed ? 80 : 250,
        transition: "margin-left 0.2s",
      }}
    >
      <Header
        toggle={() => setCollapsed(!collapsed)}
        collapsed={collapsed}
      />
      
      <Content 
        className="rounded-3xl shadow-sm m-4 "
        style={{ 
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        <Outlet />
      </Content>
      
      <Footer 
        className="text-center bg-transparent text-gray-600"
      >
        Sadaka Digital ©{new Date().getFullYear()} Created by EVD solutions
      </Footer>
    </Layout>

    {!activePackage.is_active && <NoActivePackageModal />}
  </Layout>

  );
};

export default Main;
