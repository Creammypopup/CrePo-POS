import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaChartBar, 
  FaFileInvoiceDollar, FaAddressBook, FaCog, FaChevronLeft, FaChevronDown,
  FaMoneyBillWave, FaBook, FaWarehouse, FaFileSignature, FaFileInvoice, 
  FaReceipt, FaHandHoldingUsd, FaMoneyCheckAlt, FaUserTie,
  FaProjectDiagram, FaPalette, FaCalendarAlt // << CORRECTED: Added missing icons
} from 'react-icons/fa';

// Export a-la-carte menu so other components can use it
export const menuItems = [
    { path: '/', text: 'ภาพรวม', icon: <FaTachometerAlt />, permission: 'dashboard-view' },
    { path: '/pos', text: 'ขายหน้าร้าน (POS)', icon: <FaShoppingCart />, permission: 'pos-access' },
    { 
      text: 'ขาย', 
      icon: <FaFileInvoiceDollar />, 
      permission: 'sales-docs-view',
      submenu: [
        { path: '/quotations', text: 'ใบเสนอราคา', icon: <FaFileSignature />, permission: 'quotations-manage' },
        { path: '/invoices', text: 'ใบแจ้งหนี้/ใบกำกับ', icon: <FaFileInvoice />, permission: 'invoices-manage' },
        { path: '/receipts', text: 'ใบเสร็จรับเงิน', icon: <FaReceipt />, permission: 'receipts-manage' },
      ]
    },
    { 
      text: 'ซื้อ', 
      icon: <FaMoneyBillWave />, 
      permission: 'purchase-docs-view',
      submenu: [
          { path: '/expenses', text: 'บันทึกค่าใช้จ่าย', icon: <FaMoneyCheckAlt />, permission: 'expenses-manage' },
          { path: '/purchase-orders', text: 'ใบสั่งซื้อ', icon: <FaShoppingCart />, permission: 'purchase-orders-manage' },
      ]
    },
    { 
      text: 'สินค้า', 
      icon: <FaBoxOpen />, 
      permission: 'products-view',
      submenu: [
          { path: '/products', text: 'สินค้าและบริการ', icon: <FaBoxOpen />, permission: 'products-manage' },
          { path: '/stock-adjustments', text: 'ปรับสต็อก', icon: <FaWarehouse />, permission: 'stock-adjustments-manage' },
      ]
    },
    { path: '/contacts', text: 'ผู้ติดต่อ', icon: <FaAddressBook />, permission: 'contacts-manage' },
    { 
      text: 'บัญชี', 
      icon: <FaBook />, 
      permission: 'accounting-view',
      submenu: [
          { path: '/accounting/journal', text: 'สมุดรายวัน', icon: <FaBook />, permission: 'journal-manage' },
          { path: '/accounting/chart-of-accounts', text: 'ผังบัญชี', icon: <FaProjectDiagram />, permission: 'chart-of-accounts-manage' },
      ]
    },
    { path: '/calendar', text: 'ปฏิทิน', icon: <FaCalendarAlt />, permission: 'dashboard-view' },
    { path: '/reports', text: 'รายงาน', icon: <FaChartBar />, permission: 'reports-view' },
    { 
      text: 'ตั้งค่า', 
      icon: <FaCog />, 
      permission: 'settings-access',
      submenu: [
        { path: '/settings/users', text: 'ผู้ใช้งาน', icon: <FaUsers />, permission: 'users-manage' },
        { path: '/settings/roles', text: 'ตำแหน่งและสิทธิ์', icon: <FaUserTie />, permission: 'roles-manage' },
        { path: '/settings/general', text: 'ตั้งค่าทั่วไป', icon: <FaCog />, permission: 'general-settings-manage' },
        { path: '/settings/theme', text: 'ปรับแต่งดีไซน์', icon: <FaPalette />, permission: 'theme-settings-manage' },
      ]
    },
  ];

function Sidebar({ isSidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const { permissions } = useSelector((state) => state.auth);
    const [openSubmenu, setOpenSubmenu] = useState(() => {
        const activeMenuItem = menuItems.find(item => item.submenu && item.submenu.some(sub => sub.path === location.pathname));
        return activeMenuItem ? activeMenuItem.text : null;
    });

    useEffect(() => {
        const activeMenuItem = menuItems.find(item => item.submenu && item.submenu.some(sub => sub.path === location.pathname));
        if (activeMenuItem) {
            setOpenSubmenu(activeMenuItem.text);
        }
    }, [location.pathname]);

    const userHasPermission = (permission) => {
        return permissions && permissions.includes(permission);
    };

    const toggleSubmenu = (text) => {
        setOpenSubmenu(openSubmenu === text ? null : text);
    };

    const renderMenuItem = (item) => {
        if (!userHasPermission(item.permission)) return null;

        const isActive = location.pathname === item.path || (item.submenu && item.submenu.some(sub => sub.path === location.pathname));

        if (item.submenu) {
            const isSubmenuOpen = openSubmenu === item.text;
            return (
                <div key={item.text}>
                    <div
                        onClick={() => toggleSubmenu(item.text)}
                        className={`flex items-center justify-between p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                            isActive ? 'bg-pastel-purple text-white shadow-md' : 'text-primary-text hover:bg-base'
                        }`}
                    >
                        <div className="flex items-center">
                            <span className="w-6">{item.icon}</span>
                            <span className={`ml-4 font-semibold ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{item.text}</span>
                        </div>
                        {isSidebarOpen && <FaChevronDown className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
                    </div>
                    {isSubmenuOpen && isSidebarOpen && (
                        <ul className="pl-8 py-1 transition-all duration-500">
                            {item.submenu.map(subItem => renderSubmenuItem(subItem))}
                        </ul>
                    )}
                </div>
            );
        } else {
            return (
                <Link to={item.path} key={item.text}>
                    <div
                        className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                            isActive ? 'bg-pastel-purple text-white shadow-md' : 'text-primary-text hover:bg-base'
                        }`}
                    >
                        <span className="w-6">{item.icon}</span>
                        <span className={`ml-4 font-semibold ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>{item.text}</span>
                    </div>
                </Link>
            );
        }
    };
    
    const renderSubmenuItem = (subItem) => {
      if (!userHasPermission(subItem.permission)) return null;
      return (
          <li key={subItem.path}>
              <Link to={subItem.path}>
                  <div className={`flex items-center p-2 my-1 rounded-lg text-sm transition-colors duration-200 ${
                      location.pathname === subItem.path ? 'bg-pastel-purple/50 text-primary-text' : 'text-secondary-text hover:text-primary-text'
                  }`}>
                       <span className={`mr-3`}>-</span>
                      {subItem.text}
                  </div>
              </Link>
          </li>
      );
  };
  
    return (
        <div className={`bg-surface shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-between p-4 h-16 border-b">
                <span className={`font-bold text-xl text-pastel-purple transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>CrePo POS</span>
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-base">
                    <FaChevronLeft className={`transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
                </button>
            </div>
            <nav className="p-2">
                {menuItems.map(item => renderMenuItem(item))}
            </nav>
        </div>
    );
}

export default Sidebar;