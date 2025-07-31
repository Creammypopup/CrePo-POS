// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaMoneyBillWave, 
  FaBoxOpen, FaMoneyCheckAlt, FaBook, FaChartBar, FaUsers, FaCalendarAlt, 
  FaCog, FaTags, FaUserShield, FaBuilding, FaPrint
} from 'react-icons/fa';

export const menuData = [
  // Main Menu
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71' },
  { title: 'ขายสินค้า/บริการ', icon: <FaCashRegister />, path: '/sales/create', color: '#3498DB' },
  { title: 'บันทึกค่าใช้จ่าย', icon: <FaMoneyBillWave />, path: '/expenses', color: '#E74C3C' },
  
  // Documents Menu
  { title: 'เอกสาร', icon: <FaFileInvoiceDollar />, color: '#F39C12',
    submenu: [
      { title: 'ใบเสนอราคา', path: '/quotations' },
      { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices' },
      { title: 'ใบเสร็จรับเงิน', path: '/receipts' },
      { title: 'ใบสั่งซื้อ', path: '/purchase-orders' },
    ]
  },
  
  // Management Menu
  { title: 'จัดการข้อมูล', icon: <FaBook />, color: '#34495E',
    submenu: [
      { title: 'สินค้า', path: '/products' },
      { title: 'ผู้ติดต่อ', path: '/contacts' },
      { title: 'ปรับปรุงสต็อก', path: '/stock-adjustments' },
    ]
  },
  
  // Other Main Menu
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports', color: '#9B59B6' },
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar', color: '#E67E22' },

  // Settings Group
  { title: 'ตั้งค่า', icon: <FaCog />, color: '#7F8C8D',
    submenu: [
        { title: 'ข้อมูลองค์กร', path: '/settings/general' },
        { title: 'ผู้ใช้งาน', path: '/settings/users' },
        { title: 'ตำแหน่งและสิทธิ์', path: '/settings/roles' },
        { title: 'หมวดหมู่ค่าใช้จ่าย', path: '/settings/categories' },
        { title: 'การพิมพ์', path: '/settings/printing' },
    ]
  },
];