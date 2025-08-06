// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar, FaBoxOpen,
  FaBook, FaChartBar, FaCalendarAlt, FaCog, FaAddressBook, FaWarehouse, FaHandHoldingUsd
} from 'react-icons/fa';
import { permissions } from './permissions';

export const menuData = [
  // Main Menu
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71', permission: permissions.VIEW_DASHBOARD.id },
  { title: 'ขายหน้าร้าน (POS)', icon: <FaCashRegister />, path: '/sales/create', color: '#3498DB', permission: permissions.MANAGE_POS.id },
  { title: 'รับฝาก/จำนำ', icon: <FaHandHoldingUsd />, path: '/pawn', color: '#E67E22', permission: permissions.MANAGE_PRODUCTS.id }, // Placeholder permission

  // Products & Stock Management
  { title: 'สินค้า', icon: <FaBoxOpen />, path: '/products', color: '#E74C3C', permission: permissions.MANAGE_PRODUCTS.id },
  { title: 'คลังสินค้า', icon: <FaWarehouse />, color: '#16A085',
    permission: [permissions.MANAGE_PURCHASE_ORDERS.id, permissions.MANAGE_STOCK_ADJUSTMENTS.id],
    submenu: [
        { title: 'รับสินค้าเข้าสต็อก', path: '/inventory/receive', permission: permissions.MANAGE_PURCHASE_ORDERS.id },
        { title: 'ปรับปรุงสต็อก', path: '/stock-adjustments', permission: permissions.MANAGE_STOCK_ADJUSTMENTS.id },
    ]
  },

  // Contacts
  { title: 'ผู้ติดต่อ', icon: <FaAddressBook />, color: '#1ABC9C', permission: permissions.MANAGE_CONTACTS.id,
      submenu: [
          { title: 'ลูกค้า', path: '/contacts/customers', permission: permissions.MANAGE_CONTACTS.id },
          { title: 'ผู้จำหน่าย', path: '/contacts/suppliers', permission: permissions.MANAGE_CONTACTS.id },
      ]
  },

  // Accounting & Documents
  { title: 'บัญชีและการเงิน', icon: <FaBook />, color: '#34495E',
      permission: [permissions.MANAGE_ACCOUNTING.id, permissions.MANAGE_EXPENSES.id],
      submenu: [
          { title: 'บันทึกค่าใช้จ่าย', path: '/expenses', permission: permissions.MANAGE_EXPENSES.id },
          { title: 'ใบเสนอราคา', path: '/quotations', permission: permissions.MANAGE_QUOTATIONS.id },
          { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices', permission: permissions.MANAGE_INVOICES.id },
          { title: 'ใบเสร็จรับเงิน', path: '/receipts', permission: permissions.VIEW_RECEIPTS.id },
      ]
  },

  // Other Main Menu
  { title: 'รายงาน', icon: <FaChartBar />, path: '/reports', color: '#9B59B6', permission: permissions.VIEW_REPORTS.id },
  { title: 'ปฏิทิน', icon: <FaCalendarAlt />, path: '/calendar', color: '#F1C40F', permission: permissions.VIEW_CALENDAR.id },

  // Settings Group
  { title: 'ตั้งค่า', icon: <FaCog />, color: '#7F8C8D',
    permission: [permissions.MANAGE_SETTINGS.id, permissions.MANAGE_USERS.id, permissions.MANAGE_ROLES.id],
    submenu: [
        { title: 'ข้อมูลองค์กร', path: '/settings/general', permission: permissions.MANAGE_SETTINGS.id },
        { title: 'ผู้ใช้งานและสิทธิ์', path: '/settings/users', permission: permissions.MANAGE_USERS.id },
        { title: 'ตำแหน่ง', path: '/settings/roles', permission: permissions.MANAGE_ROLES.id },
        { title: 'การพิมพ์และใบเสร็จ', path: '/settings/printing', permission: permissions.MANAGE_SETTINGS.id },
    ]
  },
];