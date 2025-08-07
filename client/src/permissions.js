
// client/src/permissions.js

// This file defines all possible permissions available in the system.
// It serves as a single source of truth for access control across the application.
// Format: 'feature-action' or 'module-submodule-action'

export const PERMISSIONS = {
  // POS
  POS_ACCESS: 'pos-access', // Access the main POS interface

  // Products
  PRODUCTS_VIEW: 'products-view',
  PRODUCTS_MANAGE: 'products-manage', // Create, Edit, Delete products

  // Inventory
  INVENTORY_VIEW: 'inventory-view',
  INVENTORY_ADJUST_STOCK: 'inventory-adjust-stock', // Adjust stock levels
  INVENTORY_RECEIVE_STOCK: 'inventory-receive-stock', // From purchase orders

  // Sales & Invoices
  SALES_VIEW: 'sales-view', // View sales history, receipts
  INVOICES_MANAGE: 'invoices-manage', // Create, Edit, Send invoices
  QUOTATIONS_MANAGE: 'quotations-manage', // Create, Edit, Send quotations

  // Contacts (Customers & Suppliers)
  CONTACTS_VIEW: 'contacts-view',
  CONTACTS_MANAGE: 'contacts-manage',

  // Purchasing
  PURCHASE_ORDERS_VIEW: 'purchase-orders-view',
  PURCHASE_ORDERS_MANAGE: 'purchase-orders-manage',

  // Accounting
  ACCOUNTING_VIEW: 'accounting-view', // View charts of accounts, journal
  ACCOUNTING_MANAGE: 'accounting-manage', // Make journal entries

  // Reports
  REPORTS_VIEW_SALES: 'reports-view-sales',
  REPORTS_VIEW_INVENTORY: 'reports-view-inventory',
  REPORTS_VIEW_PAWN: 'reports-view-pawn',
  REPORTS_VIEW_FINANCIAL: 'reports-view-financial',

  // Pawn
  PAWN_VIEW: 'pawn-view',
  PAWN_MANAGE: 'pawn-manage', // Create, update pawn tickets

  // HR & Payroll
  HR_EMPLOYEES_VIEW: 'hr-employees-view',
  HR_EMPLOYEES_MANAGE: 'hr-employees-manage',
  HR_PAYROLL_PROCESS: 'hr-payroll-process', // Process payroll

  // Settings & Administration
  SETTINGS_MANAGE_GENERAL: 'settings-manage-general', // Manage general store settings
  SETTINGS_MANAGE_ROLES: 'settings-manage-roles', // Manage user roles and permissions
  SETTINGS_MANAGE_USERS: 'settings-manage-users', // Manage user accounts
};

// Group permissions by module for easier management in the UI
export const PERMISSION_MODULES = {
  "หน้าขาย (POS)": [
    { id: PERMISSIONS.POS_ACCESS, label: "เข้าถึงหน้าขาย" },
  ],
  "สินค้า": [
    { id: PERMISSIONS.PRODUCTS_VIEW, label: "ดูข้อมูลสินค้า" },
    { id: PERMISSIONS.PRODUCTS_MANAGE, label: "จัดการ (เพิ่ม/แก้ไข/ลบ) สินค้า" },
  ],
  "คลังสินค้า": [
    { id: PERMISSIONS.INVENTORY_VIEW, label: "ดูข้อมูลคลังสินค้า" },
    { id: PERMISSIONS.INVENTORY_ADJUST_STOCK, label: "ปรับสต็อก" },
    { id: PERMISSIONS.INVENTORY_RECEIVE_STOCK, label: "รับสินค้าเข้าคลัง" },
  ],
  "การขายและเอกสาร": [
    { id: PERMISSIONS.SALES_VIEW, label: "ดูประวัติการขายและใบเสร็จ" },
    { id: PERMISSIONS.INVOICES_MANAGE, label: "จัดการใบแจ้งหนี้" },
    { id: PERMISSIONS.QUOTATIONS_MANAGE, label: "จัดการใบเสนอราคา" },
  ],
  "ข้อมูลติดต่อ": [
    { id: PERMISSIONS.CONTACTS_VIEW, label: "ดูข้อมูลลูกค้าและซัพพลายเออร์" },
    { id: PERMISSIONS.CONTACTS_MANAGE, label: "จัดการ (เพิ่ม/แก้ไข/ลบ) ข้อมูลติดต่อ" },
  ],
  "จัดซื้อ": [
    { id: PERMISSIONS.PURCHASE_ORDERS_VIEW, label: "ดูใบสั่งซื้อ" },
    { id: PERMISSIONS.PURCHASE_ORDERS_MANAGE, label: "จัดการใบสั่งซื้อ" },
  ],
  "บัญชี": [
    { id: PERMISSIONS.ACCOUNTING_VIEW, label: "ดูข้อมูลทางบัญชี (ผังบัญชี, รายวัน)" },
    { id: PERMISSIONS.ACCOUNTING_MANAGE, label: "ลงบันทึกรายวัน" },
  ],
  "รายงาน": [
    { id: PERMISSIONS.REPORTS_VIEW_SALES, label: "ดูรายงานการขาย" },
    { id: PERMISSIONS.REPORTS_VIEW_INVENTORY, label: "ดูรายงานสินค้าคงคลัง" },
    { id: PERMISSIONS.REPORTS_VIEW_PAWN, label: "ดูรายงานการจำนำ" },
    { id: PERMISSIONS.REPORTS_VIEW_FINANCIAL, label: "ดูรายงานทางการเงิน" },
  ],
  "จำนำ": [
    { id: PERMISSIONS.PAWN_VIEW, label: "ดูข้อมูลการจำนำ" },
    { id: PERMISSIONS.PAWN_MANAGE, label: "จัดการ (เพิ่ม/แก้ไข) รายการจำนำ" },
  ],
  "บุคคลและเงินเดือน": [
    { id: PERMISSIONS.HR_EMPLOYEES_VIEW, label: "ดูข้อมูลพนักงาน" },
    { id: PERMISSIONS.HR_EMPLOYEES_MANAGE, label: "จัดการข้อมูลพนักงาน" },
    { id: PERMISSIONS.HR_PAYROLL_PROCESS, label: "คำนวณและจ่ายเงินเดือน" },
  ],
  "ตั้งค่าระบบ": [
    { id: PERMISSIONS.SETTINGS_MANAGE_GENERAL, label: "จัดการตั้งค่าทั่วไป" },
    { id: PERMISSIONS.SETTINGS_MANAGE_ROLES, label: "จัดการตำแหน่งและสิทธิ์" },
    { id: PERMISSIONS.SETTINGS_MANAGE_USERS, label: "จัดการบัญชีผู้ใช้" },
  ],
};
