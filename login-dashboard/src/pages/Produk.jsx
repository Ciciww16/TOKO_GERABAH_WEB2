// src/pages/Produk.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useCart } from "../context/CartContext";

// KONSTANTA
const TITLE_SIZE = "42px";
const SUBTITLE_SIZE = "18px";
const TITLE_COLOR = "#8b5f6c";
const SUBTITLE_COLOR = "#b48c9c";

function Produk() {
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    cart, 
    riwayatPembelian,
    returItems,
    tambahKeKeranjang, 
    beliSekarang, 
    kurangQty, 
    tambahQty,
    checkout,
    returBarang,
    checkStock
  } = useCart();

  const [showCart, setShowCart] = useState(false);
  const [notif, setNotif] = useState("");
  const [search, setSearch] = useState("");
  const [filterHarga, setFilterHarga] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);
  const [activeTab, setActiveTab] = useState("produk");
  const [showReturTab, setShowReturTab] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  // State untuk data produk dari database
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalHarga = cart.reduce(
    (total, item) => total + item.harga * item.qty,
    0
  );

  useEffect(() => {
    if (location.state?.name) {
      localStorage.setItem("name", location.state.name);
    }
    if (location.state?.role) {
      localStorage.setItem("role", location.state.role);
    }
  }, [location]);

  // AMBIL DATA PRODUK DARI DATABASE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem("token");
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/products", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token tidak valid. Silakan login ulang.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log('Data dari database:', data);
        
        // Di bagian fetch products, update imageMap
        const imageMap = {
          // Gunakan nama file dengan spasi sesuai aslinya
          'Vas Bunga Kecil Polos': '/produk/Vas Bunga Polos.avif',
          'Vas Bunga Sedang Motif Bunga': '/produk/Vas Bunga Sedang.jpeg',
          'Vas Bunga Besar': '/produk/Vas Bunga Bsar.webp',
          'Vas Bunga Minimalis': '/produk/Vas Bunga Mnimalis.webp',
          'Vas Bunga Keramik Biru': '/produk/Vas Bunga Biru.avif',
          'Vas Bunga Set': '/produk/Vas Bunga sett.webp',
          'Vas Bunga Gantung': '/produk/Vas Bunga gantungg.jpg',
          'Piring Makan Polos': '/produk/Piring Makan poloss.jpg',
          'Piring Makan Motif Batik': '/produk/piring batik.webp',
          'Mangkok Sup': '/produk/mangkok supp.webp',
          'Mangkok Nasi': '/produk/mangkok nasii.jpg',
          'Set Piring & Mangkok': '/produk/piring dan mangkok.jpg',
          'Cangkir Kopi': '/produk/cangkir kopi.jpg',
          'Cangkir Teh': '/produk/cngkir Teh.jpg',
          'Teko Keramik Hijau': '/produk/teko hijau.jpg',
          'Teko Keramik Coklat': '/produk/Teko Keramik Coklat.jpg',
          'Set Teko & Cangkir': '/produk/Set Teko & Cangkir.jpg',
          'Guci Kecil Motif Klasik': '/produk/guci kecil klasik.jpg',
          'Guci Sedang Polos': '/produk/guci sedang poloss.png',
          'Pot Tanaman Kecil': '/produk/pot mini.jpg',
          'Pot Tanaman Besar': '/produk/pot besar.avif',
          'Hiasan Dinding Burung': '/produk/Hiasan Dinding Burung.jpg',
          'Hiasan Dinding Bunga': '/produk/Hiasan Dinding Bunga.jpg',
          'Lukisan Keramik 3D': '/produk/Lukisan Keramik 3D.jpg',
          'Lampu Meja Tidur': '/produk/lampu tidur.jpg',
          'Lampion Gantung': '/produk/lampion.jpg',
          'Tempat Bumbu 3 in 1': '/produk/tempat bumbu 3 in.jpg',
          'Asbak Keramik': '/produk/asbakkk.jpg',
          'Tempat Tisu Keramik': '/produk/Tempat Tisu Keramik.jpg',
          'Vas Premium Gold Limited': '/produk/vas gold.jpg'
        };
        
        // Format data
        const formattedData = data.map(item => ({
          id: item.id,
          nama: item.name,
          harga: parseFloat(item.price),
          deskripsi: item.description || 'Tidak ada deskripsi',
          image: imageMap[item.name] || '/produk/default.jpg',
          category_id: item.category_id,
          stock: item.stock || 0
        }));
        
        setProduk(formattedData);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        
        // Data cadangan
        setProduk([
          { id: 1, nama: "Vas Bunga Kecil", harga: 50000, deskripsi: "Vas kecil untuk bunga", image: "/produk/vas kecil.avif", stock: 10 },
          { id: 2, nama: "Piring Makan", harga: 30000, deskripsi: "Piring keramik 8 inch", image: "/produk/piringg.jpg", stock: 20 },
          { id: 3, nama: "Cangkir Kopi", harga: 25000, deskripsi: "Cangkir keramik untuk kopi", image: "/produk/cangkir.jpeg", stock: 15 },
          { id: 4, nama: "Guci Bunga", harga: 150000, deskripsi: "Guci bunga aesthetic", image: "/produk/guci.jpg", stock: 5 },
          { id: 5, nama: "Tempat Lilin", harga: 45000, deskripsi: "Tempat lilin gerabah", image: "/produk/tempat lilin.n.avif", stock: 12 },
          { id: 6, nama: "Mangkok Sup", harga: 35000, deskripsi: "Mangkok keramik", image: "/produk/mangkuk.jpg", stock: 18 },
          { id: 7, nama: "Pot Kaktus", harga: 40000, deskripsi: "Pot kecil untuk kaktus", image: "/produk/pot kktus.jpg", stock: 10 },
          { id: 8, nama: "Hiasan Dinding Batik", harga: 120000, deskripsi: "Hiasan dinding keramik", image: "/produk/hiasan dinding.webp", stock: 7 },
          { id: 9, nama: "Lampu Meja", harga: 200000, deskripsi: "Lampu meja keramik", image: "/produk/lampuu.jpg", stock: 4 },
          { id: 10, nama: "Asbak Mini", harga: 15000, deskripsi: "Asbak keramik mini", image: "/produk/asbak.jpg", stock: 25 },
          { id: 11, nama: "Teko Keramik", harga: 90000, deskripsi: "Teko minum keramik", image: "/produk/teko.jpeg", stock: 12 },
          { id: 12, nama: "Celengan Keramik", harga: 60000, deskripsi: "Celengan unik keramik", image: "/produk/celengan.avif", stock: 12 },
          { id: 13, nama: "Tempat Bumbu", harga: 45000, deskripsi: "Tempat bumbu dapur", image: "/produk/tempat bumbu.jpg", stock: 20 },
          { id: 14, nama: "Air Mancur Mini", harga: 30000, deskripsi: "Air mancur mini", image: "/produk/air mancur.jpg", stock: 10 },
          { id: 15, nama: "Jam Dinding Cantik", harga: 60000, deskripsi: "Jam dinding cantik", image: "/produk/jam dinding.jpg", stock: 15 },
          { id: 16, nama: "Tempat Tisu", harga: 25000, deskripsi: "Tempat tisu keramik", image: "/produk/tempat tisu.jpg", stock: 10 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleImageError = (e, productId) => {
    console.log(`Gambar error untuk produk ID: ${productId}`);
    e.target.src = "/produk/default.jpg";
    setImagesLoaded(prev => ({...prev, [productId]: false}));
  };

  const handleImageLoad = (productId) => {
    setImagesLoaded(prev => ({...prev, [productId]: true}));
  };

  const handleTambahKeKeranjang = (item) => {
    if (item.stock <= 0) {
      setNotif(`${item.nama} sedang habis!`);
      setTimeout(() => setNotif(""), 2000);
      return;
    }
    tambahKeKeranjang(item);
    setNotif(`${item.nama} ditambahkan ke keranjang`);
    setTimeout(() => setNotif(""), 2000);
  };

  const handleBeliSekarang = (item) => {
    if (item.stock <= 0) {
      setNotif(`${item.nama} sedang habis!`);
      setTimeout(() => setNotif(""), 2000);
      return;
    }
    beliSekarang(item);
  };

  // Filter produk berdasarkan search dan harga
  const filteredProduk = produk.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase())
  ).filter(p => {
    if (filterHarga === "50") return p.harga < 50000;
    if (filterHarga === "100") return p.harga >= 50000 && p.harga <= 100000;
    if (filterHarga === "101") return p.harga > 100000;
    return true;
  });

  // 🔥 KOMPONEN RIWAYAT PEMBELIAN
  const RiwayatPembelian = () => {
    // Safety check untuk data
    const safeRiwayat = Array.isArray(riwayatPembelian) ? riwayatPembelian : [];
    const safeRetur = Array.isArray(returItems) ? returItems : [];

    return (
      <div style={riwayatContainerStyle}>
        <div style={riwayatHeaderStyle}>
          <h2 style={riwayatTitleStyle}>📋 Riwayat Transaksi</h2>
          <div style={riwayatSubTabStyle}>
            <button 
              style={!showReturTab ? riwayatSubTabActiveStyle : riwayatSubTabInactiveStyle}
              onClick={() => setShowReturTab(false)}
            >
              🛍️ Pembelian ({safeRiwayat.length})
            </button>
            <button 
              style={showReturTab ? riwayatSubTabActiveStyle : riwayatSubTabInactiveStyle}
              onClick={() => setShowReturTab(true)}
            >
              🔄 Retur ({safeRetur.length})
            </button>
          </div>
        </div>

        {!showReturTab ? (
          // Daftar Pembelian
          safeRiwayat.length === 0 ? (
            <div style={riwayatEmptyStyle}>
              <div style={riwayatEmptyIconStyle}>🛍️</div>
              <p style={riwayatEmptyTextStyle}>Belum ada pembelian</p>
              <button 
                style={riwayatEmptyButtonStyle}
                onClick={() => setActiveTab("produk")}
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : (
            <div style={riwayatListStyle}>
              {safeRiwayat.map((item, index) => {
                // Safety check untuk setiap item
                const safeItem = {
                  id: item?.id || index,
                  image: item?.image || '/produk/default.jpg',
                  nama: item?.nama || 'Produk',
                  harga: typeof item?.harga === 'number' ? item.harga : 0,
                  qty: item?.qty || 1,
                  tanggal: item?.tanggal || new Date().toLocaleDateString('id-ID'),
                  status: item?.status || 'Selesai',
                  invoice: item?.invoice || `INV-${Date.now()}-${index}`
                };

                return (
                  <div key={index} style={riwayatCardStyle} className="riwayat-card">
                    <img 
                      src={safeItem.image} 
                      alt={safeItem.nama} 
                      style={riwayatCardImgStyle}
                      onError={(e) => e.target.src = "/produk/default.jpg"}
                    />
                    <div style={riwayatCardInfoStyle}>
                      <div style={riwayatCardHeaderStyle}>
                        <h4 style={riwayatCardNamaStyle}>{safeItem.nama}</h4>
                        <span style={riwayatCardStatusStyle}>{safeItem.status}</span>
                      </div>
                      <p style={riwayatCardHargaStyle}>
                        Rp {safeItem.harga.toLocaleString()} x {safeItem.qty}
                      </p>
                      <p style={riwayatCardTanggalStyle}>📅 {safeItem.tanggal}</p>
                      <p style={riwayatInvoiceStyle}>Invoice: {safeItem.invoice}</p>
                    </div>
                    <button 
                      style={riwayatReturButtonStyle}
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin meretur ${safeItem.nama}?`)) {
                          returBarang(safeItem);
                        }
                      }}
                    >
                      🔄 Retur
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          // Daftar Retur
          safeRetur.length === 0 ? (
            <div style={riwayatEmptyStyle}>
              <div style={riwayatEmptyIconStyle}>🔄</div>
              <p style={riwayatEmptyTextStyle}>Belum ada retur</p>
            </div>
          ) : (
            <div style={riwayatListStyle}>
              {safeRetur.map((item, index) => {
                // Safety check untuk setiap item retur
                const safeItem = {
                  id: item?.id || index,
                  image: item?.image || '/produk/default.jpg',
                  nama: item?.nama || 'Produk',
                  harga: typeof item?.harga === 'number' ? item.harga : 0,
                  qty: item?.qty || 1,
                  tanggalRetur: item?.tanggalRetur || new Date().toLocaleDateString('id-ID'),
                  status: item?.status || 'Diproses'
                };

                return (
                  <div key={index} style={riwayatCardStyle} className="riwayat-card">
                    <img 
                      src={safeItem.image} 
                      alt={safeItem.nama} 
                      style={riwayatCardImgStyle}
                      onError={(e) => e.target.src = "/produk/default.jpg"}
                    />
                    <div style={riwayatCardInfoStyle}>
                      <div style={riwayatCardHeaderStyle}>
                        <h4 style={riwayatCardNamaStyle}>{safeItem.nama}</h4>
                        <span style={riwayatReturStatusStyle}>{safeItem.status}</span>
                      </div>
                      <p style={riwayatCardHargaStyle}>
                        Rp {safeItem.harga.toLocaleString()} x {safeItem.qty}
                      </p>
                      <p style={riwayatCardTanggalStyle}>📅 Retur: {safeItem.tanggalRetur}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      {/* Notifikasi */}
      {notif && (
        <div style={notifStyle}>
          <span style={notifIconStyle}>✅</span>
          <span>{notif}</span>
        </div>
      )}
      
      <Navbar />

      {/* Header */}
      <div style={headerWithTabStyle}>
        <div style={headerLeftStyle}>
          <h1 style={pageTitleStyle}>
            {activeTab === 'produk' ? 'Koleksi Produk' : 'Riwayat Pembelian'}
          </h1>
          <p style={pageSubtitleStyle}>
            {activeTab === 'produk' 
              ? 'Temukan gerabah terbaik untuk koleksi Anda'
              : 'Lihat riwayat pembelian dan retur Anda'}
          </p>
        </div>
        
        {/* Tab Navigasi */}
        <div style={tabRightContainerStyle}>
          <button 
            style={activeTab === 'produk' ? tabRightActiveStyle : tabRightInactiveStyle}
            onClick={() => setActiveTab('produk')}
          >
            <span style={tabIconStyle}>🛍️</span>
            <span>Produk</span>
          </button>
          <button 
            style={activeTab === 'riwayat' ? tabRightActiveStyle : tabRightInactiveStyle}
            onClick={() => setActiveTab('riwayat')}
          >
            <span style={tabIconStyle}>📜</span>
            <span>Riwayat</span>
            {riwayatPembelian && riwayatPembelian.length > 0 && (
              <span style={tabBadgeStyle}>{riwayatPembelian.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Konten berdasarkan tab */}
      {activeTab === 'produk' ? (
        <>
          {/* Search dan Filter */}
          <div style={searchFilterContainerStyle}>
            <div style={searchBoxStyle}>
              <span style={searchIconStyle}>🔍</span>
              <input
                type="text"
                placeholder="Cari produk impian Anda..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchInputStyle}
              />
            </div>
            <select
              value={filterHarga}
              onChange={(e) => setFilterHarga(e.target.value)}
              style={selectStyle}
            >
              <option value="all">Semua Kategori</option>
              <option value="50">💎 Gerabah Murah (‹ 50rb)</option>
              <option value="100">✨ Gerabah Sedang (50rb - 100rb)</option>
              <option value="101">👑 Gerabah Premium (› 100rb)</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={loadingContainerStyle}>
              <div style={loadingSpinnerStyle}>⏳</div>
              <p>Memuat produk dari database...</p>
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

          {/* Grid Produk */}
          {!loading && !error && (
            <div style={gridStyle}>
              {filteredProduk.length === 0 ? (
                <div style={emptyStyle}>
                  <p>Tidak ada produk ditemukan</p>
                </div>
              ) : (
                filteredProduk.map((item) => (
                  <div 
                    key={item.id} 
                    style={{
                      ...cardStyle,
                      transform: hoveredId === item.id ? 'scale(1.03)' : 'scale(1)',
                      boxShadow: hoveredId === item.id 
                        ? '0 20px 30px rgba(255, 105, 180, 0.2)' 
                        : '0 10px 20px rgba(255, 182, 193, 0.1)',
                      transition: 'all 0.3s ease',
                      opacity: item.stock === 0 ? 0.7 : 1,
                    }}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={cardImageWrapperStyle}>
                      <img
                        src={item.image}
                        alt={item.nama}
                        style={cardImageStyle}
                        onError={(e) => handleImageError(e, item.id)}
                        onLoad={() => handleImageLoad(item.id)}
                      />
                      {item.stock === 0 && (
                        <div style={stockHabisOverlayStyle}>
                          <span style={stockHabisTextStyle}>STOK HABIS</span>
                        </div>
                      )}
                      {item.harga > 100000 && item.stock > 0 && (
                        <span style={cardPremiumBadgeStyle}>PREMIUM</span>
                      )}
                    </div>
                    
                    <div style={cardContentStyle}>
                      <h4 style={cardTitleStyle}>{item.nama}</h4>
                      <div style={cardRatingStyle}>
                        <span style={cardStarStyle}>★★★★★</span>
                        <span style={cardRatingTextStyle}>(12)</span>
                      </div>
                      <p style={cardDescriptionStyle}>{item.deskripsi}</p>
                      <div style={cardPriceStyle}>
                        <span style={cardPriceLabelStyle}>Harga</span>
                        <span style={cardPriceValueStyle}>
                          Rp {item.harga.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* INFORMASI STOK */}
                      <div style={stockInfoStyle}>
                        <span style={stockLabelStyle}>Stok:</span>
                        <span style={item.stock > 0 ? stockValueStyle : stockHabisStyle}>
                          {item.stock > 0 ? `${item.stock} tersedia` : 'Habis'}
                        </span>
                      </div>

                      <div style={cardButtonGroupStyle}>
                        <button
                          style={item.stock > 0 ? cardCartButtonStyle : disabledButtonStyle}
                          onClick={() => handleTambahKeKeranjang(item)}
                          disabled={item.stock === 0}
                        >
                          <span style={cardButtonIconStyle}>🛒</span>
                          {item.stock > 0 ? 'Keranjang' : 'Stok Habis'}
                        </button>
                        <button
                          style={item.stock > 0 ? cardBuyButtonStyle : disabledButtonStyle}
                          onClick={() => handleBeliSekarang(item)}
                          disabled={item.stock === 0}
                        >
                          {item.stock > 0 ? 'Beli' : 'Habis'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      ) : (
        <RiwayatPembelian />
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <div style={cartModalOverlayStyle} onClick={() => setShowCart(false)}>
          <div style={cartModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={cartModalHeaderStyle}>
              <h3 style={cartModalTitleStyle}>
                <span style={cartModalIconStyle}>🛒</span>
                Keranjang Belanja
              </h3>
              <button style={cartModalCloseStyle} onClick={() => setShowCart(false)}>✕</button>
            </div>
            
            <div style={cartModalContentStyle}>
              {cart.length === 0 ? (
                <div style={cartEmptyStyle}>
                  <div style={cartEmptyIconStyle}>🛒</div>
                  <p style={cartEmptyTextStyle}>Keranjang Anda masih kosong</p>
                  <button 
                    style={cartEmptyButtonStyle}
                    onClick={() => setShowCart(false)}
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} style={cartItemStyle}>
                      <img 
                        src={item.image || "/produk/default.jpg"} 
                        alt={item.nama} 
                        style={cartItemImageStyle}
                        onError={(e) => handleImageError(e, item.id)}
                      />
                      <div style={cartItemInfoStyle}>
                        <div style={cartItemHeaderStyle}>
                          <b style={cartItemNameStyle}>{item.nama}</b>
                          <p style={cartItemPriceStyle}>Rp {item.harga.toLocaleString()}</p>
                        </div>
                        <div style={cartItemFooterStyle}>
                          <div style={cartItemQtyStyle}>
                            <button style={cartQtyButtonStyle} onClick={() => kurangQty(item.id)}>
                              −
                            </button>
                            <span style={cartQtyValueStyle}>{item.qty}</span>
                            <button style={cartQtyButtonStyle} onClick={() => tambahQty(item.id)}>
                              +
                            </button>
                          </div>
                          <span style={cartItemSubtotalStyle}>
                            Rp {(item.harga * item.qty).toLocaleString()}
                          </span>
                        </div>
                        <div style={cartItemStockStyle}>
                          Stok: {item.stock}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div style={cartTotalStyle}>
                    <span style={cartTotalLabelStyle}>Total</span>
                    <span style={cartTotalValueStyle}>Rp {totalHarga.toLocaleString()}</span>
                  </div>
                  
                  <button
                    style={cartCheckoutButtonStyle}
                    onClick={() => {
                      checkout();
                      setShowCart(false);
                    }}
                  >
                    <span style={cartCheckoutIconStyle}>✅</span>
                    Checkout Sekarang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <div style={floatingCartStyle} onClick={() => setShowCart(true)}>
        <span style={floatingCartIconStyle}>🛒</span>
        {cart.length > 0 && (
          <span style={floatingCartBadgeStyle}>{cart.length}</span>
        )}
      </div>
    </div>
  );
}

/* ========== STYLE TAMBAHAN ========== */
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
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "16px",
  maxWidth: "500px",
  margin: "0 auto",
  boxShadow: "0 10px 30px rgba(255, 182, 193, 0.2)",
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

const imageLoadingStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontSize: "24px",
  color: "#ff69b4",
};

const emptyStyle = {
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "60px",
  color: "#b48c9c",
  fontSize: "16px",
};

/* ========== STYLE STOK ========== */
const stockInfoStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  padding: "5px 0",
};

const stockLabelStyle = {
  fontSize: "14px",
  color: SUBTITLE_COLOR,
};

const stockValueStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#4caf50",
  background: "#e8f5e8",
  padding: "4px 12px",
  borderRadius: "20px",
};

const stockHabisStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#f44336",
  background: "#ffebee",
  padding: "4px 12px",
  borderRadius: "20px",
};

const stockHabisOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3,
};

const stockHabisTextStyle = {
  background: "#f44336",
  color: "white",
  padding: "8px 16px",
  borderRadius: "30px",
  fontSize: "14px",
  fontWeight: "bold",
  transform: "rotate(-15deg)",
};

const disabledButtonStyle = {
  flex: 1,
  background: "#e0e0e0",
  border: "none",
  color: "#999",
  padding: "12px",
  borderRadius: "12px",
  cursor: "not-allowed",
  fontSize: "14px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  opacity: 0.7,
};

const cartItemStockStyle = {
  fontSize: "11px",
  color: "#999",
  marginTop: "5px",
};

/* ========== STYLE UTAMA ========== */
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
  fontFamily: "'Poppins', 'Inter', sans-serif",
  padding: "100px 20px 40px 20px",
  position: "relative",
};

const notifStyle = {
  position: "fixed",
  top: "90px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  padding: "14px 28px",
  borderRadius: "50px",
  fontWeight: "500",
  zIndex: 9999,
  boxShadow: "0 10px 30px rgba(255, 105, 180, 0.4)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  animation: "slideDown 0.3s ease",
};

const notifIconStyle = {
  fontSize: "20px",
};

const headerWithTabStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1400px",
  margin: "20px auto 40px auto",
  padding: "0 20px",
  flexWrap: "wrap",
  gap: "20px",
};

const headerLeftStyle = {
  flex: 1,
};

const pageTitleStyle = {
  fontSize: "36px",
  color: TITLE_COLOR,
  margin: "0 0 5px 0",
  fontWeight: "700",
  letterSpacing: "-0.5px",
};

const pageSubtitleStyle = {
  fontSize: "16px",
  color: SUBTITLE_COLOR,
  margin: 0,
};

const tabRightContainerStyle = {
  display: "flex",
  gap: "10px",
  background: "rgba(255, 255, 255, 0.5)",
  padding: "5px",
  borderRadius: "50px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 5px 15px rgba(255, 182, 193, 0.2)",
};

const tabRightInactiveStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 25px",
  borderRadius: "30px",
  border: "none",
  background: "transparent",
  color: TITLE_COLOR,
  fontSize: "15px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s",
};

const tabRightActiveStyle = {
  ...tabRightInactiveStyle,
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  boxShadow: "0 5px 15px rgba(255, 105, 180, 0.3)",
};

const tabIconStyle = {
  fontSize: "18px",
};

const tabBadgeStyle = {
  background: "rgba(255, 255, 255, 0.3)",
  borderRadius: "20px",
  padding: "2px 8px",
  fontSize: "12px",
  marginLeft: "5px",
};

const searchFilterContainerStyle = {
  maxWidth: "900px",
  margin: "0 auto 50px auto",
  display: "flex",
  gap: "15px",
  padding: "0 20px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const searchBoxStyle = {
  flex: 1,
  minWidth: "300px",
  display: "flex",
  alignItems: "center",
  background: "white",
  borderRadius: "60px",
  padding: "5px 5px 5px 20px",
  boxShadow: "0 5px 20px rgba(255, 182, 193, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
};

const searchIconStyle = {
  fontSize: "18px",
  color: "#ff69b4",
  marginRight: "10px",
};

const searchInputStyle = {
  flex: 1,
  padding: "15px 15px 15px 5px",
  border: "none",
  outline: "none",
  fontSize: "15px",
  background: "transparent",
  color: "#8b5f6c",
};

const selectStyle = {
  padding: "15px 30px",
  borderRadius: "60px",
  border: "none",
  fontSize: "15px",
  background: "white",
  boxShadow: "0 5px 20px rgba(255, 182, 193, 0.15)",
  outline: "none",
  cursor: "pointer",
  color: "#8b5f6c",
  fontWeight: "500",
  border: "1px solid rgba(255, 255, 255, 0.8)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "30px",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 20px",
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 10px 20px rgba(255, 182, 193, 0.1)",
  cursor: "pointer",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  transition: "all 0.3s ease",
};

const cardImageWrapperStyle = {
  position: "relative",
  overflow: "hidden",
  height: "280px",
  backgroundColor: "#fff0f5",
};

const cardImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  transition: "transform 0.3s ease",
};

const cardPremiumBadgeStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "linear-gradient(135deg, #ffd700, #ffa500)",
  color: "white",
  padding: "6px 15px",
  borderRadius: "25px",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  boxShadow: "0 5px 15px rgba(255, 215, 0, 0.3)",
  zIndex: 2,
};

const cardContentStyle = {
  padding: "20px",
  background: "white",
};

const cardTitleStyle = {
  fontSize: "18px",
  margin: "0 0 8px 0",
  color: TITLE_COLOR,
  fontWeight: "600",
};

const cardRatingStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "10px",
};

const cardStarStyle = {
  color: "#ffd700",
  fontSize: "14px",
  letterSpacing: "2px",
};

const cardRatingTextStyle = {
  fontSize: "12px",
  color: SUBTITLE_COLOR,
};

const cardDescriptionStyle = {
  fontSize: "14px",
  color: SUBTITLE_COLOR,
  margin: "0 0 15px 0",
  lineHeight: "1.5",
};

const cardPriceStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  padding: "10px 0",
  borderTop: "1px solid rgba(255, 182, 193, 0.3)",
  borderBottom: "1px solid rgba(255, 182, 193, 0.3)",
};

const cardPriceLabelStyle = {
  fontSize: "14px",
  color: SUBTITLE_COLOR,
};

const cardPriceValueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#ff69b4",
};

const cardButtonGroupStyle = {
  display: "flex",
  gap: "10px",
};

const cardCartButtonStyle = {
  flex: 1,
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.3s",
};

const cardButtonIconStyle = {
  fontSize: "16px",
};

const cardBuyButtonStyle = {
  flex: 1,
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  border: "none",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s",
  boxShadow: "0 5px 15px rgba(255, 105, 180, 0.3)",
};

/* ========== STYLE RIWAYAT ========== */
const riwayatContainerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "20px",
};

const riwayatHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "15px",
};

const riwayatTitleStyle = {
  fontSize: "28px",
  color: TITLE_COLOR,
  margin: 0,
  fontWeight: "600",
};

const riwayatSubTabStyle = {
  display: "flex",
  gap: "10px",
  background: "rgba(255, 255, 255, 0.7)",
  padding: "5px",
  borderRadius: "50px",
};

const riwayatSubTabInactiveStyle = {
  padding: "10px 20px",
  borderRadius: "30px",
  border: "none",
  background: "transparent",
  color: TITLE_COLOR,
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s",
};

const riwayatSubTabActiveStyle = {
  ...riwayatSubTabInactiveStyle,
  background: "white",
  color: "#ff69b4",
  boxShadow: "0 5px 15px rgba(255, 105, 180, 0.2)",
};

const riwayatEmptyStyle = {
  textAlign: "center",
  padding: "60px 20px",
  background: "rgba(255, 255, 255, 0.7)",
  borderRadius: "30px",
  backdropFilter: "blur(10px)",
};

const riwayatEmptyIconStyle = {
  fontSize: "60px",
  marginBottom: "20px",
  opacity: 0.5,
};

const riwayatEmptyTextStyle = {
  fontSize: "18px",
  color: SUBTITLE_COLOR,
  marginBottom: "20px",
};

const riwayatEmptyButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "15px 40px",
  borderRadius: "50px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(255, 105, 180, 0.3)",
};

const riwayatListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const riwayatCardStyle = {
  display: "flex",
  gap: "20px",
  background: "white",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 5px 20px rgba(255, 182, 193, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  transition: "transform 0.3s",
  alignItems: "center",
};

const riwayatCardImgStyle = {
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "15px",
  background: "#fff0f5",
};

const riwayatCardInfoStyle = {
  flex: 1,
};

const riwayatCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "5px",
};

const riwayatCardNamaStyle = {
  fontSize: "16px",
  margin: 0,
  color: TITLE_COLOR,
  fontWeight: "600",
};

const riwayatCardStatusStyle = {
  background: "#4caf50",
  color: "white",
  padding: "3px 10px",
  borderRadius: "15px",
  fontSize: "11px",
  fontWeight: "500",
};

const riwayatReturStatusStyle = {
  background: "#ff9800",
  color: "white",
  padding: "3px 10px",
  borderRadius: "15px",
  fontSize: "11px",
  fontWeight: "500",
};

const riwayatCardHargaStyle = {
  fontSize: "14px",
  color: "#ff69b4",
  fontWeight: "bold",
  margin: "5px 0",
};

const riwayatCardTanggalStyle = {
  fontSize: "12px",
  color: SUBTITLE_COLOR,
  margin: 0,
};

const riwayatReturButtonStyle = {
  background: "transparent",
  border: "2px solid #ff9800",
  color: "#ff9800",
  padding: "8px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  transition: "all 0.3s",
  whiteSpace: "nowrap",
};

const riwayatInvoiceStyle = {
  fontSize: "11px",
  color: "#ff69b4",
  marginTop: "3px",
  fontWeight: "500",
};

/* ========== STYLE CART MODAL ========== */
const cartModalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(5px)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cartModalStyle = {
  background: "white",
  borderRadius: "30px",
  width: "90%",
  maxWidth: "450px",
  maxHeight: "80vh",
  overflow: "hidden",
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
  animation: "slideUp 0.3s ease",
};

const cartModalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 25px",
  borderBottom: "1px solid #ffb6c1",
};

const cartModalTitleStyle = {
  margin: 0,
  fontSize: "20px",
  color: TITLE_COLOR,
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const cartModalIconStyle = {
  fontSize: "24px",
};

const cartModalCloseStyle = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#ff69b4",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.3s",
};

const cartModalContentStyle = {
  padding: "20px 25px",
  maxHeight: "calc(80vh - 80px)",
  overflowY: "auto",
};

const cartEmptyStyle = {
  textAlign: "center",
  padding: "40px 20px",
};

const cartEmptyIconStyle = {
  fontSize: "60px",
  opacity: 0.5,
  marginBottom: "20px",
};

const cartEmptyTextStyle = {
  fontSize: "16px",
  color: SUBTITLE_COLOR,
  marginBottom: "20px",
};

const cartEmptyButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px 30px",
  borderRadius: "50px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

const cartItemStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  padding: "10px",
  background: "#fff0f5",
  borderRadius: "15px",
  transition: "transform 0.2s",
};

const cartItemImageStyle = {
  width: "70px",
  height: "70px",
  objectFit: "cover",
  borderRadius: "12px",
  background: "#fff0f5",
};

const cartItemInfoStyle = {
  flex: 1,
};

const cartItemHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const cartItemNameStyle = {
  fontSize: "15px",
  color: TITLE_COLOR,
  fontWeight: "600",
};

const cartItemPriceStyle = {
  fontSize: "14px",
  color: "#ff69b4",
  fontWeight: "600",
  margin: 0,
};

const cartItemFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cartItemQtyStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "white",
  padding: "5px",
  borderRadius: "10px",
};

const cartQtyButtonStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  background: "white",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ff69b4",
  transition: "all 0.2s",
  fontWeight: "bold",
};

const cartQtyValueStyle = {
  minWidth: "25px",
  textAlign: "center",
  fontWeight: "bold",
  color: TITLE_COLOR,
};

const cartItemSubtotalStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: TITLE_COLOR,
};

const cartTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "20px 0",
  padding: "15px",
  background: "linear-gradient(135deg, #fff0f5, #ffe4e1)",
  borderRadius: "15px",
};

const cartTotalLabelStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: TITLE_COLOR,
};

const cartTotalValueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#ff69b4",
};

const cartCheckoutButtonStyle = {
  width: "100%",
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "18px",
  borderRadius: "15px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.3s",
  boxShadow: "0 10px 25px rgba(255, 105, 180, 0.3)",
};

const cartCheckoutIconStyle = {
  fontSize: "18px",
};

/* ========== STYLE FLOATING CART ========== */
const floatingCartStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  width: "65px",
  height: "65px",
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(255, 105, 180, 0.4)",
  zIndex: 1000,
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  border: "3px solid white",
};

const floatingCartIconStyle = {
  fontSize: "28px",
  color: "white",
};

const floatingCartBadgeStyle = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "#ff4500",
  color: "white",
  borderRadius: "50%",
  padding: "5px 8px",
  fontSize: "12px",
  minWidth: "22px",
  textAlign: "center",
  fontWeight: "bold",
  border: "2px solid white",
  boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
};

// Animasi
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translate(-50%, -20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
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
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  button:hover:not(:disabled) {
    transform: scale(1.02);
  }
  
  .riwayat-card:hover {
    transform: translateX(5px);
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #ffe4e1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #ff1493;
  }
`;
document.head.appendChild(style);

export default Produk;