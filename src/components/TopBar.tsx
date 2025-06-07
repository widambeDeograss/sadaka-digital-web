import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, Church, Menu, Search, X, LogOut } from "lucide-react";
import { useAppSelector } from "../store/store-hooks";

// Enhanced TopBar Component
const TopBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const church = useAppSelector((state:any) =>  state?.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);

console.log(user);

const logout = () => {
  localStorage.clear()
  window.location.reload();
}


  // Get user initials for avatar
  const getUserInitials = (name:string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-4 md:mb-8"
      >
        {/* Backdrop shadow */}
        <div className="absolute top-1 md:top-2 left-1 md:left-2 bg-[#152033]/20 w-full h-16 md:h-20 rounded-xl md:rounded-2xl blur-sm"></div>
        
        {/* Main header */}
        <div className="relative z-10 flex items-center justify-between bg-gradient-to-r from-[#152033] via-[#2a3d52] to-[#3E5C76] w-full h-16 md:h-20 px-3 md:px-6 rounded-xl md:rounded-2xl shadow-2xl border border-white/10">
          
          {/* Logo section */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 md:space-x-3 bg-[#152033]/50 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl border border-white/10"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md md:rounded-lg flex items-center justify-center">
              <Church className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h3 className="text-white font-bold text-xs md:text-sm leading-tight">
                Sadaka
                <br />
                <span className="text-blue-200 text-xs">Digital</span>
              </h3>
            </div>
          </motion.div>

          {/* Church name - center (hidden on very small screens) */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex flex-1 text-center px-4"
          >
            <div className="w-full">
              <h2 className="text-white font-bold text-lg xl:text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent truncate">
                {church?.church_name}
              </h2>
              <p className="text-blue-200 text-xs mt-1">Management System</p>
            </div>
          </motion.div>

          {/* Right section */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Search button - hidden on small screens */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden md:flex p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
            >
              <Search className="w-5 h-5 text-white" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-1.5 md:p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
            >
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 md:space-x-2 bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/10 cursor-pointer"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-md md:rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm font-bold">
                    {getUserInitials(user?.username)}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-white text-sm font-medium block truncate max-w-20">
                    {user?.username || "User"}
                  </span>
                  <span className="text-blue-200 text-xs block truncate max-w-20">
                    {user?.role?.role_name || "Member"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="text-white text-sm font-medium">
                    {getUserInitials(user?.username)}
                  </span>
                </div>
                <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 text-white/70 transition-transform duration-200 ${isProfileOpen ? 'rotate-90' : ''}`} />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20"
                    >
                      {/* User info */}
                      <div className="p-4 bg-gradient-to-r from-[#152033] to-[#3E5C76] text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {getUserInitials(user?.username)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user?.username|| "User Name"}</h3>
                            <p className="text-blue-200 text-sm">{user?.email || "user@email.com"}</p>
                            <p className="text-blue-300 text-xs">{user?.role?.role_name || "Member"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
               
                        <hr className="my-2" />
                        <button className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                         onClick={() => logout()}
                         
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
            >
              {isMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile menu header */}
              <div className="bg-gradient-to-r from-[#152033] to-[#3E5C76] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Church name in mobile menu */}
                <div className="text-center">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {church?.church_name}
                  </h3>
                  <p className="text-blue-200 text-sm">Management System</p>
                </div>
              </div>

          

              {/* Mobile menu footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                <button className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                 onClick={() => logout()}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
