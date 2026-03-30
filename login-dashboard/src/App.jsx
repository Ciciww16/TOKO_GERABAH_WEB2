// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Produk from "./pages/Produk";
import Kategori from "./pages/Kategori";
import Transactions from "./pages/Transactions";
import Pesanan from "./pages/Pesanan";
import Laporan from "./pages/Laporan";
import Pengaturan from "./pages/Pengaturan";
import AdminCategories from "./pages/AdminCategories";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* ============================================
              PUBLIC ROUTES (TIDAK PERLU LOGIN)
          ============================================ */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ============================================
              PROTECTED ROUTES (HARUS LOGIN)
          ============================================ */}

          {/* SEMUA USER (Admin, Cashier, Customer) */}
          <Route path="/produk" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier', 'customer']}>
              <Produk />
            </ProtectedRoute>
          } />
          
          <Route path="/kategori" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier', 'customer']}>
              <Kategori />
            </ProtectedRoute>
          } />
          
          <Route path="/pesanan" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier', 'customer']}>
              <Pesanan />
            </ProtectedRoute>
          } />
          
          {/* TAMBAHKAN ROUTE PROFILE (SEMUA USER) */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier', 'customer']}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* KHUSUS ADMIN & CASHIER */}
          <Route path="/transactions" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier']}>
              <Transactions />
            </ProtectedRoute>
          } />

          {/* KHUSUS ADMIN */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/categories" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCategories />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/products" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProducts />
            </ProtectedRoute>
          } />
          
          {/* TAMBAHKAN ROUTE ADMIN USERS */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/laporan" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Laporan />
            </ProtectedRoute>
          } />
          
          <Route path="/pengaturan" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Pengaturan />
            </ProtectedRoute>
          } />

          {/* ============================================
              ROUTE 404 - HALAMAN TIDAK DITEMUKAN
          ============================================ */}
          <Route path="*" element={
            <div style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
              fontFamily: "'Poppins', sans-serif",
            }}>
              <h1 style={{
                fontSize: "120px",
                color: "#ff69b4",
                margin: "0",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}>404</h1>
              <p style={{
                fontSize: "24px",
                color: "#8b5f6c",
                margin: "0 0 30px 0",
              }}>Halaman tidak ditemukan</p>
              <button 
                style={{
                  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
                  color: "white",
                  border: "none",
                  padding: "12px 30px",
                  borderRadius: "30px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 5px 15px rgba(255,105,180,0.3)",
                }}
                onClick={() => window.location.href = '/'}
              >
                Kembali ke Login
              </button>
            </div>
          } />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;