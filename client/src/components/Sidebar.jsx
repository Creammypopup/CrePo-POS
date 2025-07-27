import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuData } from '../menuData'; // Import menu structure
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';

// Component สำหรับเมนูย่อย
const SubMenu = ({ item, isSidebarOpen }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const location = useLocation();

  const getSubLinkClass = ({ isActive }) =>
    `flex items-center justify-between w-full p-3 pl-12 pr-4 my-1 rounded-lg transition-colors duration-200 text-sm ${
      isActive
        ? "bg-white/20 text-white"
        : "text-purple-100 hover:bg-white/10"
    }`;

  return (
    <>
      <button
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className={`flex items-center justify-between w-full p-3 my-1 rounded-lg transition-colors duration-200 text-left ${
          location.pathname.startsWith(item.path || `/${item.title.toLowerCase()}`) ? "text-white" : "text-purple-200 hover:bg-white/10 hover:text-white"
        }`}
      >
        <div className="flex items-center">
          <span className="w-6 flex items-center justify-center">{item.icon}</span>
          {isSidebarOpen && <span className="ml-4">{item.title}</span>}
        </div>
        {isSidebarOpen && <FaChevronDown className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isSubmenuOpen && isSidebarOpen && (
        <div className="ml-6 border-l border-purple-400/30">
          {item.submenu.map((subItem, index) => (
            <NavLink key={index} to={subItem.path} className={getSubLinkClass}>
              {subItem.title}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};


function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const getLinkClass = ({ isActive }) =>
    `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-white/20 text-white shadow-lg"
        : "text-purple-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`bg-gradient-to-b from-purple-500 to-brand-purple-dark text-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-screen ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo and Toggle button */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-16 flex-shrink-0">
        {isSidebarOpen && <span className="text-2xl font-bold text-white">CrePo-POS</span>}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-white/10"
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      
      {/* Menu List */}
      <nav className="p-3 flex-grow overflow-y-auto">
        <ul>
          {menuData.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <SubMenu item={item} isSidebarOpen={isSidebarOpen} />
              ) : (
                <NavLink to={item.path} className={getLinkClass} end>
                  <span className="w-6 flex items-center justify-center" title={item.title}>{item.icon}</span>
                  {isSidebarOpen && <span className="ml-4">{item.title}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
