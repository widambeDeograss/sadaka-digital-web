import React from "react";
import { Dropdown, Badge, Menu } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const notifications: any[] = [
  // Add your notifications data here
  { title: "New user registered", time: "2 mins ago", status: "blue" },
  { title: "Server restarted", time: "1 hour ago", status: "red" },
  { title: "Database backup completed", time: "3 hours ago", status: "green" },
];

const NotificationDropdown = () => {
  const notificationMenu = (
    <Menu>
      <Menu.Item key="header" disabled>
        <div className="font-semibold text-gray-800 ">
          Recent Notifications
        </div>
      </Menu.Item>

      {/* If there are no notifications */}
      {notifications.length === 0 ? (
        <Menu.Item key="empty" disabled>
          <span className="text-gray-500">No notifications available</span>
        </Menu.Item>
      ) : (
        notifications.map((item, i) => (
          <Menu.Item key={i}>
            <Link to="/notifications">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-block h-3 w-3 rounded-full ${
                    item.status === "blue"
                      ? "bg-blue-500"
                      : item.status === "red"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                ></span>
                <div className="text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: item.title }} />
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
            </Link>
          </Menu.Item>
        ))
      )}

      <Menu.Item key="footer" disabled>
        <div className="text-center">
          <Link to="/notifications" className="text-blue-500 hover:underline">
            View all
          </Link>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={notificationMenu}
      trigger={["click"]}
      placement="bottomRight"
      className="cursor-pointer"
    >
      <Badge count={notifications.length} overflowCount={9} offset={[-5, 5]}>
        <BellOutlined style={{ fontSize: "25px", color: "#595959" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
