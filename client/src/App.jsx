import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { checkAuthStatus } from './features/auth/authSlice';
import Sidebar from './components/Sidebar';
import Spinner from './components/Spinner';

const createPlaceholderPage = (pageName) => () => ( <div className="p-6 bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-gray-200/80"> <h1 className="text-3xl font-bold text-gray-700">หน้า {pageName}</h1> <p className="mt-2 text-gray-500">ส่วนนี้ยังอยู่ในระหว่างการพัฒนาครับ</p> </div> );

import Dashboard from './pages/Dashboard';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import PosPage from './pages/PosPage';
import CalendarPage from './pages/CalendarPage';
import ContactsPage from './pages/ContactsPage';
import ExpensesPage from './pages/ExpensesPage';
import InvoicesPage from './pages/InvoicesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import QuotationsPage from './pages/QuotationsPage';
import ReceiptsPage from './pages/ReceiptsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import StockAdjustmentsPage from './pages/StockAdjustmentsPage';

const CreditDebitNotesPage = createPlaceholderPage('เอกสารลดหนี้/เพิ่มหนี้');
const WarehousesPage = createPlaceholderPage('คลังสินค้า');
const FinanceOverviewPage = createPlaceholderPage('ภาพรวมการเงิน');
const CashManagementPage = createPlaceholderPage('เงินสด/ธนาคาร');
const ChequesPage = createPlaceholderPage('เช็ครับ/จ่าย');
const ChartOfAccountsPage = createPlaceholderPage('ผังบัญชี');
const JournalPage = createPlaceholderPage('สมุดรายวัน');
const BankReconciliationPage = createPlaceholderPage('กระทบยอดธนาคาร');
const PayrollPage = createPlaceholderPage('เงินเดือน');
const AssetsPage = createPlaceholderPage('สินทรัพย์');

const AuthWrapper = () => { const { user } = useSelector((state) => state.auth); return user ? <Outlet /> : <Navigate to="/login" />; };

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const mainContentRef = useRef(null);
  const handleMainContentClick = () => { if (isSidebarOpen) { setSidebarOpen(false); } };

  return (
    <div className='flex h-screen font-sans'>
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div ref={mainContentRef} onClick={handleMainContentClick} className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto'>
          <div className='container mx-auto px-6 py-8'> <Outlet /> </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);
  useEffect(() => { dispatch(checkAuthStatus()); }, [dispatch]);
  if (isLoading) { return <Spinner />; }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route element={<AuthWrapper />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/receipts" element={<ReceiptsPage />} />
              <Route path="/credit-debit-notes" element={<CreditDebitNotesPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/stock-adjustments" element={<StockAdjustmentsPage />} />
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/finance-overview" element={<FinanceOverviewPage />} />
              <Route path="/cash-management" element={<CashManagementPage />} />
              <Route path="/cheques" element={<ChequesPage />} />
              <Route path="/chart-of-accounts" element={<ChartOfAccountsPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/bank-reconciliation" element={<BankReconciliationPage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
