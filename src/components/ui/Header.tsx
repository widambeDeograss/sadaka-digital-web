import React from 'react';
import { ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropDown';
import Profile from './Profile';

function makeInitialsFromName(name: string) {
    const initials = name.match(/\b\w/g) || [];
    const result = initials.map((initial: string) => initial.toUpperCase()).join('');
    return result;
}

const Header = () => {
    const ProfileLabel = ({ sticky }: any) => {
        return (
            <span className="user-img avatar-letter">
                <div className="avatar">
                    <span className="status online online-dot" />
                    {makeInitialsFromName(`Deo Widambe`)}
                </div>
            </span>
        );
    };

    return (
        <React.Fragment>
            <header id="page-topbar" className="py-3  text-white shadow-md">
                <div className="layout-width mx-auto">
                    <div className="flex items-center justify-between px-4 mx-auto">
                        {/* Hamburger Button */}
                        <button
                            type="button"
                            className="inline-flex relative justify-center items-center p-2 text-gray-300 transition-all duration-75 ease-linear bg-blue-gray-300 rounded-md hover:bg-blue-gray-300"
                        >
                            <ChevronsLeft className="w-5 h-5" />
                            <ChevronsRight className="hidden w-5 h-5" />
                        </button>

                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                className="py-2 pr-4 text-sm text-gray-900 bg-white border rounded pl-8 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[300px]"
                                placeholder="Search for ..."
                                autoComplete="off"
                            />
                            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={17} />
                        </div>

                        {/* Right Section: Notifications and Profile */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Dropdown */}
                            <div >
                                <NotificationDropdown />
                            </div>

                            {/* Profile Dropdown */}
                            <div>
                                <Profile />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;
