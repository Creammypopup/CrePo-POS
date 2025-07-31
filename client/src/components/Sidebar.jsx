// client/src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuData } from '../menuData.jsx';
import { FaChevronDown } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const AppLogo = () => (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M20 5L35 20L20 35L5 20L20 5Z" fill="url(#paint1_linear_1_2)"/>
        <path d="M20 8L32 20L20 32L8 20L20 8Z" fill="white"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#D9ACF5"/><stop offset="1" stopColor="#A076F9"/></linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="20" y1="5" x2="20" y2="35" gradientUnits="userSpaceOnUse"><stop stopColor="#FFABE1"/><stop offset="1" stopColor="#D9ACF5"/></linearGradient>
        </defs>
    </svg>
);

const SubMenu = ({ item, isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const isParentActive = item.submenu.some(sub => location.pathname.startsWith(sub.path));
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isParentActive);
  const getSubLinkClass = ({ isActive }) => `flex items-center w-full p-2.5 pl-10 pr-4 my-0.5 rounded-lg transition-colors duration-200 text-sm ${isActive ? "bg-brand-purple/20 text-brand-purple font-semibold" : "text-brand-text-light hover:bg-brand-purple/5 hover:text-brand-purple"}`;
  const handleSubMenuClick = (e) => { e.stopPropagation(); if (!isSidebarOpen) setIsSidebarOpen(true); setIsSubmenuOpen(!isSubmenuOpen); }
  return (
    <>
      <button onClick={handleSubMenuClick} className={`flex items-center justify-between w-full p-3 my-1 rounded-lg transition-colors duration-200 text-left ${isParentActive ? "text-brand-purple font-semibold" : "text-gray-600 hover:bg-brand-purple/5 hover:text-brand-purple"}`} data-tooltip-id="nav-tooltip" data-tooltip-content={item.title} data-tooltip-place="right">
        <div className="flex items-center"><span className="w-6 flex items-center justify-center text-xl" style={{ color: item.color }}>{item.icon}</span>{isSidebarOpen && <span className="ml-4 font-medium">{item.title}</span>}</div>
        {isSidebarOpen && <FaChevronDown className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isSubmenuOpen && isSidebarOpen && ( <div className="ml-4 border-l-2 border-brand-purple-light/20">{item.submenu.map((subItem, index) => (<NavLink key={index} to={subItem.path} className={getSubLinkClass}>{subItem.title}</NavLink>))}</div> )}
    </>
  );
};

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const getLinkClass = ({ isActive }) => `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30" : "text-gray-600 hover:bg-brand-purple/5 hover:text-brand-purple"}`;
    const handleSidebarClick = (e) => { e.stopPropagation(); if (!isSidebarOpen) setIsSidebarOpen(true); };
    return (
      <>
        <aside onClick={handleSidebarClick} className={`bg-[#F4F0F9] border-r border-gray-200/80 transition-all duration-300 ease-in-out flex flex-col h-screen ${isSidebarOpen ? "w-64" : "w-20 cursor-pointer"}`}>
          <div className="p-4 flex items-center justify-center border-b border-gray-200/80 h-14 flex-shrink-0">
            <div className="flex items-center gap-3"><AppLogo />{isSidebarOpen && <span className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">CrePo-POS</span>}</div>
          </div>
          <nav className="p-3 flex-grow overflow-y-auto">
            <ul>{menuData.map((item, index) => (<li key={index}>{item.submenu ? ( <SubMenu item={item} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> ) : ( <NavLink to={item.path} className={getLinkClass} end data-tooltip-id="nav-tooltip" data-tooltip-content={item.title} data-tooltip-place="right"><span className="w-6 flex items-center justify-center text-xl" style={{ color: item.color }}>{item.icon}</span>{isSidebarOpen && <span className="ml-4 font-medium">{item.title}</span>}</NavLink>)}</li>))}</ul>
          </nav>
        </aside>
        {!isSidebarOpen && <Tooltip id="nav-tooltip" style={{ backgroundColor: '#A076F9', color: 'white', zIndex: 99, borderRadius: '8px', padding: '4px 10px' }} />}
      </>
    );
}
export default Sidebar;