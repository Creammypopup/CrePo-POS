// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaMoneyBillWave, 
  FaBoxOpen, FaMoneyCheckAlt, FaBook, FaChartBar, FaUsers, FaCalendarAlt, 
  FaCog, FaUsersCog, FaPalette, FaUserShield
} from 'react-icons/fa';

// Adding a color property to each icon for styling
export const menuData = [
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71' }, // Emerald
  { title: 'ขาย', icon: <FaCashRegister />, color: '#3498DB', // Peter River
    submenu: [
      { title: 'ขายสินค้า/บริการ', path: '/sales/create' },
      { title: 'ใบเสนอราคา', path: '/quotations' },
      { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices' },
      { title: 'ใบเสร็จรับเงิน', path: '/receipts' },
      { title: 'เอกสารทั้งหมด', path: '/sales/all' },
    ]
  },
  { title: 'ค่าใช้จ่าย', icon: <FaMoneyBillWave />, color: '#E74C3C', // Alizarin
    submenu: [
      { title: 'บันทึกค่าใช้จ่าย', path: '/expenses' },
      { title: 'ใบสั่งซื้อ', path: '/purchase-orders' },
      { title: 'เอกสารทั้งหมด', path: '/expenses/all' },
    ]
  },
  { title: 'สินค้า', icon: <FaBoxOpen />, color: '#F39C12', // Orange
    submenu: [
      { title: 'สินค้า', path: '/products' },
      { title: 'ปรับปรุงสต็อก', path: '/stock-adjustments' },
    ]
  },
  { title: 'เงินเดือน', icon: <FaMoneyCheckAlt />, color: '#1ABC9C', // Turquoise
    submenu: [
      { title: 'ทำเงินเดือน', path: '/payroll' },
      { title: 'พนักงาน', path: '/employees' },
    ]
  },
  { title: 'บัญชี', icon: <FaBook />, color: '#34495E', // Wet Asphalt
    submenu: [
      { title: 'ผังบัญชี', path: '/accounting/chart-of-accounts' },
      { title: 'สมุดรายวัน', path: '/accounting/journal' },
      { title: 'กระทบยอดธนาคาร', path: '/accounting/bank-reconciliation' },
    ]
  },
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports', color: '#9B59B6' }, // Amethyst
  { title: 'ผู้ติดต่อ', icon: <FaUsers />, path: '/contacts', color: '#16A085' }, // Green Sea
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar', color: '#E67E22' }, // Carrot
  { title: 'ตั้งค่า', icon: <FaCog />, color: '#7F8C8D', // Asbestos
    submenu: [
        { title: 'ทั่วไป', path: '/settings/general' },
        { title: 'ผู้ใช้งาน', path: '/settings/users' },
        { title: 'ตำแหน่งและสิทธิ์', path: '/settings/roles' },
        { title: 'ดีไซน์', path: '/settings/theme' },
    ]
  },
];