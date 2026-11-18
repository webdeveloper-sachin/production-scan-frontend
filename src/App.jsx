import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import RequireAuth from './components/auth/RequireAuth.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import EmployeeLayout from './components/layout/EmployeeLayout.jsx';
import EmployeeLogin from './components/features/EmployeeLogin.jsx';
import ScanPage from './pages/ScanPage.jsx';
import MyEarningsPage from './pages/MyEarningsPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import OrdersPage from './pages/admin/OrdersPage.jsx';
import SyncOrdersPage from './pages/admin/SyncOrdersPage.jsx';
import RatesPage from './pages/admin/RatesPage.jsx';
import StylesPage from './pages/admin/StylesPage.jsx';
import TeamPage from './pages/admin/TeamPage.jsx';
import StatementsPage from './pages/admin/StatementsPage.jsx';
import AccountPage from './pages/admin/AccountPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// /scan: login nahi hai to employee login, employee hai to scanner, admin hai to admin panel
function ScanEntry() {
  const { user } = useAuth();
  if (!user) return <EmployeeLogin />;
  if (user.kind === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <EmployeeLayout><ScanPage /></EmployeeLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route index element={<Navigate to="/scan" replace />} />
      <Route path="scan" element={<ScanEntry />} />

      <Route element={<RequireAuth kind="employee" />}>
        <Route element={<EmployeeLayout />}>
          <Route path="my-earnings" element={<MyEarningsPage />} />
        </Route>
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin" element={<RequireAuth kind="admin" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/sync" element={<SyncOrdersPage />} />
          <Route path="rates" element={<RatesPage />} />
          <Route path="styles" element={<StylesPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="statements" element={<StatementsPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
