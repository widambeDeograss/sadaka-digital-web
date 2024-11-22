import { Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/store-hooks';
import { useNavigate } from 'react-router-dom';



const ProfileDropdown = () => {
  const userDtl = useAppSelector((state:any) => state?.user?.userInfo);
  const navigate =  useNavigate();
  const logout = () => {
    localStorage.clear()
    window.location.reload();
}

  const menu = (
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
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger
      onClick={() => logout()}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottom" className='relative'>
      <div className=" cursor-pointer ">
        <Avatar size="large" icon={<UserOutlined />} />
        {/* <span className="ml-2 hidden sm:hidden lg:block md:hidden">{userDtl?.username}</span> */}
      </div>
    </Dropdown>
  );
};

export default ProfileDropdown;
