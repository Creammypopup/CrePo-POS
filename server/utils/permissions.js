/**
 * ศูนย์กลางสำหรับจัดการค่าคงที่ของสิทธิ์ (Permissions) ทั้งหมดในระบบ
 * เพื่อให้เรียกใช้ง่ายและป้องกันการพิมพ์ผิด
 */
const PERMISSIONS = {
  // สิทธิ์ขั้นสูงสุด
  ADMIN: 'admin',

  // สิทธิ์จัดการสินค้า
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_MANAGE: 'products:manage',

  // สิทธิ์จัดการหมวดหมู่
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_MANAGE: 'categories:manage',

  // สิทธิ์จัดการผู้จัดจำหน่าย
  SUPPLIERS_VIEW: 'suppliers:view',
  SUPPLIERS_MANAGE: 'suppliers:manage',

  // สิทธิ์จัดการผู้ใช้งาน
  USERS_VIEW: 'users:view',
  USERS_MANAGE: 'users:manage',

  // ... เราจะมาเพิ่มสิทธิ์สำหรับส่วนอื่นๆ ที่นี่ในอนาคต
};

module.exports = { PERMISSIONS };