// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Spinner from './components/Spinner';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import ExpensesPage from './pages/ExpensesPage';
import GeneralPage from './pages/settings/GeneralPage';
import UsersPage from './pages/settings/UsersPage';
import RolesPage from './pages/settings/RolesPage';
import CategorySettingsPage from './pages/settings/CategorySettingsPage';
import { checkAuthStatus } from './features/auth/authSlice';

// --- START OF EDIT: Import the actual ProductsPage ---
import ProductsPage from './pages/ProductsPage';
// --- END OF EDIT ---

// Placeholder pages for routes that are not yet developed
const ReportsPage = () => <div className="text-center p-10">Reports Page is under construction.</div>;
const ContactsPage = () => <div className="text-center p-10">Contacts Page is under construction.</div>;
const PosPage = () => <div className="text-center p-10">POS Page is under construction.</div>;
const QuotationsPage = () => <div className="text-center p-10">Quotations Page is under construction.</div>;
const InvoicesPage = () => <div className="text-center p-10">Invoices Page is under construction.</div>;
const ReceiptsPage = () => <div className="text-center p-10">Receipts Page is under construction.</div>;
const PurchaseOrdersPage = () => <div className="text-center p-10">Purchase Orders Page is under construction.</div>;
const StockAdjustmentsPage = () => <div className="text-center p-10">Stock Adjustments Page is under construction.</div>;


function BottomBar() {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const handleDateChange = (e) => { setCurrentDate(e.target.value); };

  return (
    <div className="h-10 bg-[#F5EBE0] border-t border-gray-200/80 flex items-center justify-end px-6 text-sm">
        <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <label htmlFor="system-date" className="mr-2 font-medium text-gray-600 text-xs">วันที่ของระบบ:</label>
            <input
              type="date"
              id="system-date"
              value={currentDate}
              onChange={handleDateChange}
              className="bg-white border border-gray-300 rounded-md px-2 py-0.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-purple text-xs"
            />
        </div>
    </div>
  );
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleContentClick = () => { if (isSidebarOpen) setIsSidebarOpen(false); };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto" onClick={handleContentClick}>
          <div className="container mx-auto px-6 py-8"><Outlet /></div>
        </main>
        <BottomBar />
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => { dispatch(checkAuthStatus()).finally(() => setAuthChecked(true)); }, [dispatch]);
  if (!authChecked) return <Spinner />;
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/sales/create" element={<PosPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/receipts" element={<ReceiptsPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/stock-adjustments" element={<StockAdjustmentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings/general" element={<GeneralPage />} />
              <Route path="/settings/users" element={<UsersPage />} />
              <Route path="/settings/roles" element={<RolesPage />} />
              <Route path="/settings/categories" element={<CategorySettingsPage />} />
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