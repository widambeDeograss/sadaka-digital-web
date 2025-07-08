import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavCardProps {
    id: number;
    name: string;
    icon: JSX.Element;
    to: string;
    bgColor?: string;
    description?: string;
}


// Enhanced NavCard Component
const NavCard = ({ name, icon, id, to, bgColor = "bg-gradient-to-br  from-[#152033] to-[#3E5C76]", description="data " }:NavCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: id * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative cursor-pointer group"
      onClick={() => navigate(to)}
    >
      {/* Card shadow */}
      <div className={`absolute inset-0 ${bgColor} rounded-2xl transform translate-y-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
      
      {/* Main card */}
      <div className={`relative ${bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300`}>
        
        {/* Icon container */}
        <motion.div 
          animate={{ rotate: isHovered ? 10 : 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 relative"
        >
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            {React.cloneElement(icon, {
              className: "w-8 h-8 " + icon.props.className,
            })}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-tl from-white/30 to-transparent rounded-full"></div>
        </motion.div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-bold text-white text-lg group-hover:text-gray-900 transition-colors">
            {name}
          </h3>
          
          <AnimatePresence>
            {isHovered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 text-sm overflow-hidden"
              >
                {description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Arrow indicator */}
        <motion.div
          animate={{ 
            x: isHovered ? 8 : 0,
            opacity: isHovered ? 1 : 0.5 
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.div>

        {/* Hover glow effect */}
        <motion.div
          animate={{ 
            opacity: isHovered ? 0.1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-2xl pointer-events-none"
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default NavCard
