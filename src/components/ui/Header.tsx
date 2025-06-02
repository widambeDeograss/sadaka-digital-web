import React, { useState } from 'react';
import { Input, Dropdown, Avatar, Menu, AutoComplete, Badge, Button } from 'antd';
import { ChevronsLeft, ChevronsRight, Bell, Search, Moon, Sun } from 'lucide-react';
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
      <div className="flex flex-col py-2">
        <span className="font-medium text-gray-900">{item.title}</span>
        <span className="text-gray-500 text-sm">{item.description}</span>
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
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const userDtl = useAppSelector((state: any) => state?.user?.userInfo);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSearchSelect = (_value: string, option: any) => {
    console.log('Navigate to:', option.route);
    setSearchValue('');
  };

  // Profile menu items
  const profileMenu = (
    <Menu
      style={{
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        minWidth: '220px',
      }}
    >
      <Menu.Item key="1" disabled style={{ padding: '16px' }}>
        <div className="text-center">
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #152033 0%, #3E5C76 100%)',
              marginBottom: '8px'
            }}
          />
          <div className="font-semibold text-gray-800">{userDtl?.username}</div>
          <div className="text-sm text-gray-500">{userDtl?.role.role_name}</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate('/dashboard/profile')}
        style={{ borderRadius: '8px', margin: '4px 8px' }}
      >
        Profile Settings
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
        onClick={() => navigate('/dashboard/profile')}
        style={{ borderRadius: '8px', margin: '4px 8px' }}
      >
        Account Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        danger
        onClick={() => logout()}
        style={{ borderRadius: '8px', margin: '4px 8px' }}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );

  // Notifications menu
  const notificationsMenu = (
    <Menu
      style={{
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        minWidth: '300px',
      }}
    >
      <Menu.Item key="header" disabled style={{ padding: '16px 20px 8px' }}>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Notifications</span>
          <Badge count={3} />
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="notification1" style={{ padding: '12px 20px' }}>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <div className="font-medium text-gray-900">New sadaka contribution</div>
            <div className="text-gray-500 text-sm">From Mwalimu John - 2 minutes ago</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="notification2" style={{ padding: '12px 20px' }}>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <div className="font-medium text-gray-900">Monthly report ready</div>
            <div className="text-gray-500 text-sm">Financial summary - 1 hour ago</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item key="notification3" style={{ padding: '12px 20px' }}>
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <div className="font-medium text-gray-900">System maintenance</div>
            <div className="text-gray-500 text-sm">Scheduled for tonight - 3 hours ago</div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="view-all" style={{ textAlign: 'center', padding: '12px' }}>
        <Button type="link" className="text-blue-600 font-medium">
          View All Notifications
        </Button>
      </Menu.Item>
    </Menu>
  );

  const headerStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '0 32px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderRadius: '0 0 20px 20px',
    margin: '0 20px',
  };

  return (
    <header style={headerStyle}>
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Button
          type="text"
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
           background: 'linear-gradient(135deg, #152033 0%, #3E5C76 100%)',
            border: 'none',
            color: 'white',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          {collapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5" />
          )}
        </Button>

        <div className="hidden md:block">
          <AutoComplete
            value={searchValue}
            options={searchOptions}
            onChange={(value) => setSearchValue(value)}
            onSelect={handleSearchSelect}
            style={{ width: '350px' }}
            placeholder="Search anything..."
          >
            <Input
              size="large"
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              }}
            />
          </AutoComplete>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
     

        {/* Notifications */}
        <Dropdown
          overlay={notificationsMenu}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={3} size="small">
            <Button
              type="text"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: '#666',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Bell className="w-4 h-4" />
            </Button>
          </Badge>
        </Dropdown>

        {/* Profile Dropdown */}
        <Dropdown
          overlay={profileMenu}
          trigger={['click']}
          placement="bottomRight"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{
              background: 'linear-gradient(135deg, #152033 0%, #3E5C76 100%)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
            />
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-gray-800">
                {userDtl?.username}
              </div>
              <div className="text-xs text-gray-500">
                {userDtl?.role.role_name}
              </div>
            </div>
          </div>
        </Dropdown>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden fixed top-20 left-4 right-4 z-50">
        <AutoComplete
          value={searchValue}
          options={searchOptions}
          onChange={(value) => setSearchValue(value)}
          onSelect={handleSearchSelect}
          style={{ width: '100%' }}
          placeholder="Search anything..."
        >
          <Input
            size="large"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            style={{
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          />
        </AutoComplete>
      </div>
    </header>
  );
};

export default Header;