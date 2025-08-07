// server/utils/permissions.js

// This file defines all possible permissions available in the system.
// It serves as a single source of truth for access control across the application.
// Format: 'feature-action' or 'module-submodule-action'

const PERMISSIONS = {
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

module.exports = { PERMISSIONS };
