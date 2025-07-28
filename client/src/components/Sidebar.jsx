// client/src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuData } from '../menuData.jsx';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const SubMenu = ({ item, isSidebarOpen }) => {
  const location = useLocation();
  const isParentActive = item.submenu.some(sub => location.pathname.startsWith(sub.path));
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isParentActive);

  const getSubLinkClass = ({ isActive }) =>
    `flex items-center w-full p-3 pl-12 pr-4 my-1 rounded-lg transition-colors duration-200 text-sm ${
      isActive
        ? "bg-brand-purple/20 text-brand-purple font-semibold"
        : "text-brand-text-light hover:bg-brand-purple/5 hover:text-brand-purple"
    }`;

  return (
    <>
      <button
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className={`flex items-center justify-between w-full p-3 my-1 rounded-lg transition-colors duration-200 text-left ${
          isParentActive ? "text-brand-purple font-semibold" : "text-gray-600 hover:bg-brand-purple/5 hover:text-brand-purple"
        }`}
        data-tooltip-id="nav-tooltip"
        data-tooltip-content={item.title}
        data-tooltip-place="right"
      >
        <div className="flex items-center">
          <span className="w-6 flex items-center justify-center text-xl" style={{ color: item.color }}>{item.icon}</span>
          {isSidebarOpen && <span className="ml-4 font-medium">{item.title}</span>}
        </div>
        {isSidebarOpen && <FaChevronDown className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isSubmenuOpen && isSidebarOpen && (
        <div className="ml-6 border-l-2 border-brand-purple-light/30">
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
        ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
        : "text-gray-600 hover:bg-brand-purple/5 hover:text-brand-purple"
    }`;

  const handleSidebarClick = (e) => {
    if (!isSidebarOpen) {
      e.stopPropagation();
      setIsSidebarOpen(true);
    }
  };

  return (
    <>
      <aside
        onClick={handleSidebarClick}
        className={`bg-[#F9F7FF] border-r border-gray-200/80 shadow-lg transition-all duration-300 ease-in-out flex flex-col h-screen ${
          isSidebarOpen ? "w-64 cursor-default" : "w-20 cursor-pointer"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200/80 h-16 flex-shrink-0">
          {isSidebarOpen && <span className="text-2xl font-bold text-brand-purple">CrePo-POS</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="p-2 rounded-full text-brand-text hover:bg-gray-200/50"
          >
            {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <nav className="p-3 flex-grow overflow-y-auto">
          <ul>
            {menuData.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <SubMenu item={item} isSidebarOpen={isSidebarOpen} />
                ) : (
                  <NavLink 
                    to={item.path} 
                    className={getLinkClass} 
                    end
                    data-tooltip-id="nav-tooltip"
                    data-tooltip-content={item.title}
                    data-tooltip-place="right"
                  >
                    <span className="w-6 flex items-center justify-center text-xl" style={{ color: item.color }}>{item.icon}</span>
                    {isSidebarOpen && <span className="ml-4 font-medium">{item.title}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {!isSidebarOpen && <Tooltip id="nav-tooltip" style={{ backgroundColor: '#A076F9', color: 'white', zIndex: 99, borderRadius: '8px', padding: '4px 10px' }} />}
    </>
  );
}

export default Sidebar;