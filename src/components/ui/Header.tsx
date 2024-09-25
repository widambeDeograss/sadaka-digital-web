import React, { useEffect } from 'react';
import { ChevronsLeft, ChevronsRight, Gem, LogOut, Mail, MessagesSquare, Search, Settings, ShoppingCart, User2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import NotificationDropdown from './NotificationDropDown';
import Profile from './Profile';


function  makeInitialsFromName(name:string) {
    const initials = name.match(/\b\w/g) || [];
    const result = initials.map((initial:string) => initial.toUpperCase()).join('');
    return result;
}

const Header = () => {

    const dispatch = useDispatch<any>();


 



    const ProfileLabel = ({ sticky }:any) => {
        return (

            <span className="user-img avatar-letter">
                <div className="avatar">
                  <span className="status online online-dot" />
                    {makeInitialsFromName(
                        `Deo Widambe`
                    )}
                </div>
              </span>

        );
    };

    return (
        <React.Fragment>
            <header id="page-topbar" className="py-3">
                <div className="layout-width">
                    <div className="flex items-center px-4 mx-auto bg-topbar border-b-2   ">
                        <div className="flex items-center w-full mx-auto group-data-">

                            <button
                                type="button"
                                className="inline-flex relative justify-center items-center p-0 text-topbar-item transition-all size-[37.5px] duration-75 ease-linear bg-topbar rounded-md btn hover:bg-slate-100 " id="topnav-hamburger-icon">
                                <ChevronsLeft className="w-5 h-5 text-black" />
                                <ChevronsRight className="hidden w-5 h-5 text-black" />
                            </button>

                        <div className=" ">
                                <input type="text" className="py-2 pr-4 text-sm text-topbar-item bg-topbar border border-topbar-border rounded pl-8 placeholder:text-slate-400 form-control focus-visible:outline-0 min-w-[300px] bg-white" placeholder="Search for ..." autoComplete="off" />
                                <Search className="inline-block size-2 absolute left-2.5 top-2.5 text-topbar-item  text-black" size={17}/>
                            </div>

                            <div className="flex ms-auto">

                                {/* <NotificationDropdown />
                                <Profile/> */}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;
