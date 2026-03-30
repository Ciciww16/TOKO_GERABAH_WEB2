// src/pages/AdminProducts.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    stock: "",
    description: ""
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'admin') {
      alert('Akses ditolak! Halaman ini hanya untuk Admin.');
      navigate('/produk');
    }
    fetchProducts();
    fetchCategories();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/products", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/categories", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: "", category_id: "", price: "", stock: "", description: "" });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id || "",
      price: product.price,
      stock: product.stock,
      description: product.description || ""
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Gagal menghapus produk');
      }

      alert('✅ Produk berhasil dihapus');
      fetchProducts();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `http://localhost:5000/products/${editingProduct.id}`
        : "http://localhost:5000/products";
      
      const method = editingProduct ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          description: formData.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Gagal menyimpan produk');
      }

      alert(`✅ Produk berhasil ${editingProduct ? 'diupdate' : 'ditambahkan'}`);
      setShowModal(false);
      fetchProducts();
      
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>📦 Manajemen Produk</h1>
            <p style={subtitleStyle}>Kelola produk (Tambah, Edit, Hapus)</p>
          </div>
          <button style={addButtonStyle} onClick={handleAddProduct}>
            + Tambah Produk Baru
          </button>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nama Produk</th>
                <th style={thStyle}>Kategori</th>
                <th style={thStyle}>Harga</th>
                <th style={thStyle}>Stok</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={emptyStyle}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="6" style={emptyStyle}>Tidak ada produk</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td style={tdStyle}>{product.id}</td>
                    <td style={tdStyle}>{product.name}</td>
                    <td style={tdStyle}>
                      {categories.find(c => c.id === product.category_id)?.name || '-'}
                    </td>
                    <td style={tdStyle}>Rp {parseFloat(product.price).toLocaleString()}</td>
                    <td style={tdStyle}>
                      <span style={product.stock > 0 ? stockActiveStyle : stockInactiveStyle}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button 
                        style={editButtonStyle}
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button 
                        style={deleteButtonStyle}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>Nama Produk *</label>
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
                <label style={modalLabelStyle}>Kategori</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  style={modalSelectStyle}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div style={modalRowStyle}>
                <div style={{ flex: 1 }}>
                  <label style={modalLabelStyle}>Harga *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    style={modalInputStyle}
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={modalLabelStyle}>Stok</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    style={modalInputStyle}
                    min="0"
                  />
                </div>
              </div>
              
              <div style={modalFormGroupStyle}>
                <label style={modalLabelStyle}>Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={modalTextareaStyle}
                  rows="3"
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
                  {editingProduct ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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

const stockActiveStyle = {
  background: "#4caf50",
  color: "white",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
};

const stockInactiveStyle = {
  background: "#f44336",
  color: "white",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
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
  border: "2px solid #f44336",
  color: "#f44336",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const emptyStyle = {
  padding: "40px",
  textAlign: "center",
  color: "#999",
};

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
  marginBottom: "15px",
};

const modalRowStyle = {
  display: "flex",
  gap: "15px",
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
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  boxSizing: "border-box",
};

const modalSelectStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  backgroundColor: "white",
};

const modalTextareaStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  fontFamily: "inherit",
  resize: "vertical",
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

export default AdminProducts;