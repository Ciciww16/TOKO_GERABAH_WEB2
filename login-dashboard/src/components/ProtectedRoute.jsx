// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    
    if (token && role) {
      setUser({ role, name, token });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    setTimeout(() => {
      alert(`⚠️ Akses Ditolak!\n\nHalaman ini hanya untuk: ${allowedRoles.join(', ')}`);
    }, 100);
    return <Navigate to="/produk" replace />;
  }

  return children;
};

export default ProtectedRoute;