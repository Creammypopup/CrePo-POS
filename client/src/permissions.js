// client/src/permissions.js

// กำหนดค่าคงที่สำหรับสิทธิ์ต่างๆ เพื่อป้องกันการพิมพ์ผิดและจัดการได้ง่าย
export const permissions = {
  // General
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_CALENDAR: 'view_calendar',
  
  // Sales
  MANAGE_POS: 'manage_pos',
  VIEW_RECEIPTS: 'view_receipts',
  MANAGE_INVOICES: 'manage_invoices',
  MANAGE_QUOTATIONS: 'manage_quotations',

  // Expenses
  MANAGE_EXPENSES: 'manage_expenses',

  // Inventory
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_STOCK_ADJUSTMENTS: 'manage_stock_adjustments',
  MANAGE_PURCHASE_ORDERS: 'manage_purchase_orders',

  // Contacts
  MANAGE_CONTACTS: 'manage_contacts',

  // Accounting
  VIEW_REPORTS: 'view_reports',
  MANAGE_ACCOUNTING: 'manage_accounting', // For Chart of Accounts & Journal

  // Settings
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_SETTINGS: 'manage_settings',
};

// --- ส่วนที่เพิ่มเข้ามาเพื่อแก้ไข Error ---
// สร้าง Array ของ permission ทั้งหมดจาก object ด้านบน
// เพื่อให้หน้าจัดการตำแหน่ง (RolesPage) สามารถนำไปแสดงผลได้
export const ALL_PERMISSIONS = Object.values(permissions);
