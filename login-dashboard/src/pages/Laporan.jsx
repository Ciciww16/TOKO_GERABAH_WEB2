// src/pages/Laporan.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function Laporan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [period, setPeriod] = useState("hari");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'admin') {
      alert('⚠️ Akses Ditolak! Halaman ini hanya untuk Admin.');
      navigate('/produk');
    }
  }, [navigate]);

  // Data dummy laporan
  const laporanData = {
    hari: {
      total: 1250000,
      transaksi: 5,
      produkTerjual: 12,
      pendapatanBersih: 1125000,
    },
    minggu: {
      total: 4850000,
      transaksi: 18,
      produkTerjual: 45,
      pendapatanBersih: 4365000,
    },
    bulan: {
      total: 15200000,
      transaksi: 52,
      produkTerjual: 138,
      pendapatanBersih: 13680000,
    },
    tahun: {
      total: 156800000,
      transaksi: 520,
      produkTerjual: 1450,
      pendapatanBersih: 141120000,
    }
  };

  const data = laporanData[period];

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📈 Laporan Penjualan</h1>
          <p style={subtitleStyle}>Analisis dan statistik penjualan</p>
        </div>

        {/* Filter Period */}
        <div style={filterContainerStyle}>
          <button 
            style={period === 'hari' ? periodActiveStyle : periodButtonStyle}
            onClick={() => setPeriod('hari')}
          >
            Hari Ini
          </button>
          <button 
            style={period === 'minggu' ? periodActiveStyle : periodButtonStyle}
            onClick={() => setPeriod('minggu')}
          >
            Minggu Ini
          </button>
          <button 
            style={period === 'bulan' ? periodActiveStyle : periodButtonStyle}
            onClick={() => setPeriod('bulan')}
          >
            Bulan Ini
          </button>
          <button 
            style={period === 'tahun' ? periodActiveStyle : periodButtonStyle}
            onClick={() => setPeriod('tahun')}
          >
            Tahun Ini
          </button>
        </div>

        {/* Summary Cards */}
        <div style={summaryGridStyle}>
          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Total Penjualan</span>
            <span style={summaryValueStyle}>Rp {data.total.toLocaleString()}</span>
            <span style={summaryTrendStyle}>↑ 12%</span>
          </div>
          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Jumlah Transaksi</span>
            <span style={summaryValueStyle}>{data.transaksi}</span>
            <span style={summaryTrendStyle}>↑ 8%</span>
          </div>
          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Produk Terjual</span>
            <span style={summaryValueStyle}>{data.produkTerjual}</span>
            <span style={summaryTrendStyle}>↑ 15%</span>
          </div>
          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Pendapatan Bersih</span>
            <span style={summaryValueStyle}>Rp {data.pendapatanBersih.toLocaleString()}</span>
            <span style={summaryTrendStyle}>↑ 10%</span>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div style={chartContainerStyle}>
          <h3 style={chartTitleStyle}>Grafik Penjualan</h3>
          <div style={chartPlaceholderStyle}>
            <span style={chartEmojiStyle}>📊</span>
            <p style={chartTextStyle}>Grafik penjualan akan ditampilkan di sini</p>
          </div>
        </div>

        {/* Top Products */}
        <div style={topProductsStyle}>
          <h3 style={chartTitleStyle}>Produk Terlaris</h3>
          <div style={productListStyle}>
            <div style={productItemStyle}>
              <span style={productRankStyle}>1</span>
              <span style={productNameStyle}>Vas Bunga Kecil</span>
              <span style={productSoldStyle}>45 terjual</span>
            </div>
            <div style={productItemStyle}>
              <span style={productRankStyle}>2</span>
              <span style={productNameStyle}>Cangkir Kopi</span>
              <span style={productSoldStyle}>38 terjual</span>
            </div>
            <div style={productItemStyle}>
              <span style={productRankStyle}>3</span>
              <span style={productNameStyle}>Piring Makan</span>
              <span style={productSoldStyle}>32 terjual</span>
            </div>
            <div style={productItemStyle}>
              <span style={productRankStyle}>4</span>
              <span style={productNameStyle}>Guci Bunga</span>
              <span style={productSoldStyle}>28 terjual</span>
            </div>
            <div style={productItemStyle}>
              <span style={productRankStyle}>5</span>
              <span style={productNameStyle}>Tempat Lilin</span>
              <span style={productSoldStyle}>25 terjual</span>
            </div>
          </div>
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
  maxWidth: "1200px",
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

const filterContainerStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const periodButtonStyle = {
  padding: "10px 20px",
  borderRadius: "30px",
  border: "1px solid #ff69b4",
  background: "transparent",
  color: "#ff69b4",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s",
};

const periodActiveStyle = {
  ...periodButtonStyle,
  background: "#ff69b4",
  color: "white",
  border: "1px solid #ff69b4",
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "30px",
};

const summaryCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const summaryLabelStyle = {
  fontSize: "13px",
  color: "#b48c9c",
};

const summaryValueStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#ff69b4",
};

const summaryTrendStyle = {
  fontSize: "12px",
  color: "#4caf50",
};

const chartContainerStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "30px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
};

const chartTitleStyle = {
  fontSize: "18px",
  color: "#8b5f6c",
  margin: "0 0 20px 0",
};

const chartPlaceholderStyle = {
  height: "200px",
  background: "#fff0f5",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "2px dashed #ffb6c1",
};

const chartEmojiStyle = {
  fontSize: "48px",
  marginBottom: "10px",
  opacity: 0.5,
};

const chartTextStyle = {
  fontSize: "14px",
  color: "#b48c9c",
};

const topProductsStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
};

const productListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const productItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  background: "#fff0f5",
  borderRadius: "10px",
};

const productRankStyle = {
  width: "30px",
  height: "30px",
  background: "#ff69b4",
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  marginRight: "15px",
};

const productNameStyle = {
  flex: 1,
  fontSize: "14px",
  color: "#333",
};

const productSoldStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#ff69b4",
};

export default Laporan;