import React from 'react';
import { Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const user = {
  name: 'Deo Widambe',
  role: 'Church pastor'
};

const ProfileDropdown = () => {

  const menu = (
    <Menu>
      <Menu.Item key="1" disabled>
        <div className="text-sm text-gray-800 dark:text-gray-200">
          <strong>{user.name}</strong>
          <div>{user.role}</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div className="flex items-center cursor-pointer text-gray-800">
        <Avatar size="default" icon={<UserOutlined />} />
        <span className="ml-2">{user.name}</span>
      </div>
    </Dropdown>
  );
};

export default ProfileDropdown;
