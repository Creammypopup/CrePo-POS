// client/src/menuData.jsx
import React from 'react';
import {
  FaTachometerAlt, FaCashRegister, FaFileInvoiceDollar,
  FaBoxOpen, FaBook, FaChartBar, FaCalendarAlt,
  FaCog, FaAddressBook
} from 'react-icons/fa';
import { permissions } from './permissions';

export const menuData = [
  // Main Menu
  { title: 'ภาพรวม', icon: <FaTachometerAlt />, path: '/', color: '#2ECC71', permission: permissions.VIEW_DASHBOARD.id },
  { title: 'ขายสินค้า/บริการ', icon: <FaCashRegister />, path: '/sales/create', color: '#3498DB', permission: permissions.MANAGE_POS.id },

  // Documents Menu
  { title: 'เอกสาร', icon: <FaFileInvoiceDollar />, color: '#F39C12',
    permission: [permissions.MANAGE_QUOTATIONS.id, permissions.MANAGE_INVOICES.id, permissions.VIEW_RECEIPTS.id],
    submenu: [
      { title: 'ใบเสนอราคา', path: '/quotations', permission: permissions.MANAGE_QUOTATIONS.id },
      { title: 'ใบแจ้งหนี้/ใบวางบิล', path: '/invoices', permission: permissions.MANAGE_INVOICES.id },
      { title: 'ใบเสร็จรับเงิน', path: '/receipts', permission: permissions.VIEW_RECEIPTS.id },
    ]
  },

  // Management Menu
  { title: 'สินค้า', icon: <FaBoxOpen />, color: '#E74C3C',
    permission: [permissions.MANAGE_PRODUCTS.id, permissions.MANAGE_STOCK_ADJUSTMENTS.id, permissions.MANAGE_PURCHASE_ORDERS.id],
    submenu: [
        { title: 'สินค้าทั้งหมด', path: '/products', permission: permissions.MANAGE_PRODUCTS.id },
        { title: 'ปรับปรุงสต็อก', path: '/stock-adjustments', permission: permissions.MANAGE_STOCK_ADJUSTMENTS.id },
        { title: 'ใบสั่งซื้อ', path: '/purchase-orders', permission: permissions.MANAGE_PURCHASE_ORDERS.id },
    ]
  },

  // Contacts
  { title: 'ผู้ติดต่อ', icon: <FaAddressBook />, color: '#1ABC9C', permission: permissions.MANAGE_CONTACTS.id,
      submenu: [
          { title: 'ลูกค้า', path: '/contacts/customers', permission: permissions.MANAGE_CONTACTS.id },
          { title: 'ผู้จำหน่าย', path: '/contacts/suppliers', permission: permissions.MANAGE_CONTACTS.id },
      ]
  },

  // Accounting
   { title: 'บัญชี', icon: <FaBook />, color: '#34495E',
      permission: [permissions.MANAGE_ACCOUNTING.id, permissions.MANAGE_EXPENSES.id],
      submenu: [
          { title: 'บันทึกค่าใช้จ่าย', path: '/expenses', permission: permissions.MANAGE_EXPENSES.id },
          { title: 'ผังบัญชี', path: '/accounting/chart-of-accounts', permission: permissions.MANAGE_ACCOUNTING.id },
          { title: 'สมุดรายวัน', path: '/accounting/journal', permission: permissions.MANAGE_ACCOUNTING.id },
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
        { title: 'การพิมพ์', path: '/settings/printing', permission: permissions.MANAGE_SETTINGS.id },
    ]
  },
];