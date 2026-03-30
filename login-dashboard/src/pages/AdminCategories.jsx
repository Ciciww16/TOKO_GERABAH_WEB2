// src/pages/AdminCategories.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useCart } from "../context/CartContext";

function AdminCategories() {
  const navigate = useNavigate();
  const { user, tambahKategori, editKategori, hapusKategori } = useCart();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Cek apakah user adalah admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Akses ditolak! Halaman ini hanya untuk admin.');
      navigate('/produk');
    }
  }, [user, navigate]);

  // Data dummy kategori
  useEffect(() => {
    setCategories([
      { id: 1, name: "Vas", description: "Vas keramik berbagai ukuran", product_count: 5 },
      { id: 2, name: "Piring", description: "Piring gerabah handmade", product_count: 3 },
      { id: 3, name: "Cangkir", description: "Cangkir keramik untuk minum", product_count: 4 },
    ]);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      hapusKategori(id);
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Edit kategori
      editKategori(editingCategory.id, formData);
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...formData }
          : c
      ));
      alert('Kategori berhasil diupdate!');
    } else {
      // Tambah kategori baru
      tambahKategori(formData);
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories([...categories, { id: newId, ...formData, product_count: 0 }]);
      alert('Kategori berhasil ditambahkan!');
    }
    
    setShowModal(false);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>📋 Manage Categories</h1>
            <p style={subtitleStyle}>Kelola kategori produk (Admin Only)</p>
          </div>
          <button style={addButtonStyle} onClick={handleAddCategory}>
            + Tambah Kategori
          </button>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nama Kategori</th>
                <th style={thStyle}>Deskripsi</th>
                <th style={thStyle}>Jumlah Produk</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td style={tdStyle}>{cat.id}</td>
                  <td style={tdStyle}>{cat.name}</td>
                  <td style={tdStyle}>{cat.description}</td>
                  <td style={tdStyle}>{cat.product_count}</td>
                  <td style={tdStyle}>
                    <button 
                      style={editButtonStyle}
                      onClick={() => handleEditCategory(cat)}
                    >
                      Edit
                    </button>
                    <button 
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit Kategori */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>Nama Kategori</label>
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
                <label style={modalLabelStyle}>Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={modalTextareaStyle}
                  rows="3"
                  required
                />
              </div>
              
              <div style={modalButtonGroupStyle}>
                <button 
                  type="button" 
                  style={modalCancelButtonStyle}
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={modalSubmitButtonStyle}
                >
                  {editingCategory ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
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

const tableContainerStyle = {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(255, 182, 193, 0.2)",
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

const editButtonStyle = {
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "6px 12px",
  borderRadius: "8px",
  marginRight: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const deleteButtonStyle = {
  background: "transparent",
  border: "2px solid #ff4444",
  color: "#ff4444",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
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
  maxWidth: "500px",
};

const modalTitleStyle = {
  fontSize: "24px",
  color: "#8b5f6c",
  margin: "0 0 20px 0",
};

const modalFormGroupStyle = {
  marginBottom: "20px",
};

const modalLabelStyle = {
  display: "block",
  fontSize: "14px",
  color: "#666",
  marginBottom: "5px",
};

const modalInputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  boxSizing: "border-box",
};

const modalTextareaStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  fontFamily: "inherit",
  boxSizing: "border-box",
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
  padding: "12px",
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
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default AdminCategories;