// src/pages/Kategori.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

// KONSTANTA
const TITLE_SIZE = "42px";
const SUBTITLE_SIZE = "18px";
const TITLE_COLOR = "#8b5f6c";
const SUBTITLE_COLOR = "#b48c9c";

function Kategori() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [search, setSearch] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});

  useEffect(() => {
    if (location.state?.name) {
      localStorage.setItem("name", location.state.name);
    }
    if (location.state?.role) {
      localStorage.setItem("role", location.state.role);
    }
  }, [location]);

  // 🔥 MAPPING GAMBAR UNTUK KATEGORI (sesuaikan dengan file gambar Anda)
  const imageMap = {
    'Vas Bunga': '/kategori/vas-bunga.png',
    'Piring & Mangkok': '/kategori/piring-mangkok.png',
    'Cangkir & Teko': '/kategori/cangkir-teko.png',
    'Guci & Pot': '/kategori/guci-pot.png',
    'Dekorasi Dinding': '/kategori/dekorasi-dinding.png',
    'Lampu Keramik': '/kategori/lampu-keramik.png',
    'Aksesoris Dapur': '/kategori/aksesoris-dapur.png',
    'Koleksi Premium': '/kategori/koleksi-premium.png'
  };

  // Ambil data kategori dari database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem("token");
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/categories", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data kategori');
        }
        
        const data = await response.json();
        console.log('Data kategori:', data);
        
        // Format data dengan gambar
        const formattedData = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || 'Tidak ada deskripsi',
          product_count: item.product_count || 0,
          image: imageMap[item.name] || '/kategori/default.png'
        }));
        
        setKategoriList(formattedData);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        
        // Data cadangan
        setKategoriList([
          { id: 1, name: "Vas Bunga", description: "Koleksi vas bunga berbagai ukuran", product_count: 7, image: "/kategori/vas-bunga.png" },
          { id: 2, name: "Piring & Mangkok", description: "Peralatan makan keramik berkualitas", product_count: 5, image: "/kategori/piring-mangkok.png" },
          { id: 3, name: "Cangkir & Teko", description: "Cangkir, teko, dan set minum", product_count: 5, image: "/kategori/cangkir-teko.png" },
          { id: 4, name: "Guci & Pot", description: "Guci hias dan pot tanaman", product_count: 4, image: "/kategori/guci-pot.png" },
          { id: 5, name: "Dekorasi Dinding", description: "Hiasan dinding keramik", product_count: 3, image: "/kategori/dekorasi-dinding.png" },
          { id: 6, name: "Lampu Keramik", description: "Lampu meja dan lampion", product_count: 2, image: "/kategori/lampu-keramik.png" },
          { id: 7, name: "Aksesoris Dapur", description: "Tempat bumbu, asbak, tisu", product_count: 3, image: "/kategori/aksesoris-dapur.png" },
          { id: 8, name: "Koleksi Premium", description: "Produk edisi terbatas", product_count: 1, image: "/kategori/koleksi-premium.png" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageError = (e, kategoriId) => {
    console.log(`Gambar error untuk kategori ID: ${kategoriId}`);
    e.target.src = "/kategori/default.png";
    setImagesLoaded(prev => ({...prev, [kategoriId]: false}));
  };

  const handleImageLoad = (kategoriId) => {
    setImagesLoaded(prev => ({...prev, [kategoriId]: true}));
  };

  const handleLihatDetail = (kategori) => {
    setSelectedKategori(kategori);
    setShowDetail(true);
  };

  // Filter kategori berdasarkan search
  const filteredKategori = kategoriList.filter(k => 
    k.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={pageStyle}>
      <Navbar />

      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerLeftStyle}>
            <h1 style={titleStyle}>📋 Katalog Kategori Produk</h1>
            <p style={subtitleStyle}>Jelajahi berbagai kategori gerabah kami</p>
          </div>
        </div>

        {/* Search */}
        <div style={searchContainerStyle}>
          <div style={searchBoxStyle}>
            <span style={searchIconStyle}>🔍</span>
            <input
              type="text"
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={loadingContainerStyle}>
            <div style={loadingSpinnerStyle}>⏳</div>
            <p>Memuat kategori...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={errorContainerStyle}>
            <div style={errorIconStyle}>❌</div>
            <h3 style={errorTitleStyle}>Gagal Memuat Data</h3>
            <p style={errorMessageStyle}>{error}</p>
            <button 
              style={errorButtonStyle}
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Grid Kategori */}
        {!loading && !error && (
          <div style={gridStyle}>
            {filteredKategori.length === 0 ? (
              <div style={emptyStyle}>
                <p>Tidak ada kategori ditemukan</p>
              </div>
            ) : (
              filteredKategori.map((kategori) => (
                <div 
                  key={kategori.id} 
                  style={cardStyle}
                  onClick={() => handleLihatDetail(kategori)}
                >
                  <div style={cardImageWrapperStyle}>
                    <img 
                      src={kategori.image}
                      alt={kategori.name}
                      style={cardImageStyle}
                      onError={(e) => handleImageError(e, kategori.id)}
                      onLoad={() => handleImageLoad(kategori.id)}
                    />
                    {!imagesLoaded[kategori.id] && (
                      <div style={imageLoadingStyle}>🖼️</div>
                    )}
                  </div>
                  <div style={cardContentStyle}>
                    <h3 style={kategoriNameStyle}>{kategori.name}</h3>
                    <p style={kategoriDescStyle}>{kategori.description}</p>
                    <div style={kategoriFooterStyle}>
                      <span style={productCountStyle}>
                        {kategori.product_count} produk
                      </span>
                      <button 
                        style={detailButtonStyle}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLihatDetail(kategori);
                        }}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal Detail Kategori */}
      {showDetail && selectedKategori && (
        <div style={modalOverlayStyle} onClick={() => setShowDetail(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>📋 Detail Kategori</h3>
              <button style={modalCloseStyle} onClick={() => setShowDetail(false)}>✕</button>
            </div>
            
            <div style={modalBodyStyle}>
              <div style={modalImageContainerStyle}>
                <img 
                  src={selectedKategori.image}
                  alt={selectedKategori.name}
                  style={modalImageStyle}
                  onError={(e) => handleImageError(e, selectedKategori.id)}
                />
              </div>

              <div style={detailItemStyle}>
                <span style={detailLabelStyle}>ID Kategori:</span>
                <span style={detailValueStyle}>{selectedKategori.id}</span>
              </div>
              
              <div style={detailItemStyle}>
                <span style={detailLabelStyle}>Nama Kategori:</span>
                <span style={detailValueStyle}>{selectedKategori.name}</span>
              </div>
              
              <div style={detailItemStyle}>
                <span style={detailLabelStyle}>Deskripsi:</span>
                <span style={detailValueStyle}>{selectedKategori.description}</span>
              </div>
              
              <div style={detailItemStyle}>
                <span style={detailLabelStyle}>Jumlah Produk:</span>
                <span style={detailValueStyle}>{selectedKategori.product_count} produk</span>
              </div>
            </div>
            
            <div style={modalFooterStyle}>
              <button style={modalButtonStyle} onClick={() => setShowDetail(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STYLES
// ============================================

// Page Style
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
  fontFamily: "'Poppins', sans-serif",
  padding: "100px 20px 40px 20px",
};

// Container
const containerStyle = {
  maxWidth: "1300px",
  margin: "0 auto",
};

// Header
const headerStyle = {
  marginBottom: "30px",
};

const headerLeftStyle = {
  textAlign: "center",
};

const titleStyle = {
  fontSize: "36px",
  color: TITLE_COLOR,
  margin: "0 0 10px 0",
  fontWeight: "700",
};

const subtitleStyle = {
  fontSize: "16px",
  color: SUBTITLE_COLOR,
  margin: 0,
};

// Search
const searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "40px",
};

const searchBoxStyle = {
  display: "flex",
  alignItems: "center",
  background: "white",
  borderRadius: "60px",
  padding: "5px 5px 5px 20px",
  boxShadow: "0 5px 20px rgba(255,182,193,0.15)",
  border: "1px solid rgba(255,255,255,0.8)",
  width: "100%",
  maxWidth: "500px",
};

const searchIconStyle = {
  fontSize: "18px",
  color: "#ff69b4",
  marginRight: "10px",
};

const searchInputStyle = {
  flex: 1,
  padding: "12px 15px 12px 5px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  background: "transparent",
  color: "#8b5f6c",
};

// Loading & Error
const loadingContainerStyle = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#b48c9c",
  fontSize: "18px",
};

const loadingSpinnerStyle = {
  fontSize: "40px",
  marginBottom: "20px",
  animation: "spin 1s linear infinite",
};

const errorContainerStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "16px",
  maxWidth: "500px",
  margin: "0 auto",
};

const errorIconStyle = {
  fontSize: "48px",
  marginBottom: "20px",
};

const errorTitleStyle = {
  fontSize: "24px",
  color: "#f44336",
  margin: "0 0 10px 0",
};

const errorMessageStyle = {
  fontSize: "16px",
  color: "#666",
  marginBottom: "30px",
};

const errorButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px 30px",
  borderRadius: "30px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

// Grid
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "25px",
};

// Card
const cardStyle = {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(255,182,193,0.15)",
  cursor: "pointer",
  transition: "transform 0.3s ease",
  border: "1px solid rgba(255,255,255,0.8)",
};

// 🔥 STYLE GAMBAR YANG SUDAH DIPERKECIL
const cardImageWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0 10px 0",
  backgroundColor: "#fff0f5",
  minHeight: "120px",
};

const cardImageStyle = {
  width: "80px",
  height: "80px",
  objectFit: "contain",
  transition: "transform 0.3s ease",
};

const imageLoadingStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: "24px",
  color: "#ff69b4",
};

// Card Content
const cardContentStyle = {
  padding: "15px",
};

const kategoriNameStyle = {
  fontSize: "18px",
  color: TITLE_COLOR,
  margin: "0 0 8px 0",
  fontWeight: "600",
  textAlign: "center",
};

const kategoriDescStyle = {
  fontSize: "14px",
  color: SUBTITLE_COLOR,
  margin: "0 0 15px 0",
  lineHeight: "1.4",
  textAlign: "center",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const kategoriFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const productCountStyle = {
  fontSize: "13px",
  color: "#ff69b4",
  fontWeight: "500",
  background: "#fff0f5",
  padding: "4px 12px",
  borderRadius: "20px",
};

const detailButtonStyle = {
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const emptyStyle = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "60px",
  color: "#b48c9c",
  fontSize: "16px",
};

// Modal
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(5px)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContentStyle = {
  background: "white",
  borderRadius: "24px",
  width: "90%",
  maxWidth: "450px",
  padding: "20px",
  animation: "slideUp 0.3s ease",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #ffb6c1",
};

const modalTitleStyle = {
  fontSize: "20px",
  color: TITLE_COLOR,
  margin: 0,
};

const modalCloseStyle = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#ff69b4",
};

const modalBodyStyle = {
  marginBottom: "20px",
};

const modalImageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

const modalImageStyle = {
  width: "120px",
  height: "120px",
  objectFit: "contain",
  borderRadius: "20px",
  border: "3px solid #ffb6c1",
  padding: "10px",
  background: "#fff0f5",
};

const detailItemStyle = {
  display: "flex",
  marginBottom: "10px",
  padding: "10px",
  background: "#fff0f5",
  borderRadius: "10px",
};

const detailLabelStyle = {
  width: "120px",
  fontSize: "14px",
  color: "#666",
  fontWeight: "500",
};

const detailValueStyle = {
  flex: 1,
  fontSize: "14px",
  color: "#333",
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
};

const modalButtonStyle = {
  background: "#ff69b4",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

// Animasi
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .riwayat-card:hover {
    transform: translateX(5px);
  }
  
  button:hover {
    transform: scale(1.02);
  }
`;
document.head.appendChild(style);

export default Kategori;