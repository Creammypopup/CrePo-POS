import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUsersCog, FaPalette, FaUserShield, FaCogs } from 'react-icons/fa';

// Sub-navigation for settings
const settingsNav = [
    { name: 'ทั่วไป', path: '/settings/general', icon: <FaCogs/> },
    { name: 'ผู้ใช้งาน', path: '/settings/users', icon: <FaUsersCog/> },
    { name: 'ตำแหน่งและสิทธิ์', path: '/settings/roles', icon: <FaUserShield/> },
    { name: 'ดีไซน์', path: '/settings/theme', icon: <FaPalette/> },
]

function SettingsPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-gray-800">ตั้งค่าระบบ</h1>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Left side navigation */}
            <div className="col-span-1 bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-gray-200/80">
                <nav className="space-y-1">
                    {settingsNav.map((item) => (
                        <NavLink 
                            key={item.name} 
                            to={item.path}
                            className={({isActive}) => `flex items-center px-4 py-3 rounded-lg text-lg transition-colors duration-200 ${isActive ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            {/* Right side content */}
            <div className="md:col-span-3">
                 {/* This will render the component for the active sub-route (e.g., UsersPage, RolesPage) */}
                <Outlet />
            </div>
       </div>
    </div>
  );
}

export default SettingsPage;