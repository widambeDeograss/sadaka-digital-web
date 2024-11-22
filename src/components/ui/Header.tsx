import React, { useState } from 'react';
import { Input, Dropdown, Badge, Avatar, Menu, AutoComplete } from 'antd';
import { ChevronsLeft, ChevronsRight, Bell, User } from 'lucide-react';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/store-hooks';
import { useNavigate } from 'react-router-dom';

// Predefined searches with their corresponding routes
const searchSuggestions = [
  {
    category: "Dashboard",
    items: [
      { title: "Analytics Overview", route: "/analytics", description: "View your analytics dashboard" },
      { title: "Performance Metrics", route: "/metrics", description: "Check performance statistics" },
    ]
  },
  {
    category: "Management",
    items: [
      { title: "User Management", route: "/users", description: "Manage system users" },
      { title: "Settings", route: "/settings", description: "System configuration" },
      { title: "Reports", route: "/reports", description: "Generate reports" },
    ]
  },
  {
    category: "Help",
    items: [
      { title: "Documentation", route: "/docs", description: "View system documentation" },
      { title: "Support", route: "/support", description: "Get help and support" },
    ]
  }
];

// Format search options for AutoComplete
const searchOptions = searchSuggestions.map(group => ({
  label: group.category,
  options: group.items.map(item => ({
    value: item.title,
    label: (
      <div className="flex flex-col">
        <span>{item.title}</span>
        <span className="text-gray-400 text-sm">{item.description}</span>
      </div>
    ),
    route: item.route
  }))
}));

interface HeaderProps {
  toggle: () => void;
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggle, collapsed }) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const userDtl = useAppSelector((state:any) => state?.user?.userInfo)
  const logout = () => {
    localStorage.clear()
    window.location.reload();
}

  const handleSearchSelect = (value: string, option: any) => {
    // Navigate to the selected route
    console.log('Navigate to:', option.route);
    setSearchValue('');
  };

  // Profile menu items
  const profileMenu = (
    <Menu>
         <Menu.Item key="1" disabled>
        <div className="text-sm text-gray-800 dark:text-gray-200">
          <strong>{userDtl?.username}</strong>
          <div>{userDtl?.role.role_name}</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" icon={<UserOutlined />}
       onClick={() => navigate('/dashboard/profile')}
      >
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}
      onClick={() => navigate('/dashboard/profile')}
      >
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger
      onClick={() => logout()}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  // Notifications menu
  const notificationsMenu = (
    <Menu>
      <Menu.Item key="notification1">
        <div className="w-64">
          <div className="font-medium">New message from Alice</div>
          <div className="text-gray-400 text-sm">2 minutes ago</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="notification2">
        <div className="w-64">
          <div className="font-medium">System update available</div>
          <div className="text-gray-400 text-sm">1 hour ago</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="notification3">
        <div className="w-64">
          <div className="font-medium">Your report is ready</div>
          <div className="text-gray-400 text-sm">3 hours ago</div>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-white"
      style={{ 
        boxShadow: '0 2px 8px #f0f1f2',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
      <button
            type="button"
            onClick={toggle}
            className="inline-flex ml-4 justify-center items-center p-2 text-gray-300 transition-all duration-75 ease-linear bg-blue-gray-300 rounded-md hover:bg-blue-gray-300"
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <ChevronsLeft className="w-5 h-5" />
            )}
          </button>

        <AutoComplete
          className="w-64 hidden md:block"
          value={searchValue}
          options={searchOptions}
          onChange={(value) => setSearchValue(value)}
          onSelect={handleSearchSelect}
          placeholder="Search..."
          style={{ marginLeft: 16 }}
        >
          <Input.Search 
            placeholder="Search..." 
            className="rounded-lg"
          />
        </AutoComplete>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Dropdown 
          overlay={notificationsMenu} 
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={3} size="small">
            <div className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
          </Badge>
        </Dropdown>

        <Dropdown 
          overlay={profileMenu} 
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
            <Avatar 
              size="default"
              icon={<UserOutlined />} 
              className="bg-blue-500"
            />
            <span className="hidden md:inline">{userDtl?.username}</span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;