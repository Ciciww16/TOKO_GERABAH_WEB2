// src/pages/Pengaturan.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function Pengaturan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("toko");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'admin') {
      alert('⚠️ Akses Ditolak! Halaman ini hanya untuk Admin.');
      navigate('/produk');
    }
  }, [navigate]);

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>⚙️ Pengaturan</h1>
          <p style={subtitleStyle}>Kelola pengaturan toko</p>
        </div>

        {/* Tab Navigation */}
        <div style={tabContainerStyle}>
          <button 
            style={activeTab === 'toko' ? tabActiveStyle : tabButtonStyle}
            onClick={() => setActiveTab('toko')}
          >
            🏪 Profil Toko
          </button>
          <button 
            style={activeTab === 'akun' ? tabActiveStyle : tabButtonStyle}
            onClick={() => setActiveTab('akun')}
          >
            👤 Akun Admin
          </button>
          <button 
            style={activeTab === 'notif' ? tabActiveStyle : tabButtonStyle}
            onClick={() => setActiveTab('notif')}
          >
            🔔 Notifikasi
          </button>
          <button 
            style={activeTab === 'pembayaran' ? tabActiveStyle : tabButtonStyle}
            onClick={() => setActiveTab('pembayaran')}
          >
            💳 Pembayaran
          </button>
        </div>

        {/* Content based on tab */}
        <div style={contentStyle}>
          {activeTab === 'toko' && (
            <div style={formContainerStyle}>
              <h3 style={formTitleStyle}>Informasi Toko</h3>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Nama Toko</label>
                <input type="text" value="SC Pottery Store" style={inputStyle} readOnly />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input type="email" value="info@scpottery.com" style={inputStyle} readOnly />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Telepon</label>
                <input type="text" value="0812-3456-7890" style={inputStyle} readOnly />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Alamat</label>
                <textarea rows="3" value="Jl. Keramik No. 123, Jakarta" style={textareaStyle} readOnly />
              </div>
              
              <button style={saveButtonStyle}>Simpan Perubahan</button>
            </div>
          )}

          {activeTab === 'akun' && (
            <div style={formContainerStyle}>
              <h3 style={formTitleStyle}>Ubah Password Admin</h3>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Password Lama</label>
                <input type="password" placeholder="Masukkan password lama" style={inputStyle} />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Password Baru</label>
                <input type="password" placeholder="Masukkan password baru" style={inputStyle} />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Konfirmasi Password Baru</label>
                <input type="password" placeholder="Konfirmasi password baru" style={inputStyle} />
              </div>
              
              <button style={saveButtonStyle}>Ubah Password</button>
            </div>
          )}

          {activeTab === 'notif' && (
            <div style={formContainerStyle}>
              <h3 style={formTitleStyle}>Pengaturan Notifikasi</h3>
              
              <div style={toggleContainerStyle}>
                <div>
                  <span style={toggleLabelStyle}>Notifikasi Email</span>
                  <p style={toggleDescStyle}>Terima notifikasi via email</p>
                </div>
                <label style={switchStyle}>
                  <input type="checkbox" defaultChecked style={checkboxStyle} />
                  <span style={sliderStyle}></span>
                </label>
              </div>
              
              <div style={toggleContainerStyle}>
                <div>
                  <span style={toggleLabelStyle}>Notifikasi WhatsApp</span>
                  <p style={toggleDescStyle}>Terima notifikasi via WhatsApp</p>
                </div>
                <label style={switchStyle}>
                  <input type="checkbox" style={checkboxStyle} />
                  <span style={sliderStyle}></span>
                </label>
              </div>
              
              <div style={toggleContainerStyle}>
                <div>
                  <span style={toggleLabelStyle}>Notifikasi Transaksi</span>
                  <p style={toggleDescStyle}>Notifikasi setiap ada transaksi baru</p>
                </div>
                <label style={switchStyle}>
                  <input type="checkbox" defaultChecked style={checkboxStyle} />
                  <span style={sliderStyle}></span>
                </label>
              </div>
              
              <button style={saveButtonStyle}>Simpan Pengaturan</button>
            </div>
          )}

          {activeTab === 'pembayaran' && (
            <div style={formContainerStyle}>
              <h3 style={formTitleStyle}>Metode Pembayaran</h3>
              
              <div style={paymentMethodStyle}>
                <span style={paymentIconStyle}>🏦</span>
                <div style={paymentInfoStyle}>
                  <span style={paymentNameStyle}>Bank BCA</span>
                  <span style={paymentDetailStyle}>1234567890 a.n. SC Pottery</span>
                </div>
                <button style={editButtonStyle}>Edit</button>
              </div>
              
              <div style={paymentMethodStyle}>
                <span style={paymentIconStyle}>📱</span>
                <div style={paymentInfoStyle}>
                  <span style={paymentNameStyle}>DANA</span>
                  <span style={paymentDetailStyle}>0812-3456-7890</span>
                </div>
                <button style={editButtonStyle}>Edit</button>
              </div>
              
              <div style={paymentMethodStyle}>
                <span style={paymentIconStyle}>💳</span>
                <div style={paymentInfoStyle}>
                  <span style={paymentNameStyle}>OVO</span>
                  <span style={paymentDetailStyle}>0812-3456-7890</span>
                </div>
                <button style={editButtonStyle}>Edit</button>
              </div>
              
              <button style={addButtonStyle}>+ Tambah Metode Pembayaran</button>
            </div>
          )}
        </div>
      </div>
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
  maxWidth: "800px",
  margin: "0 auto",
};

const headerStyle = {
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

const tabContainerStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "30px",
  flexWrap: "wrap",
  background: "white",
  padding: "10px",
  borderRadius: "50px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
};

const tabButtonStyle = {
  padding: "10px 20px",
  borderRadius: "30px",
  border: "none",
  background: "transparent",
  color: "#b48c9c",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s",
};

const tabActiveStyle = {
  ...tabButtonStyle,
  background: "#ff69b4",
  color: "white",
};

const contentStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
};

const formContainerStyle = {};

const formTitleStyle = {
  fontSize: "18px",
  color: "#8b5f6c",
  margin: "0 0 20px 0",
  paddingBottom: "10px",
  borderBottom: "1px solid #ffb6c1",
};

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  color: "#666",
  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box",
};

const saveButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px 30px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px",
};

const toggleContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 0",
  borderBottom: "1px solid #ffb6c1",
};

const toggleLabelStyle = {
  fontSize: "16px",
  color: "#333",
  fontWeight: "500",
};

const toggleDescStyle = {
  fontSize: "12px",
  color: "#b48c9c",
  margin: "5px 0 0 0",
};

const switchStyle = {
  position: "relative",
  display: "inline-block",
  width: "50px",
  height: "24px",
};

const checkboxStyle = {
  opacity: 0,
  width: 0,
  height: 0,
};

const sliderStyle = {
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#ccc",
  transition: ".4s",
  borderRadius: "24px",
};

const paymentMethodStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "15px",
  background: "#fff0f5",
  borderRadius: "12px",
  marginBottom: "10px",
};

const paymentIconStyle = {
  fontSize: "24px",
};

const paymentInfoStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const paymentNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#333",
};

const paymentDetailStyle = {
  fontSize: "13px",
  color: "#b48c9c",
};

const editButtonStyle = {
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "5px 15px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const addButtonStyle = {
  width: "100%",
  background: "transparent",
  border: "2px dashed #ff69b4",
  color: "#ff69b4",
  padding: "15px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "15px",
};

export default Pengaturan;