// src/pages/Pesanan.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function Pesanan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || "User";
    setUserName(name);
  }, []);

  // Data dummy pesanan
  useEffect(() => {
    const dummyOrders = [
      { id: 1, invoice: "INV-20250312-001", date: "2025-03-12", items: 3, total: 250000, status: "Selesai", products: ["Vas Bunga", "Piring Makan", "Cangkir"] },
      { id: 2, invoice: "INV-20250310-001", date: "2025-03-10", items: 2, total: 180000, status: "Dikirim", products: ["Guci Bunga", "Tempat Lilin"] },
      { id: 3, invoice: "INV-20250305-001", date: "2025-03-05", items: 1, total: 150000, status: "Diproses", products: ["Lampu Meja"] },
    ];
    setOrders(dummyOrders);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selesai': return '#4caf50';
      case 'Dikirim': return '#2196f3';
      case 'Diproses': return '#ff9800';
      default: return '#999';
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📦 Pesanan Saya</h1>
          <p style={subtitleStyle}>Halo {userName}, ini daftar pesanan kamu</p>
        </div>

        {loading ? (
          <div style={emptyStyle}>Loading...</div>
        ) : orders.length === 0 ? (
          <div style={emptyStyle}>
            <p style={emptyTextStyle}>Kamu belum punya pesanan</p>
            <button style={belanjaButtonStyle} onClick={() => navigate('/produk')}>
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div style={ordersContainerStyle}>
            {orders.map(order => (
              <div key={order.id} style={orderCardStyle}>
                <div style={orderHeaderStyle}>
                  <div>
                    <span style={orderInvoiceStyle}>{order.invoice}</span>
                    <span style={orderDateStyle}>{order.date}</span>
                  </div>
                  <span style={{...orderStatusStyle, background: getStatusColor(order.status)}}>
                    {order.status}
                  </span>
                </div>
                
                <div style={orderProductsStyle}>
                  {order.products.map((product, idx) => (
                    <span key={idx} style={productTagStyle}>{product}</span>
                  ))}
                </div>
                
                <div style={orderFooterStyle}>
                  <span style={orderTotalStyle}>
                    Total: Rp {order.total.toLocaleString()}
                  </span>
                  <button style={detailButtonStyle} onClick={() => alert(`Detail pesanan ${order.invoice}`)}>
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

const ordersContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const orderCardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
  border: "1px solid rgba(255,255,255,0.8)",
};

const orderHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  paddingBottom: "10px",
  borderBottom: "1px solid #ffb6c1",
};

const orderInvoiceStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#8b5f6c",
  marginRight: "15px",
};

const orderDateStyle = {
  fontSize: "13px",
  color: "#b48c9c",
};

const orderStatusStyle = {
  padding: "5px 15px",
  borderRadius: "20px",
  color: "white",
  fontSize: "12px",
  fontWeight: "500",
};

const orderProductsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "15px",
};

const productTagStyle = {
  background: "#fff0f5",
  color: "#ff69b4",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  border: "1px solid #ffb6c1",
};

const orderFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
};

const orderTotalStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#ff69b4",
};

const detailButtonStyle = {
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "8px 16px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const emptyStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: "16px",
  color: "#b48c9c",
};

const emptyTextStyle = {
  fontSize: "16px",
  marginBottom: "20px",
};

const belanjaButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px 30px",
  borderRadius: "30px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default Pesanan;