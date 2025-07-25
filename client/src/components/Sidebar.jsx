import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from 'react-icons/hi';
import * as BsIcons from 'react-icons/bs';

const menuConfig = [
    { name: 'ภาพรวม', icon: <FaIcons.FaTachometerAlt />, path: '/', color: 'text-pastel-purple-dark' },
    { name: 'ขายหน้าร้าน (POS)', icon: <FaIcons.FaShoppingCart />, path: '/pos', color: 'text-pastel-sky-dark' },
    { name: 'ขาย', icon: <FaIcons.FaFileInvoiceDollar />, color: 'text-pastel-mint-dark', subMenus: [ { name: 'ใบเสนอราคา', path: '/quotations' }, { name: 'ใบวางบิล/ใบแจ้งหนี้', path: '/invoices' }, { name: 'ใบเสร็จรับเงิน', path: '/receipts' }, { name: 'เอกสารลดหนี้/เพิ่มหนี้', path: '/credit-debit-notes' }, ], },
    { name: 'ซื้อ', icon: <FaIcons.FaShoppingBag />, color: 'text-pastel-peach-dark', subMenus: [ { name: 'ใบสั่งซื้อ', path: '/purchase-orders' }, { name: 'บันทึกค่าใช้จ่าย', path: '/expenses' }, ], },
    { name: 'สินค้า', icon: <FaIcons.FaBoxOpen />, color: 'text-pastel-yellow-dark', subMenus: [ { name: 'สินค้า/บริการ', path: '/products' }, { name: 'ปรับปรุงยอดสต็อก', path: '/stock-adjustments' }, { name: 'คลังสินค้า', path: '/warehouses' }, ], },
    { name: 'ผู้ติดต่อ', icon: <FaIcons.FaUsers />, path: '/contacts', color: 'text-teal-500' },
    { name: 'การเงิน', icon: <GiIcons.GiPayMoney />, color: 'text-blue-500', subMenus: [ { name: 'ภาพรวมการเงิน', path: '/finance-overview' }, { name: 'เงินสด/ธนาคาร', path: '/cash-management' }, { name: 'เช็ครับ/จ่าย', path: '/cheques' }, ], },
    { name: 'บัญชี', icon: <FaIcons.FaBook />, color: 'text-indigo-500', subMenus: [ { name: 'ผังบัญชี', path: '/chart-of-accounts' }, { name: 'สมุดรายวัน', path: '/journal' }, { name: 'กระทบยอดธนาคาร', path: '/bank-reconciliation' }, ], },
    { name: 'เงินเดือน', icon: <MdIcons.MdPeopleAlt />, path: '/payroll', color: 'text-rose-500' },
    { name: 'สินทรัพย์', icon: <GiIcons.GiVendingMachine />, path: '/assets', color: 'text-lime-500' },
    { name: 'ปฏิทินกิจกรรม', icon: <FaIcons.FaCalendarAlt />, path: '/calendar', color: 'text-cyan-500' },
    { name: 'รายงาน', icon: <HiIcons.HiDocumentReport />, path: '/reports', color: 'text-pastel-pink-dark' },
    { name: 'ตั้งค่า', icon: <FaIcons.FaCog />, path: '/settings', color: 'text-pastel-gray-dark' },
];

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [openSubMenu, setOpenSubMenu] = useState('');

    const onLogout = () => { dispatch(logout()); navigate('/login'); };

    const handleMenuClick = (menu) => {
        if (!isSidebarOpen) { setSidebarOpen(true); }
        if (!menu.subMenus) { navigate(menu.path); } 
        else { setOpenSubMenu(openSubMenu === menu.name ? '' : menu.name); }
    };

    const SubMenu = ({ menu, isVisible }) => (
        <AnimatePresence>
            {isVisible && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-10 bg-white/30 rounded-lg">
                    {menu.subMenus.map((subMenu) => (
                        <NavLink key={subMenu.name} to={subMenu.path} className={({ isActive }) => `flex items-center py-2 px-2 text-sm rounded-md hover:bg-white/50 ${ isActive ? 'text-purple-800 font-semibold' : 'text-gray-700' }`}>
                            <BsIcons.BsDot className="mr-2" />
                            <span>{subMenu.name}</span>
                        </NavLink>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        // --- START OF EDIT ---
        <div className={`relative flex flex-col bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 text-gray-800 shadow-2xl transition-all duration-300 ease-in-out ${ isSidebarOpen ? 'w-72' : 'w-20' }`}>
        {/* --- END OF EDIT --- */}
            <Tooltip id="sidebar-tooltip" place="right" className="z-20" />
            <div className="flex items-center justify-center h-20 border-b border-gray-200/80">
                <GiIcons.GiMushroomHouse className={`text-5xl text-pastel-purple-dark transition-all duration-300 ${isSidebarOpen ? 'mr-2' : ''}`} />
                <AnimatePresence> {isSidebarOpen && ( <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-2xl font-bold whitespace-nowrap text-pastel-purple-dark"> CrePo POS </motion.h1> )} </AnimatePresence>
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-20 z-10 p-1.5 bg-pastel-purple-dark text-white rounded-full focus:outline-none hover:bg-purple-700 shadow-lg"> {isSidebarOpen ? <FaIcons.FaAngleLeft /> : <FaIcons.FaAngleRight />} </button>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuConfig.map((menu) => (
                    <div key={menu.name}>
                        <div onClick={() => handleMenuClick(menu)} data-tooltip-id="sidebar-tooltip" data-tooltip-content={menu.name} className={`flex items-center p-3 text-base font-normal rounded-lg cursor-pointer hover:bg-white/50 ${!isSidebarOpen ? 'justify-center' : ''}`}>
                            <span className={`text-2xl ${menu.color}`}>{menu.icon}</span>
                            <AnimatePresence> {isSidebarOpen && ( <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="ml-4 flex-1 whitespace-nowrap"> {menu.name} </motion.span> )} </AnimatePresence>
                            {isSidebarOpen && menu.subMenus && ( <FaIcons.FaChevronDown className={`transition-transform duration-300 ${openSubMenu === menu.name ? 'rotate-180' : ''}`} /> )}
                        </div>
                        {isSidebarOpen && <SubMenu menu={menu} isVisible={openSubMenu === menu.name} />}
                    </div>
                ))}
            </nav>
            <div className="p-2 border-t border-gray-200/80">
                <div className={`flex items-center p-2 text-base font-normal rounded-lg ${!isSidebarOpen ? 'justify-center' : ''}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pastel-purple-light flex items-center justify-center border-2 border-pastel-purple"> <span className="font-bold text-pastel-purple-dark">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</span> </div>
                    <AnimatePresence> {isSidebarOpen && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="ml-3 flex-1 whitespace-nowrap"> <p className="text-sm font-semibold">{user?.name || 'Admin'}</p> <p className="text-xs text-gray-500">{user?.role || ''}</p> </motion.div> )} </AnimatePresence>
                </div>
                <button onClick={onLogout} data-tooltip-id="sidebar-tooltip" data-tooltip-content="ออกจากระบบ" className={`flex items-center w-full p-3 mt-2 text-base font-normal rounded-lg hover:bg-red-100/50 text-red-600 ${!isSidebarOpen ? 'justify-center' : ''}`}>
                    <FaIcons.FaSignOutAlt className="text-2xl" />
                    <AnimatePresence> {isSidebarOpen && ( <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="ml-4 whitespace-nowrap"> ออกจากระบบ </motion.span> )} </AnimatePresence>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;