// src/pages/AdminUsers.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Pastikan initial state array kosong
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'admin') {
      alert('⚠️ Akses Ditolak! Halaman ini hanya untuk Admin.');
      navigate('/produk');
    }
    fetchUsers();
  }, [navigate]);

  // 🔥 PERBAIKI BAGIAN INI
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Fetching users...');
      
      const response = await fetch("http://localhost:5000/users", {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      // 🔥 PASTIKAN data.users adalah ARRAY
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Data bukan array:', data);
        setUsers([]); // Set ke array kosong jika bukan array
      }
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]); // Set ke array kosong jika error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer"
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
    setShowModal(true);
  };

  const handleDeactivateUser = async (id) => {
    if (!window.confirm('Yakin ingin menonaktifkan user ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${id}/deactivate`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('✅ User berhasil dinonaktifkan');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`❌ Gagal: ${error.msg || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Error deactivating user:', err);
      alert('❌ Gagal menonaktifkan user');
    }
  };

  const handleActivateUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${id}/activate`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('✅ User berhasil diaktifkan');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`❌ Gagal: ${error.msg || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Error activating user:', err);
      alert('❌ Gagal mengaktifkan user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('⚠️ Yakin ingin menghapus user ini? Aksi ini permanen!')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ User berhasil dihapus');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`❌ Gagal: ${error.msg || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('❌ Gagal menghapus user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      let url = "http://localhost:5000/users";
      let method = "POST";

      if (editingUser) {
        url = `http://localhost:5000/users/${editingUser.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ User berhasil ${editingUser ? 'diupdate' : 'ditambahkan'}`);
        setShowModal(false);
        fetchUsers();
      } else {
        alert(`❌ Gagal: ${data.msg || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Error saving user:', err);
      alert('❌ Gagal menyimpan user');
    }
  };

  // Pastikan users adalah array sebelum menggunakan .filter
  const adminCount = Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0;
  const cashierCount = Array.isArray(users) ? users.filter(u => u.role === 'cashier').length : 0;
  const customerCount = Array.isArray(users) ? users.filter(u => u.role === 'customer').length : 0;

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>👥 Manajemen User</h1>
            <p style={subtitleStyle}>Kelola semua pengguna aplikasi</p>
          </div>
          <button style={addButtonStyle} onClick={handleAddUser}>
            + Tambah User Baru
          </button>
        </div>

        {/* Statistik User */}
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <span style={statIconStyle}>👥</span>
            <div>
              <span style={statValueStyle}>{Array.isArray(users) ? users.length : 0}</span>
              <span style={statLabelStyle}>Total User</span>
            </div>
          </div>
          <div style={statCardStyle}>
            <span style={statIconStyle}>👑</span>
            <div>
              <span style={statValueStyle}>{adminCount}</span>
              <span style={statLabelStyle}>Admin</span>
            </div>
          </div>
          <div style={statCardStyle}>
            <span style={statIconStyle}>💰</span>
            <div>
              <span style={statValueStyle}>{cashierCount}</span>
              <span style={statLabelStyle}>Cashier</span>
            </div>
          </div>
          <div style={statCardStyle}>
            <span style={statIconStyle}>👤</span>
            <div>
              <span style={statValueStyle}>{customerCount}</span>
              <span style={statLabelStyle}>Customer</span>
            </div>
          </div>
        </div>

        {/* Tabel User */}
        <div style={tableContainerStyle}>
          {loading ? (
            <div style={loadingStyle}>Memuat data user...</div>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <div style={emptyStyle}>Belum ada data user</div>
          ) : (
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
                      <button style={editButtonStyle} onClick={() => handleEditUser(user)}>
                        Edit
                      </button>
                      {user.status === 'Aktif' ? (
                        <button style={deactivateButtonStyle} onClick={() => handleDeactivateUser(user.id)}>
                          Nonaktifkan
                        </button>
                      ) : (
                        <button style={activateButtonStyle} onClick={() => handleActivateUser(user.id)}>
                          Aktifkan
                        </button>
                      )}
                      <button style={deleteButtonStyle} onClick={() => handleDeleteUser(user.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Tambah/Edit User */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>
              {editingUser ? 'Edit User' : 'Tambah User Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>
                  {editingUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={modalInputStyle}
                  required={!editingUser}
                />
              </div>
              
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={modalSelectStyle}
                >
                  <option value="customer">Customer</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div style={modalButtonGroupStyle}>
                <button type="button" style={modalCancelButtonStyle} onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" style={modalSubmitButtonStyle}>
                  {editingUser ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STYLES (sama seperti sebelumnya)
// ============================================

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
  fontFamily: "'Poppins', sans-serif",
  padding: "100px 20px 40px 20px",
};

const containerStyle = {
  maxWidth: "1200px",
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

const statsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "30px",
};

const statCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const statIconStyle = {
  fontSize: "32px",
};

const statValueStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ff69b4",
  display: "block",
};

const statLabelStyle = {
  fontSize: "12px",
  color: "#b48c9c",
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

const getRoleBadge = (role) => ({
  background: role === 'admin' ? '#ff69b4' : 
              role === 'cashier' ? '#4caf50' : '#2196f3',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-block',
});

const statusActiveStyle = {
  background: '#4caf50',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-block',
};

const statusInactiveStyle = {
  background: '#f44336',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-block',
};

const editButtonStyle = {
  background: 'transparent',
  border: '2px solid #ff69b4',
  color: '#ff69b4',
  padding: '6px 12px',
  borderRadius: '8px',
  marginRight: '8px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

const deactivateButtonStyle = {
  background: 'transparent',
  border: '2px solid #ff9800',
  color: '#ff9800',
  padding: '6px 12px',
  borderRadius: '8px',
  marginRight: '8px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

const activateButtonStyle = {
  background: 'transparent',
  border: '2px solid #4caf50',
  color: '#4caf50',
  padding: '6px 12px',
  borderRadius: '8px',
  marginRight: '8px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

const deleteButtonStyle = {
  background: 'transparent',
  border: '2px solid #f44336',
  color: '#f44336',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

const loadingStyle = {
  padding: "60px",
  textAlign: "center",
  color: "#b48c9c",
};

const emptyStyle = {
  padding: "60px",
  textAlign: "center",
  color: "#b48c9c",
  fontSize: "16px",
};

// Modal Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(5px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalContentStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "30px",
  width: "90%",
  maxWidth: "400px",
};

const modalTitleStyle = {
  fontSize: "20px",
  color: "#8b5f6c",
  margin: "0 0 20px 0",
};

const modalFormGroupStyle = {
  marginBottom: "15px",
};

const modalLabelStyle = {
  display: "block",
  fontSize: "14px",
  color: "#666",
  marginBottom: "5px",
};

const modalInputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  boxSizing: "border-box",
};

const modalSelectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  backgroundColor: "white",
};

const modalButtonGroupStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const modalCancelButtonStyle = {
  flex: 1,
  background: "transparent",
  border: "2px solid #999",
  color: "#666",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const modalSubmitButtonStyle = {
  flex: 1,
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default AdminUsers;