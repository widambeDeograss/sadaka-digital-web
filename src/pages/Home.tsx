import React from "react";
import { motion } from "framer-motion";
import { UsergroupAddOutlined } from '@ant-design/icons';
import { 
  PiHandsPrayingFill, 
  PiHandshakeBold, 
  PiBuildingApartmentBold, 
  PiChurchBold ,
  PiCardholder
} from "react-icons/pi";
import { 
  GiSwapBag, 
  GiPayMoney, 
} from "react-icons/gi";
import { RiDashboardFill } from "react-icons/ri";
import TopBar from "../components/TopBar.tsx";
import NavCard from "../components/NavCard.tsx";
import { useAppSelector } from "../store/store-hooks.ts";
import NoActivePackageModal from "../Layouts/Admin/NoActivePackage.tsx";

const NavCardData = [
  {
    id: 1,
    name: "Dashboard",
    to: "/dashboard",
    icon: <RiDashboardFill className="text-blue-600" />,
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    name: "Profile",
    to: "/dashboard/profile",
    icon: <PiChurchBold className="text-green-600" />,
    bgColor: "bg-green-50"
  },
  {
    id: 3,
    name: "Wahumini",
    to: "/dashboard/wahumini/waliopo",
    icon: <UsergroupAddOutlined className="text-purple-600" />,
    bgColor: "bg-purple-50"
  },
  {
    id: 4,
    name: "Sadaka",
    to: "/dashboard/sadaka",
    icon: <PiHandsPrayingFill className="text-yellow-600" />,
    bgColor: "bg-yellow-50"
  },
  {
    id: 5,
    name: "Ujenzi",
    to: "/dashboard/michango/iliyopo",
    icon: <PiBuildingApartmentBold className="text-red-600" />,
    bgColor: "bg-red-50"
  },
  {
    id: 6,
    name: "Zaka",
    to: "/dashboard/zaka",
    icon: <GiSwapBag className="text-indigo-600" />,
    bgColor: "bg-indigo-50"
  },
  {
    id: 7,
    name: "Michango",
    to: "/dashboard/michango/iliyopo",
    icon: <PiHandshakeBold className="text-pink-600" />,
    bgColor: "bg-pink-50"
  },
  {
    id: 8,
    name: "Matumizi",
    to: "/dashboard/matumizi",
    icon: <GiPayMoney className="text-yellow-900" />,
    bgColor: "bg-pink-50"
  },
  {
    id: 9,
    name: "Bahasha",
    to: "/dashboard/wahumini/bahasha",
    icon: <PiCardholder className="text-green-900" />,
    bgColor: "bg-pink-50"
  },

];

const Home: React.FC = () => {
  const activePackage = useAppSelector((state: any) => state.sp?.active_package?.is_active);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="Home min-h-screen p-10 border-white mb-2"
    >
      <TopBar />
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="container mx-auto mt-10"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {NavCardData.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="transform transition-all duration-300"
            >
              <NavCard 
                name={item.name}
                icon={React.cloneElement(item.icon, { 
                  className: "w-10 h-10 " + item.icon.props.className 
                })}
                id={item.id}
                to={item.to}
                // bgColor={item.bgColor}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {!activePackage && <NoActivePackageModal />}
    </motion.div>
  );
};

export default Home;