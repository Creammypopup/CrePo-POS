// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaMoneyBillWave,
  FaBoxOpen, FaMoneyCheckAlt, FaBook, FaChartBar, FaUsers, FaCalendarAlt,
  FaCog, FaTags, FaUserShield, FaBuilding, FaPrint
} from 'react-icons/fa';
import { permissions } from './permissions';

export const menuData = [
  // Main Menu
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71', permission: permissions.VIEW_DASHBOARD.id },
  { title: 'ขายสินค้า/บริการ', icon: <FaCashRegister />, path: '/sales/create', color: '#3498DB', permission: permissions.MANAGE_POS.id },
  { title: 'บันทึกค่าใช้จ่าย', icon: <FaMoneyBillWave />, path: '/expenses', color: '#E74C3C', permission: permissions.MANAGE_EXPENSES.id },

  // Documents Menu
  { title: 'เอกสาร', icon: <FaFileInvoiceDollar />, color: '#F39C12',
    permission: [permissions.MANAGE_QUOTATIONS.id, permissions.MANAGE_INVOICES.id, permissions.VIEW_RECEIPTS.id, permissions.MANAGE_PURCHASE_ORDERS.id],
    submenu: [
      { title: 'ใบเสนอราคา', path: '/quotations', permission: permissions.MANAGE_QUOTATIONS.id },
      { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices', permission: permissions.MANAGE_INVOICES.id },
      { title: 'ใบเสร็จรับเงิน', path: '/receipts', permission: permissions.VIEW_RECEIPTS.id },
      { title: 'ใบสั่งซื้อ', path: '/purchase-orders', permission: permissions.MANAGE_PURCHASE_ORDERS.id },
    ]
  },

  // Management Menu
  { title: 'จัดการข้อมูล', icon: <FaBook />, color: '#34495E',
    permission: [permissions.MANAGE_PRODUCTS.id, permissions.MANAGE_CONTACTS.id, permissions.MANAGE_STOCK_ADJUSTMENTS.id],
    submenu: [
      { title: 'สินค้า', path: '/products', permission: permissions.MANAGE_PRODUCTS.id },
      { title: 'ผู้ติดต่อ', path: '/contacts', permission: permissions.MANAGE_CONTACTS.id },
      { title: 'ปรับปรุงสต็อก', path: '/stock-adjustments', permission: permissions.MANAGE_STOCK_ADJUSTMENTS.id },
    ]
  },

  // Other Main Menu
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports', color: '#9B59B6', permission: permissions.VIEW_REPORTS.id },
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar', color: '#E67E22', permission: permissions.VIEW_CALENDAR.id },

  // Settings Group
  { title: 'ตั้งค่า', icon: <FaCog />, color: '#7F8C8D',
    permission: [permissions.MANAGE_SETTINGS.id, permissions.MANAGE_USERS.id, permissions.MANAGE_ROLES.id],
    submenu: [
        { title: 'ข้อมูลองค์กร', path: '/settings/general', permission: permissions.MANAGE_SETTINGS.id },
        { title: 'ผู้ใช้งาน', path: '/settings/users', permission: permissions.MANAGE_USERS.id },
        { title: 'ตำแหน่งและสิทธิ์', path: '/settings/roles', permission: permissions.MANAGE_ROLES.id },
        { title: 'หมวดหมู่ค่าใช้จ่าย', path: '/settings/categories', permission: permissions.MANAGE_SETTINGS.id }, // ใช้สิทธิ์เดียวกับการตั้งค่าทั่วไป
        { title: 'การพิมพ์', path: '/settings/printing', permission: permissions.MANAGE_SETTINGS.id },
    ]
  },
];