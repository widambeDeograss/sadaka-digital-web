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
import { PiHandsPrayingFill, PiHandshakeBold  } from "react-icons/pi";
import { GiSwapBag, GiTakeMyMoney, GiPayMoney  } from "react-icons/gi";
import { RiDashboardFill } from "react-icons/ri";
// import Offer
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import { Colors } from "../../Constants/Colors";
import logo from "../../assets/church.png";
import Header from "../../components/ui/Header";

const { Content, Footer, Sider } = Layout;
const { Search } = Input;

const menuItems = [
    {
        key: "home",
        label: "Home",
        icon: <HomeOutlined style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/",
    },
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <RiDashboardFill style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/dashboard/home",
    },
    {
        key: "sadaka",
        label: "Sadaka",
        icon: <PiHandsPrayingFill style={{  fontWeight: "bold"  ,fontSize: "14px",}} />,
        path: "/dashboard/sadaka"
    },
    {
        key: "zaka",
        label: "Zaka",
        icon: <GiSwapBag style={{ fontSize: "14px", fontWeight: "bold",  }} />,
        path: "/dashboard/zaka",
    },
    {
        key: "michango",
        label: "Michango",
        icon: <PiHandshakeBold style={{ fontSize: "14px", fontWeight: "bold" }} />,
        children: [
            { key: "iliyopo", label: "Michango iliyopo", path: "/dashboard/michango/iliyopo" },
            { key: "ongeza", label: "Ongeza Michango", path: "/dashboard/michango/ongeza" },
        ],
    },
    {
        key: "wahumini",
        label: "Wahumini",
        icon: <UsergroupAddOutlined style={{ fontSize: "14px", fontWeight: "bold" }} />,
        children: [
            { key: "waliopo", label: "Wahhumini waliopo", path: "/dashboard/wahumini/waliopo" },
            { key: "ongeza", label: "Ongeza Muhumini", path: "/dashboard/wahumini/ongeza" },
        ],

    },
    {
        key: "ahadi",
        label: "Ahadi",
        icon: <GiPayMoney  style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/dashboard/ahadi",
    },
    {
        key: "matumizi",
        label: "Matumizi",
        icon: <GiTakeMyMoney style={{ fontSize: "14px", fontWeight: "bold" }} />,
        path: "/dashboard/matumizi",
    },
];
const Main: React.FC = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 680);
  const { pathname } = useLocation();
    const navigate = useNavigate();

  return (
    <Layout className="">
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
              onSelect={({ key }) => navigate(key)}
              className="text-lg text-left "
          >
              {menuItems.map((item) => {
                  if (item.children) {
                      return (
                          <Menu.SubMenu
                              key={item.path}
                              title={item.label}
                              style={{fontSize:"small"}}
                              icon={item.icon}
                          >
                              {item.children.map((child) => (
                                  <Menu.Item key={child.path}>
                                      <span  style={{fontSize:"small"}}>{child.label}</span>

                                  </Menu.Item>
                              ))}
                          </Menu.SubMenu>
                      );
                  } else {
                      return (
                          <Menu.Item key={item.path} icon={item.icon}>
                              <span style={{fontSize:"small"}}>{item.label}</span>
                          </Menu.Item>
                      );
                  }
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
