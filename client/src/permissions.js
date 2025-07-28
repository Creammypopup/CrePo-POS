// client/src/permissions.js
export const permissions = {
  VIEW_DASHBOARD: { id: 'view_dashboard', name: 'ดูภาพรวม' },
  VIEW_CALENDAR: { id: 'view_calendar', name: 'ดูปฏิทิน' },
  MANAGE_POS: { id: 'manage_pos', name: 'จัดการขายหน้าร้าน' },
  VIEW_RECEIPTS: { id: 'view_receipts', name: 'ดูใบเสร็จ' },
  MANAGE_INVOICES: { id: 'manage_invoices', name: 'จัดการใบแจ้งหนี้' },
  MANAGE_QUOTATIONS: { id: 'manage_quotations', name: 'จัดการใบเสนอราคา' },
  MANAGE_EXPENSES: { id: 'manage_expenses', name: 'จัดการค่าใช้จ่าย' },
  MANAGE_PRODUCTS: { id: 'manage_products', name: 'จัดการสินค้า' },
  MANAGE_STOCK_ADJUSTMENTS: { id: 'manage_stock_adjustments', name: 'ปรับสต็อก' },
  MANAGE_PURCHASE_ORDERS: { id: 'manage_purchase_orders', name: 'จัดการใบสั่งซื้อ' },
  MANAGE_CONTACTS: { id: 'manage_contacts', name: 'จัดการผู้ติดต่อ' },
  VIEW_REPORTS: { id: 'view_reports', name: 'ดูรายงาน' },
  MANAGE_ACCOUNTING: { id: 'manage_accounting', name: 'จัดการบัญชี' },
  MANAGE_USERS: { id: 'manage_users', name: 'จัดการผู้ใช้งาน' },
  MANAGE_ROLES: { id: 'manage_roles', name: 'จัดการตำแหน่งและสิทธิ์' },
  MANAGE_SETTINGS: { id: 'manage_settings', name: 'ตั้งค่าทั่วไป' },
};

export const ALL_PERMISSIONS = Object.values(permissions);