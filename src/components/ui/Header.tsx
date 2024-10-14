import React from "react";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import NotificationDropdown from "./NotificationDropDown";
import Profile from "./Profile";
import { FiSearch } from "react-icons/fi";
import { Input } from "antd";

interface HeaderProps {
  toggle: () => void;
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggle, collapsed }) => {
  return (
    <header
      id="page-topbar"
      className="py-3 text-white shadow-md "
      style={{
        background: "#fff",
        position: "static",
        width: "100%",
        zIndex: 900,
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <div className="flex items-center justify-between bg-white w-full mx-auto">
        {/* Hamburger Button */}
        <div className="flex gap-3">
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

          {/* Search Bar */}
          <Input
            placeholder="Search..."
            prefix={<FiSearch />}
            style={{ width: 200, marginRight: 16 }}
            allowClear
            aria-label="Search"
          />
        </div>

        {/* Right Section: Notifications and Profile */}
        <div className="flex items-center  space-x-4">
          <NotificationDropdown />
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;
