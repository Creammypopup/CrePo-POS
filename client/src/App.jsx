import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { getMe } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- START OF FIX: Ensure all pages are imported correctly ---
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

// Import All Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PosPage from './pages/PosPage';
import ProductsPage from './pages/ProductsPage';
import ExpensesPage from './pages/ExpensesPage';
import ContactsPage from './pages/ContactsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/settings/UsersPage';
import QuotationsPage from './pages/QuotationsPage';
import InvoicesPage from './pages/InvoicesPage';
import ReceiptsPage from './pages/ReceiptsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import StockAdjustmentsPage from './pages/StockAdjustmentsPage';
import ChartOfAccountsPage from './pages/accounting/ChartOfAccountsPage';
import JournalPage from './pages/accounting/JournalPage';
import RolesPage from './pages/settings/RolesPage';
import ThemePage from './pages/settings/ThemePage';
import GeneralPage from './pages/settings/GeneralPage';
import CalendarPage from './pages/CalendarPage'; // << เพิ่มบรรทัดนี้

// --- END OF FIX ---

// AuthLoader Component
function AuthLoader() {
    return (
        <div className="min-h-screen bg-base flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-pastel-purple animate-pulse">CrePo POS</h1>
            <p className="text-secondary-text mt-2">กำลังตรวจสอบข้อมูล...</p>
        </div>
    );
}

// App Layout for logged-in users
function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-base font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('user')) {
        dispatch(getMe());
    }
  }, [dispatch]);

  if (isAuthLoading && localStorage.getItem('user')) {
    return <AuthLoader />;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/receipts" element={<ReceiptsPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/stock-adjustments" element={<StockAdjustmentsPage />} />
              <Route path="/accounting/chart-of-accounts" element={<ChartOfAccountsPage />} />
              <Route path="/accounting/journal" element={<JournalPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/calendar" element={<CalendarPage />} /> {/* << เพิ่มบรรทัดนี้ */}
              <Route path="/settings/users" element={<UsersPage />} />
              <Route path="/settings/roles" element={<RolesPage />} />
              <Route path="/settings/theme" element={<ThemePage />} />
              <Route path="/settings/general" element={<GeneralPage />} />
            </Route>
          </Route>

        </Routes>
      </Router>
      <ToastContainer autoClose={3000} />
    </>
  );
}

export default App;