import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing'; // Asegúrate de tener este archivo
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { Settings } from './pages/Settings';
import { InvoicesList } from './pages/InvoicesList';
import { CreateInvoice } from './pages/CreateInvoice';
import { PaymentResult } from './pages/PaymentResult';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/dashboard/invoices" element={<InvoicesList />} />
          <Route path="/dashboard/create-invoice" element={<CreateInvoice />} />
          
          <Route path="/dashboard/pricing" element={<Pricing />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/payment-result" element={<PaymentResult />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;