// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaFileSignature, FaReceipt,
  FaMoneyBillWave, FaBoxOpen, FaWarehouse, FaExchangeAlt, FaShoppingCart,
  FaUsers, FaUserTie, FaUserCog, FaChartBar, FaBook, FaCalendarAlt, FaCog,
  FaFileAlt, FaMoneyCheckAlt, FaCreditCard, FaUniversity, FaFileMedicalAlt,
  FaUsersCog, FaPalette, FaUserShield
} from 'react-icons/fa';

export const menuData = [
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/' },
  { title: 'ขาย', icon: <FaCashRegister />,
    submenu: [
      { title: 'ขายสินค้า/บริการ', path: '/sales/create' },
      { title: 'ใบเสนอราคา', path: '/quotations' },
      { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices' },
      { title: 'ใบเสร็จรับเงิน', path: '/receipts' },
      { title: 'เอกสารทั้งหมด', path: '/sales/all' },
    ]
  },
  { title: 'ค่าใช้จ่าย', icon: <FaMoneyBillWave />,
    submenu: [
      { title: 'บันทึกค่าใช้จ่าย', path: '/expenses' },
      { title: 'ใบสั่งซื้อ', path: '/purchase-orders' },
      { title: 'เอกสารทั้งหมด', path: '/expenses/all' },
    ]
  },
  { title: 'สินค้า', icon: <FaBoxOpen />,
    submenu: [
      { title: 'สินค้า', path: '/products' },
      { title: 'ปรับปรุงสต็อก', path: '/stock-adjustments' },
    ]
  },
  { title: 'เงินเดือน', icon: <FaMoneyCheckAlt />,
    submenu: [
      { title: 'ทำเงินเดือน', path: '/payroll' },
      { title: 'พนักงาน', path: '/employees' },
    ]
  },
  { title: 'บัญชี', icon: <FaBook />,
    submenu: [
      { title: 'ผังบัญชี', path: '/accounting/chart-of-accounts' },
      { title: 'สมุดรายวัน', path: '/accounting/journal' },
      { title: 'กระทบยอดธนาคาร', path: '/accounting/bank-reconciliation' },
    ]
  },
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports' },
  { title: 'ผู้ติดต่อ', icon: <FaUsers />, path: '/contacts' },
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar' },
  { title: 'ตั้งค่า', icon: <FaCog />,
    submenu: [
        { title: 'ทั่วไป', path: '/settings/general', icon: <FaCog/> },
        { title: 'ผู้ใช้งาน', path: '/settings/users', icon: <FaUsersCog/> },
        { title: 'ตำแหน่งและสิทธิ์', path: '/settings/roles', icon: <FaUserShield/> },
        { title: 'ดีไซน์', path: '/settings/theme', icon: <FaPalette/> },
    ]
  },
];