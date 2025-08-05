// client/src/components/Sidebar.jsx
import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { menuData } from '../menuData.jsx';
import { FaChevronDown } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const AppLogo = () => (
    <div className="w-10 h-10 rounded-lg shadow-lg flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 7L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 7L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 4.5L7 9.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    </div>
);

const SubMenu = ({ item, isSidebarOpen, setIsSidebarOpen, userPermissions }) => {
  const location = useLocation();
  const availableSubmenu = useMemo(() =>
      item.submenu.filter(sub => userPermissions.includes(sub.permission)),
    [item.submenu, userPermissions]
  );

  const isParentActive = availableSubmenu.some(sub => location.pathname.startsWith(sub.path));
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isParentActive);

  const getSubLinkClass = ({ isActive }) => `flex items-center w-full p-2.5 pl-10 pr-4 my-0.5 rounded-lg transition-colors duration-200 text-sm ${isActive ? "bg-white/50 text-brand-purple font-semibold" : "text-white/80 hover:bg-white/20 hover:text-white"}`;
  
  const getParentButtonClass = () => {
    let classes = "flex items-center justify-between w-full p-3 my-1 rounded-lg transition-colors duration-200 text-left text-white/90 hover:bg-white/10";
    if (isParentActive) {
      classes += " bg-white/20 font-semibold";
    }
    return classes;
  }

  const handleSubMenuClick = (e) => { e.stopPropagation(); if (!isSidebarOpen) setIsSidebarOpen(true); setIsSubmenuOpen(!isSubmenuOpen); }

  if (availableSubmenu.length === 0) return null;

  return (
    <>
      <button onClick={handleSubMenuClick} className={getParentButtonClass()} data-tooltip-id="nav-tooltip" data-tooltip-content={item.title} data-tooltip-place="right">
        <div className="flex items-center">
            {/* --- START OF EDIT --- */}
            <span className="w-6 flex items-center justify-center text-xl" style={{ color: isParentActive && isSidebarOpen ? 'white' : item.color }}>
                {item.icon}
            </span>
            {isSidebarOpen && <span className="ml-4 font-medium text-white">{item.title}</span>}
            {/* --- END OF EDIT --- */}
        </div>
        {isSidebarOpen && <FaChevronDown className={`transition-transform duration-300 text-white ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isSubmenuOpen && isSidebarOpen && ( <div className="ml-4 border-l-2 border-white/20">{availableSubmenu.map((subItem, index) => (<NavLink key={index} to={subItem.path} className={getSubLinkClass}>{subItem.title}</NavLink>))}</div> )}
    </>
  );
};

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const { user } = useSelector((state) => state.auth);
    const userPermissions = useMemo(() => user?.role?.permissions || [], [user]);

    const accessibleMenuData = useMemo(() =>
        menuData.filter(item => {
            if (!item.permission) return true;
            if (Array.isArray(item.permission)) {
                return item.permission.some(p => userPermissions.includes(p));
            }
            return userPermissions.includes(item.permission);
        }),
      [userPermissions]
    );

    const getLinkClass = ({ isActive }) => `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? "bg-white/90 text-brand-purple shadow-lg shadow-black/10" : "text-white/90 hover:bg-white/20"}`;
    const handleSidebarClick = (e) => { e.stopPropagation(); if (!isSidebarOpen) setIsSidebarOpen(true); };

    return (
      <>
        <aside onClick={handleSidebarClick} className={`bg-sidebar-gradient border-r border-white/20 transition-all duration-300 ease-in-out flex flex-col h-screen ${isSidebarOpen ? "w-64" : "w-20 cursor-pointer"}`}>
          <div className="p-4 flex items-center justify-center border-b border-white/20 h-14 flex-shrink-0">
            <div className="flex items-center gap-3">
              <AppLogo />
              {isSidebarOpen && <span className="text-xl font-bold text-white tracking-wider">CrePo POS</span>}
            </div>
          </div>
          <nav className="p-3 flex-grow overflow-y-auto">
            <ul>{accessibleMenuData.map((item, index) => (
                <li key={index}>
                    {item.submenu ? ( 
                        <SubMenu item={item} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} userPermissions={userPermissions} /> 
                    ) : ( 
                        <NavLink to={item.path} className={getLinkClass} end data-tooltip-id="nav-tooltip" data-tooltip-content={item.title} data-tooltip-place="right">
                           <span className="w-6 flex items-center justify-center text-xl" style={{ color: item.color }}>{item.icon}</span>
                           {isSidebarOpen && <span className="ml-4 font-medium">{item.title}</span>}
                        </NavLink>
                    )}
                </li>
            ))}</ul>
          </nav>
        </aside>
        {!isSidebarOpen && <Tooltip id="nav-tooltip" style={{ backgroundColor: '#A076F9', color: 'white', zIndex: 99, borderRadius: '8px', padding: '4px 10px' }} />}
      </>
    );
}
export default Sidebar;