// src/pages/Main/Main.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Badge } from "antd";
import {
  PiChurchBold,
  PiHandsPrayingFill,
  PiHandshakeBold,
  PiUsersFourBold,
} from "react-icons/pi";
import { GiSwapBag, GiTakeMyMoney, GiPayMoney } from "react-icons/gi";
import { RiDashboardFill, RiExportLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/church.png";
import Header from "../../components/ui/Header";
import { useAppSelector } from "../../store/store-hooks";
import { GlobalMethod } from "../../helpers/GlobalMethods";
import { ToastContainer } from "react-toastify";
import useWindowSize from "../../hooks/useWindowSize";
import NoActivePackageModal from "../Admin/NoActivePackage";

const { Content, Footer, Sider } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permissions: string[];
  children?: MenuItem[];
  badge?: number;
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
      icon: <GiSwapBag style={{ fontSize: "14px", fontWeight: "bold" }} />,
      permissions:['VIEW_ZAKA'],
      children: [
          { key: "jimbo", label: "Mavuno jimbo", path: "/dashboard/mavuno/jimbo",  permissions:['VIEW_ZAKA'], },
          { key: "parokia", label: "Mavuno parokia", path: "/dashboard/mavuno/parokia",  permissions:['VIEW_ZAKA'], },
      ],
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
  const activePackage = useAppSelector((state: any) => state.sp.active_package);
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

  // Custom styles for the enhanced sidebar
  const siderStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #152033 0%, #3E5C76 100%)',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
    borderRadius: collapsed ? '0 20px 20px 0' : '0 25px 25px 0',
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    bottom: 0,
    overflowY: 'auto',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  };

  const contentStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '20px',
    margin: '20px',
    padding: '30px',
    minHeight: 'calc(100vh - 180px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <ToastContainer />
      
      {/* Enhanced Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        width={280}
        breakpoint="lg"
        collapsedWidth={80}
        style={siderStyle}
        trigger={null}
      >
        {/* Logo Section with Animation */}
        <div 
          className="logo-container" 
          style={{
            padding: collapsed ? '20px 10px' : '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '20px',
            transition: 'all 0.3s ease',
          }}
        >
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '10px',
              backdropFilter: 'blur(10px)',
              transform: collapsed ? 'scale(0.8)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <img 
              src={logo} 
              alt="Logo" 
              style={{
                height: collapsed ? '35px' : '45px',
                width: collapsed ? '35px' : '45px',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
          {!collapsed && (
            <div style={{ marginLeft: '15px', color: 'white' }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700',
                background: 'linear-gradient(45deg, #fff, #e0e6ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.2px'
              }}>
                BMC MAKABE
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                opacity: 0.8,
                fontWeight: '300'
              }}>
                Digital Platform
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Menu */}
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '15px',
            fontWeight: '500',
          textAlign: 'left',
          }}
          className="enhanced-menu"
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
          {filteredMenuItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <Menu.SubMenu
                  key={item.key}
                  title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && !collapsed && (
                        <Badge count={item.badge} size="small" style={{ marginLeft: 'auto' }} />
                      )}
                    </span>
                  }
                  style={{
                    margin: '4px 12px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  {item.children.map((child) => (
                    <Menu.Item 
                      key={child.key}
                      style={{
                        margin: '2px 0',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ paddingLeft: '8px' }}>{child.label}</span>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            }
            return (
              <Menu.Item 
                key={item.key} 
                icon={item.icon}
                style={{
                  margin: '4px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '45px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && !collapsed && (
                    <Badge count={item.badge} size="small" />
                  )}
                </span>
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          minHeight: '100vh',
          transition: 'margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          backgroundColor: 'transparent',
        }}
      >
        <Header
          toggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
        
        {/* Enhanced Content Area */}
        <Content style={contentStyle}>
          <Outlet />
        </Content>

        {/* Enhanced Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: 'transparent',
            color: '#666',
            fontSize: '13px',
            padding: '20px',
            fontWeight: '500',
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '15px',
            margin: '0 20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}>
            BMC MAKABE DIGITAL ©{new Date().getFullYear()} | Crafted with by VM Solutions
          </div>
        </Footer>
      </Layout>

      {/* Modal */}
      {!activePackage.is_active && <NoActivePackageModal />}

      {/* @ts-ignore */}
      <style jsx>{`
        .enhanced-menu .ant-menu-item:hover,
        .enhanced-menu .ant-menu-submenu-title:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(5px);
        }
        
        .enhanced-menu .ant-menu-item-selected {
          background: rgba(255, 255, 255, 0.15) !important;
          border-left: 4px solid #ffffff;
          transform: translateX(5px);
        }
        
        .enhanced-menu .ant-menu-submenu-selected .ant-menu-submenu-title {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .enhanced-menu .ant-menu-item,
        .enhanced-menu .ant-menu-submenu-title {
          color: rgba(255, 255, 255, 0.9) !important;
          transition: all 0.2s ease !important;
        }
        
        .enhanced-menu .ant-menu-submenu-arrow {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .enhanced-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .enhanced-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .enhanced-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .enhanced-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </Layout>
  );
};

export default Main;