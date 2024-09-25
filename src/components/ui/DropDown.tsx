import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { NavLink } from "react-router-dom";

// Define the interface for the items in the dropdown
interface DropdownItem {
  label: any;
  link?: string;
  hasDivider?: boolean;
  icon?: ReactNode;
}

// Define the props for the Dropdown component
interface DropdownProps {
  label?: any;
  wrapperClass?: string;
  labelClass?: string;
  children?: ReactNode;
  classMenuItems?: string;
  items?: DropdownItem[];
  classItem?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label = "Dropdown",
  wrapperClass = "inline-block",
  labelClass = "label-class-custom",
  children,
  classMenuItems = "mt-2 w-[220px]",
  items = [
    {
      label: "Action",
      link: "#",
    },
    {
      label: "Another action",
      link: "#",
    },
    {
      label: "Something else here",
      link: "#",
    },
  ],
  classItem = "px-4 py-2",
  className = "",
}) => {
  return (
    <div className={`relative ${wrapperClass}`}>
      <Menu as="div" className={`block w-full ${className}`}>
        <Menu.Button className="block w-full">
          <div className={labelClass}>{label}</div>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute ltr:right-0 rtl:left-0 origin-top-right border border-gray-10
            rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-base z-[9999]
            ${classMenuItems}`}
          >
            <div>
              {children
                ? children
                : items?.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-300 dark:bg-opacity-50"
                              : "text-gray-600 dark:text-gray-300"
                          } block ${
                            item.hasDivider
                              ? "border-t border-gray-10 dark:border-gray-700"
                              : ""
                          }`}
                        >
                          {item.link ? (
                            <NavLink
                              to={item.link}
                              className={`block ${classItem}`}
                            >
                              {item.icon ? (
                                <div className="flex items-center">
                                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                                    {/* <Icon icon={item.icon} /> */}
                                  </span>
                                  <span className="block text-sm">
                                    {item.label}
                                  </span>
                                </div>
                              ) : (
                                <span className="block text-sm">
                                  {item.label}
                                </span>
                              )}
                            </NavLink>
                          ) : (
                            <div
                              className={`block cursor-pointer ${classItem}`}
                            >
                              {item.icon ? (
                                <div className="flex items-center">
                                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                                    {/* <Icon icon={item.icon} /> */}
                                  </span>
                                  <span className="block text-sm">
                                    {item.label}
                                  </span>
                                </div>
                              ) : (
                                <span className="block text-sm">
                                  {item.label}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Dropdown;
