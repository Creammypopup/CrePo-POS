// client/src/components/Header.jsx
import React, { useEffect } from "react";
import { FaSignOutAlt, FaUserCircle, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../features/auth/authSlice";
import { getSettings } from "../features/settings/settingSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);
  useEffect(() => { if (!settings) { dispatch(getSettings()); } }, [dispatch, settings]);
  const onLogout = () => { dispatch(logout()); dispatch(reset()); navigate("/login"); };

  return (
    <header className="bg-brand-pink-light/30 backdrop-blur-lg shadow-sm p-4 flex justify-between items-center h-14 flex-shrink-0 border-b border-gray-200/80">
      <div className="flex items-center">
        <h2 className="text-lg font-bold text-brand-brown">{settings?.companyName || 'CrePo-POS'}</h2>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-500 hover:text-brand-purple"><FaBell size={20} /><span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span></button>
        <div className="flex items-center"><FaUserCircle size={24} className="text-gray-400 mr-2" /><span className="text-brand-text font-medium hidden md:block">{user ? user.name : "Guest"}</span></div>
        <button onClick={onLogout} className="flex items-center text-gray-500 hover:text-red-500 transition-colors"><FaSignOutAlt size={20} className="mr-1" /><span className="hidden md:block">ออกจากระบบ</span></button>
      </div>
    </header>
  );
}
export default Header;