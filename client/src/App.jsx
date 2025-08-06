// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';

// --- Core Components ---
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Spinner from './components/Spinner.jsx';

// --- Page Imports ---
import Dashboard from './pages/Dashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ExpensesPage from './pages/ExpensesPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import PosPageWrapper from './pages/PosPageWrapper.jsx';
import CustomersPage from './pages/contacts/CustomersPage.jsx';
import SuppliersPage from './pages/contacts/SuppliersPage.jsx';
import GeneralPage from './pages/settings/GeneralPage.jsx';
import UsersPage from './pages/settings/UsersPage.jsx';
import RolesPage from './pages/settings/RolesPage.jsx';
import PawnPage from './pages/PawnPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import SalesReportPage from './pages/reports/SalesReportPage.jsx';
import InventoryReportPage from './pages/reports/InventoryReportPage.jsx';
import PawnReportPage from './pages/reports/PawnReportPage.jsx';
import ReceiptPage from './pages/ReceiptPage.jsx';

// --- Redux Actions ---
import { checkAuthStatus } from './features/auth/authSlice.js';

// Placeholder pages
const QuotationsPage = () => <div className="text-center p-10">Quotations Page is under construction.</div>;
const InvoicesPage = () => <div className="text-center p-10">Invoices Page is under construction.</div>;
const ReceiptsListPage = () => <div className="text-center p-10">Receipts List Page is under construction.</div>;
const PurchaseOrdersPage = () => <div className="text-center p-10">Purchase Orders Page is under construction.</div>;
const StockAdjustmentsPage = () => <div className="text-center p-10">Stock Adjustments Page is under construction.</div>;

function BottomBar() {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const handleDateChange = (e) => { setCurrentDate(e.target.value); };
  return (
    <div className="h-10 bg-[#F5EBE0] border-t border-gray-200/80 flex items-center justify-end px-6 text-sm flex-shrink-0">
        <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <label htmlFor="system-date" className="mr-2 font-medium text-gray-600 text-xs">วันที่ของระบบ:</label>
            <input type="date" id="system-date" value={currentDate} onChange={handleDateChange} className="bg-white border border-gray-300 rounded-md px-2 py-0.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-purple text-xs"/>
        </div>
    </div>
  );
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleContentClick = (e) => { 
    if (isSidebarOpen && e.target.closest('aside') === null) {
        setIsSidebarOpen(false);
    }
  };
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
              <Route path="/sales/create" element={<PosPageWrapper />} />
              <Route path="/pawn" element={<PawnPage />} /> 
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/contacts/customers" element={<CustomersPage />} />
              <Route path="/contacts/suppliers" element={<SuppliersPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              {/* Reports Routes */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/sales" element={<SalesReportPage />} />
              <Route path="/reports/inventory" element={<InventoryReportPage />} />
              <Route path="/reports/pawn" element={<PawnReportPage />} />
              {/* Document Routes */}
              <Route path="/receipts/:id" element={<ReceiptPage />} />
              <Route path="/receipts" element={<ReceiptsListPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/stock-adjustments" element={<StockAdjustmentsPage />} />
              <Route path="/settings/general" element={<GeneralPage />} />
              <Route path="/settings/users" element={<UsersPage />} />
              <Route path="/settings/roles" element={<RolesPage />} />
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