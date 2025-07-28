// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Spinner from './components/Spinner';

// Core Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import ContactsPage from './pages/ContactsPage';
import PosPage from './pages/PosPage';

// Sales Pages
import QuotationsPage from './pages/QuotationsPage';
import InvoicesPage from './pages/InvoicesPage';
import ReceiptsPage from './pages/ReceiptsPage';

// Expenses Pages
import ExpensesPage from './pages/ExpensesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';

// Products Pages
import ProductsPage from './pages/ProductsPage';
import StockAdjustmentsPage from './pages/StockAdjustmentsPage';

// Accounting Pages
import ChartOfAccountsPage from './pages/accounting/ChartOfAccountsPage';
import JournalPage from './pages/accounting/JournalPage';

// Settings Pages
import GeneralPage from './pages/settings/GeneralPage';
import UsersPage from './pages/settings/UsersPage';
import RolesPage from './pages/settings/RolesPage';
import ThemePage from './pages/settings/ThemePage';

import { checkAuthStatus } from './features/auth/authSlice';

// Bottom Bar Component for Date
function BottomBar() {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
    // In a real app, you might dispatch this date to Redux store
    // to make it globally available for document creation.
  };

  return (
    <div className="h-10 bg-white/80 backdrop-blur-md border-t border-gray-200/80 flex items-center justify-end px-6 text-sm">
        <div className="flex items-center">
            <FaCalendarAlt className="mr-3 text-brand-purple" />
            <label htmlFor="system-date" className="mr-2 font-medium text-brand-text-light">วันที่ของระบบ:</label>
            <input 
              type="date"
              id="system-date"
              value={currentDate}
              onChange={handleDateChange}
              className="bg-transparent border border-gray-300 rounded-md px-2 py-0.5 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-purple"
            />
        </div>
    </div>
  );
}

// Main Layout
function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleContentClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    // --- START OF EDIT ---
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans">
    {/* --- END OF EDIT --- */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent" onClick={handleContentClick}>
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
        <BottomBar />
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    dispatch(checkAuthStatus()).finally(() => setAuthChecked(true));
  }, [dispatch]);

  if (!authChecked) {
    return <Spinner />;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/sales/create" element={<PosPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/receipts" element={<ReceiptsPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/stock-adjustments" element={<StockAdjustmentsPage />} />
              <Route path="/accounting/chart-of-accounts" element={<ChartOfAccountsPage />} />
              <Route path="/accounting/journal" element={<JournalPage />} />

              {/* Settings Routes - No longer nested */}
              <Route path="/settings/general" element={<GeneralPage />} />
              <Route path="/settings/users" element={<UsersPage />} />
              <Route path="/settings/roles" element={<RolesPage />} />
              <Route path="/settings/theme" element={<ThemePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;