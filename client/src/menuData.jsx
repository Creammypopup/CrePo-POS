// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaBoxOpen,
  FaBook, FaChartBar, FaCalendarAlt, FaCog, FaAddressBook, FaWarehouse, FaHandHoldingUsd, FaUsersCog, FaUserFriends
} from 'react-icons/fa';
import { PERMISSIONS } from './permissions';

export const menuData = [
  // Main Menu
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71', permission: PERMISSIONS.DASHBOARD_VIEW },
  { title: 'ขายหน้าร้าน (POS)', icon: <FaCashRegister />, path: '/sales/create', color: '#3498DB', permission: PERMISSIONS.POS_ACCESS },
  { title: 'รับฝาก/จำนำ', icon: <FaHandHoldingUsd />, path: '/pawn', color: '#E67E22', permission: PERMISSIONS.PAWN_MANAGE },

  // Products & Stock Management
  { title: 'สินค้า', icon: <FaBoxOpen />, path: '/products', color: '#E74C3C', permission: PERMISSIONS.PRODUCTS_VIEW },
  {
    title: 'คลังสินค้า',
    icon: <FaWarehouse />,
    color: '#16A085',
    permission: [PERMISSIONS.INVENTORY_RECEIVE_STOCK, PERMISSIONS.INVENTORY_ADJUST_STOCK],
    submenu: [
        { title: 'รับสินค้าเข้าสต็อก', path: '/inventory/receive', permission: PERMISSIONS.INVENTORY_RECEIVE_STOCK },
        { title: 'ปรับปรุงสต็อก', path: '/inventory/adjust', permission: PERMISSIONS.INVENTORY_ADJUST_STOCK },
    ]
  },

  // Contacts
  {
    title: 'ผู้ติดต่อ',
    icon: <FaAddressBook />,
    color: '#1ABC9C',
    permission: PERMISSIONS.CONTACTS_VIEW,
      submenu: [
          { title: 'ลูกค้า', path: '/contacts/customers', permission: PERMISSIONS.CONTACTS_MANAGE },
          { title: 'ผู้จำหน่าย', path: '/contacts/suppliers', permission: PERMISSIONS.CONTACTS_MANAGE },
      ]
  },

  // Accounting & Documents
  {
    title: 'บัญชีและการเงิน',
    icon: <FaBook />,
    color: '#34495E',
      permission: [PERMISSIONS.ACCOUNTING_VIEW, PERMISSIONS.SALES_VIEW, PERMISSIONS.QUOTATIONS_MANAGE, PERMISSIONS.INVOICES_MANAGE],
      submenu: [
          { title: 'บันทึกค่าใช้จ่าย', path: '/expenses', permission: PERMISSIONS.ACCOUNTING_MANAGE },
          { title: 'ใบเสนอราคา', path: '/quotations', permission: PERMISSIONS.QUOTATIONS_MANAGE },
          { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices', permission: PERMISSIONS.INVOICES_MANAGE },
          { title: 'ใบเสร็จรับเงิน', path: '/receipts', permission: PERMISSIONS.SALES_VIEW },
      ]
  },

  // Other Main Menu
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports', color: '#9B59B6', permission: PERMISSIONS.REPORTS_VIEW_SALES }, // Simplified permission
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar', color: '#F1C40F', permission: PERMISSIONS.CALENDAR_VIEW }, // Assumed permission

  // Settings Group
  {
    title: 'ตั้งค่า',
    icon: <FaCog />,
    color: '#7F8C8D',
    permission: [PERMISSIONS.SETTINGS_MANAGE_GENERAL, PERMISSIONS.SETTINGS_MANAGE_USERS, PERMISSIONS.SETTINGS_MANAGE_ROLES],
    submenu: [
        { title: 'ข้อมูลองค์กร', path: '/settings/general', permission: PERMISSIONS.SETTINGS_MANAGE_GENERAL },
        { title: 'ผู้ใช้งาน', icon: <FaUserFriends />, path: '/settings/users', permission: PERMISSIONS.SETTINGS_MANAGE_USERS },
        { title: 'ตำแหน่งและสิทธิ์', icon: <FaUsersCog />, path: '/settings/roles', permission: PERMISSIONS.SETTINGS_MANAGE_ROLES },
    ]
  },
];