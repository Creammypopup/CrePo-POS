import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaUserCircle, FaBell, FaCalendarDay } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../features/auth/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('th-TH', options));
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="bg-white/50 backdrop-blur-lg shadow-sm p-4 flex justify-between items-center h-16 flex-shrink-0">
      {/* Date Display */}
      <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-inner">
        <FaCalendarDay className="text-purple-500 mr-3" />
        <span className="text-gray-700 font-semibold">{currentDate}</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-gray-500 hover:text-purple-600">
          <FaBell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="flex items-center">
          <FaUserCircle size={24} className="text-gray-400 mr-2" />
          <span className="text-gray-700 font-medium hidden md:block">
            {user ? user.name : "Guest"}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center text-gray-500 hover:text-purple-600"
        >
          <FaSignOutAlt size={20} className="mr-1" />
          <span className="hidden md:block">ออกจากระบบ</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
