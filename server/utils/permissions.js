/**
 * ศูนย์กลางสำหรับจัดการค่าคงที่ของสิทธิ์ (Permissions) ทั้งหมดในระบบ
 * เพื่อให้เรียกใช้ง่ายและป้องกันการพิมพ์ผิด
 */
const PERMISSIONS = {
  // สิทธิ์ขั้นสูงสุด
  ADMIN: 'admin',

  // สิทธิ์จัดการ Dashboard
  DASHBOARD_VIEW: 'view_dashboard',

  // สิทธิ์จัดการ POS / การขาย
  POS_MANAGE: 'manage_pos',
  RECEIPTS_VIEW: 'view_receipts',
  SALES_MANAGE: 'manage_sales',

  // สิทธิ์จัดการใบเสนอราคา
  QUOTATIONS_MANAGE: 'manage_quotations',

  // สิทธิ์จัดการใบแจ้งหนี้ (Invoices)
  INVOICES_MANAGE: 'manage_invoices',

  // สิทธิ์จัดการค่าใช้จ่าย
  EXPENSES_MANAGE: 'manage_expenses',

  // สิทธิ์จัดการสินค้า
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_MANAGE: 'manage_products',

  // สิทธิ์จัดการสต็อก
  STOCK_ADJUSTMENTS_MANAGE: 'manage_stock_adjustments',

  // สิทธิ์จัดการคำสั่งซื้อ (Purchase Orders)
  PURCHASE_ORDERS_MANAGE: 'manage_purchase_orders',

  // สิทธิ์จัดการผู้ติดต่อ (ลูกค้า/ซัพพลายเออร์)
  CONTACTS_MANAGE: 'manage_contacts',

  // สิทธิ์จัดการรายงาน
  REPORTS_VIEW: 'view_reports',

  // สิทธิ์จัดการบัญชี (Accounting)
  ACCOUNTING_MANAGE: 'manage_accounting',

  // สิทธิ์จัดการปฏิทิน
  CALENDAR_VIEW: 'view_calendar',

  // สิทธิ์จัดการผู้ใช้งานและบทบาท
  USERS_MANAGE: 'manage_users',
  ROLES_MANAGE: 'manage_roles',

  // สิทธิ์จัดการการตั้งค่าระบบ
  SETTINGS_MANAGE: 'manage_settings',

  // สิทธิ์จัดการหมวดหมู่ (ทั่วไป, ค่าใช้จ่าย)
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_MANAGE: 'categories:manage',

  // สิทธิ์จัดการผู้จัดจำหน่าย
  SUPPLIERS_VIEW: 'suppliers:view',
  SUPPLIERS_MANAGE: 'suppliers:manage',

  // สิทธิ์จัดการลูกค้า
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_MANAGE: 'customers:manage',

  // สิทธิ์จัดการจำนำ (Pawn)
  PAWN_MANAGE: 'manage_pawns',

  // สิทธิ์จัดการกะ (Shift)
  SHIFTS_MANAGE: 'manage_shifts',

};

module.exports = { PERMISSIONS };
