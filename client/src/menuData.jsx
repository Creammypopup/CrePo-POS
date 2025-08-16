// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaBoxOpen,
  FaBook, FaChartBar, FaCalendarAlt, FaCog, FaAddressBook, FaWarehouse, FaHandHoldingUsd, FaUsersCog, FaUserFriends
} from 'react-icons/fa';
// import { PERMISSIONS } from './permissions'; // Commented out for now

export const menuData = [
  // Main Menu
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71' },
  { title: 'ขายหน้าร้าน (POS)', icon: <FaCashRegister />, path: '/sales/create', color: '#3498DB' },
  { title: 'รับฝาก/จำนำ', icon: <FaHandHoldingUsd />, path: '/pawn', color: '#E67E22' },

  // Products & Stock Management
  { title: 'สินค้า', icon: <FaBoxOpen />, path: '/products', color: '#E74C3C' },
  {
    title: 'คลังสินค้า',
    icon: <FaWarehouse />,
    color: '#16A085',
    submenu: [
        { title: 'รับสินค้าเข้าสต็อก', path: '/inventory/receive' },
        { title: 'ปรับปรุงสต็อก', path: '/inventory/adjust' },
    ]
  },

  // Contacts
  {
    title: 'ผู้ติดต่อ',
    icon: <FaAddressBook />,
    color: '#1ABC9C',
      submenu: [
          { title: 'ลูกค้า', path: '/contacts/customers' },
          { title: 'ผู้จำหน่าย', path: '/contacts/suppliers' },
      ]
  },

  // Accounting & Documents
  {
    title: 'บัญชีและการเงิน',
    icon: <FaBook />,
    color: '#34495E',
      submenu: [
          { title: 'บันทึกค่าใช้จ่าย', path: '/expenses' },
          { title: 'ใบเสนอราคา', path: '/quotations' },
          { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices' },
          { title: 'ใบเสร็จรับเงิน', path: '/receipts' },
      ]
  },

  // Other Main Menu
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports', color: '#9B59B6' },
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar', color: '#F1C40F' },

  // Settings Group
  {
    title: 'ตั้งค่า',
    icon: <FaCog />,
    color: '#7F8C8D',
    submenu: [
        { title: 'ข้อมูลองค์กร', path: '/settings/general' },
        { title: 'ผู้ใช้งาน', icon: <FaUserFriends />, path: '/settings/users' },
        { title: 'ตำแหน่งและสิทธิ์', icon: <FaUsersCog />, path: '/settings/roles' },
    ]
  },
];