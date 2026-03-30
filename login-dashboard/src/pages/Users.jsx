// src/pages/Users.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'admin') {
      alert('⚠️ Akses Ditolak! Halaman ini hanya untuk Admin.');
      navigate('/produk');
    }
  }, [navigate]);

  // Data dummy users dari database
  useEffect(() => {
    const dummyUsers = [
      { id: 1, name: "Rangga Pratama", email: "rangga@email.com", role: "admin", status: "Aktif" },
      { id: 2, name: "Rizki Maulana", email: "rizki@email.com", role: "customer", status: "Aktif" },
      { id: 3, name: "Fahri Hidayat", email: "fahri@email.com", role: "cashier", status: "Aktif" },
      { id: 4, name: "Nadia Putri", email: "nadia@email.com", role: "customer", status: "Aktif" },
      { id: 5, name: "Aditya Wibowo", email: "aditya@email.com", role: "cashier", status: "Nonaktif" },
    ];
    setUsers(dummyUsers);
    setLoading(false);
  }, []);

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>👥 Manajemen User</h1>
            <p style={subtitleStyle}>Kelola user (Aktif/Nonaktifkan)</p>
          </div>
          <button style={addButtonStyle} onClick={() => alert('Tambah user baru')}>
            + Tambah User
          </button>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={tdStyle}>{user.id}</td>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={getRoleBadge(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={user.status === 'Aktif' ? statusActiveStyle : statusInactiveStyle}>
                      {user.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {user.status === 'Aktif' ? (
                      <button style={deactivateButtonStyle}>Nonaktifkan</button>
                    ) : (
                      <button style={activateButtonStyle}>Aktifkan</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper function untuk badge role
const getRoleBadge = (role) => ({
  background: role === 'admin' ? '#ff69b4' : 
              role === 'cashier' ? '#4caf50' : '#2196f3',
  color: 'white',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
});

// Styles
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
  fontFamily: "'Poppins', sans-serif",
  padding: "100px 20px 40px 20px",
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const titleStyle = {
  fontSize: "32px",
  color: "#8b5f6c",
  margin: "0 0 5px 0",
};

const subtitleStyle = {
  fontSize: "16px",
  color: "#b48c9c",
  margin: 0,
};

const addButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

const tableContainerStyle = {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(255,182,193,0.2)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  background: "linear-gradient(135deg, #ffb6c1, #ffc0cb)",
  color: "white",
  padding: "15px",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #ffb6c1",
  color: "#333",
};

const statusActiveStyle = {
  background: "#4caf50",
  color: "white",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "500",
};

const statusInactiveStyle = {
  background: "#f44336",
  color: "white",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "500",
};

const deactivateButtonStyle = {
  background: "transparent",
  border: "2px solid #f44336",
  color: "#f44336",
  padding: "5px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const activateButtonStyle = {
  background: "transparent",
  border: "2px solid #4caf50",
  color: "#4caf50",
  padding: "5px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

export default Users;