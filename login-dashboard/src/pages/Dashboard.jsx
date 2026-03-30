// src/pages/Dashboard.jsx
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useCart } from "../context/CartContext";


// KONSTANTA UNTUK KONSISTENSI UKURAN
const TITLE_SIZE = "42px";
const SUBTITLE_SIZE = "18px";
const TITLE_COLOR = "#8b5f6c";
const SUBTITLE_COLOR = "#b48c9c";

function Dashboard() {
  const location = useLocation();
  const { stats, riwayatPembelian, returItems } = useCart();
  
  // State untuk modal
  const [showRamalan, setShowRamalan] = useState(false);
  const [ramalanTerpilih, setRamalanTerpilih] = useState(null);
  
  // State untuk Pesan
  const [showPesan, setShowPesan] = useState(false);
  const [pesanList, setPesanList] = useState([
    {
      id: 1,
      dari: "Rizki Maulana",
      email: "rizki@email.com",
      pesan: "Apakah vas bunga kecil bisa dikirim ke luar kota?",
      waktu: "10 menit yang lalu",
      status: "Belum dibaca",
      avatar: "👤"
    },
    {
      id: 2,
      dari: "Nadia Putri",
      email: "nadia@email.com",
      pesan: "Saya mau tanya stok guci bunga masih ada?",
      waktu: "25 menit yang lalu",
      status: "Belum dibaca",
      avatar: "👩"
    },
    {
      id: 3,
      dari: "Fahri Hidayat",
      email: "fahri@email.com",
      pesan: "Apakah ada garansi untuk produk keramik?",
      waktu: "1 jam yang lalu",
      status: "Sudah dibaca",
      avatar: "👨"
    }
  ]);

  // State untuk Review
  const [showReview, setShowReview] = useState(false);
  const [reviewList, setReviewList] = useState([
    {
      id: 1,
      dari: "Laila Sari",
      rating: 5,
      komentar: "Vasnya cantik banget! Sesuai foto, pengiriman cepat.",
      produk: "Vas Bunga Kecil",
      waktu: "2 jam yang lalu",
      avatar: "👩"
    },
    {
      id: 2,
      dari: "Aditya Wibowo",
      rating: 4,
      komentar: "Piring makannya bagus, motifnya klasik. Recommended!",
      produk: "Piring Makan",
      waktu: "5 jam yang lalu",
      avatar: "👨"
    },
    {
      id: 3,
      dari: "Sabrina Dewi",
      rating: 5,
      komentar: "Guci bunganya aesthetic banget, cocok buat dekorasi rumah.",
      produk: "Guci Bunga",
      waktu: "1 hari yang lalu",
      avatar: "👩"
    }
  ]);

  useEffect(() => {
    if (location.state?.name) {
      localStorage.setItem("name", location.state.name);
    }
    if (location.state?.role) {
      localStorage.setItem("role", location.state.role);
    }
  }, [location]);

  // Fungsi untuk handle klik ramalan
  const handleRamalanClick = (ramalan) => {
    setRamalanTerpilih(ramalan);
    setShowRamalan(true);
  };

  // Fungsi untuk handle klik pesan
  const handlePesanClick = (pesan) => {
    // Tandai sebagai sudah dibaca
    setPesanList(prev => 
      prev.map(p => p.id === pesan.id ? {...p, status: "Sudah dibaca"} : p)
    );
    setShowPesan(true);
  };

  // Fungsi untuk handle klik review
  const handleReviewClick = (review) => {
    setShowReview(true);
  };

  // Fungsi untuk mendapatkan konten ramalan
  const getRamalanContent = () => {
    switch(ramalanTerpilih) {
      case 'trafik':
        return {
          title: '📊 Ramalan Trafik',
          icon: '📊',
          description: 'Trafik pengunjung diprediksi akan meningkat 12% dalam 7 hari ke depan.',
          details: [
            '📅 Hari ini: 150 pengunjung',
            '📅 Besok: 168 pengunjung (+12%)',
            '📅 7 hari mendatang: 210 pengunjung (+40%)',
            '⏰ Jam sibuk: 19.00 - 21.00 WIB',
            '📱 Trafik mobile: 65% dari total'
          ],
          color: '#ff69b4'
        };
      case 'konversi':
        return {
          title: '🔄 Ramalan Konversi',
          icon: '🔄',
          description: 'Rate konversi diprediksi stabil di 5.2% dengan potensi kenaikan di akhir pekan.',
          details: [
            '✅ Rata-rata: 5 dari 100 pengunjung belanja',
            '📈 Target bulan ini: 7%',
            '💡 Tips: Tingkatkan promo untuk naikkan konversi',
            '🌟 Hari terbaik: Sabtu & Minggu',
            '🎯 Konversi tertinggi: Produk kategori Vas'
          ],
          color: '#ff9800'
        };
      case 'nilai':
        return {
          title: '💰 Ramalan Nilai Belanja',
          icon: '💰',
          description: 'Nilai rata-rata belanja diprediksi Rp 125.000 per transaksi.',
          details: [
            '🛍️ Tertinggi: Rp 350.000 (produk premium)',
            '📦 Terendah: Rp 45.000 (produk murah)',
            '📊 Rata-rata 3 item per transaksi',
            '💎 Produk premium: Guci, Lampu Meja',
            '📈 Naik 15% saat akhir bulan'
          ],
          color: '#4caf50'
        };
      case 'penjualan':
        return {
          title: '📈 Ramalan Penjualan',
          icon: '📈',
          description: 'Penjualan diprediksi naik 8.5% minggu ini dengan total pendapatan Rp 2.5 Juta.',
          details: [
            '💰 Estimasi pendapatan: Rp 2.500.000',
            '📦 Estimasi unit terjual: 45 item',
            '🔥 Produk terlaris: Vas Bunga, Guci, Cangkir',
            '⭐ Kategori terlaris: Vas (35% dari total)',
            '📅 Puncak penjualan: Akhir pekan'
          ],
          color: '#9c27b0'
        };
      default:
        return {
          title: 'Ramalan',
          icon: '📊',
          description: 'Pilih kategori ramalan untuk melihat detail.',
          details: [],
          color: '#ff69b4'
        };
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />

      {/* Konten Dashboard */}
      <div style={dashboardContentStyle}>
        {/* Header Dashboard */}
        <div style={dashboardHeaderStyle}>
          <h1 style={dashboardTitleStyle}>Dashboard</h1>
          <p style={dashboardSubtitleStyle}>Ringkasan kegiatan toko Anda</p>
        </div>

        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>👥</div>
            <div style={statContentStyle}>
              <span style={statLabelStyle}>Pengunjung online</span>
              <span style={statValueStyle}>{stats.pengunjungOnline}</span>
              <span style={statPeriodStyle}>Terakhir 30 menit</span>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>🛒</div>
            <div style={statContentStyle}>
              <span style={statLabelStyle}>Cart aktif</span>
              <span style={statValueStyle}>{stats.cartAktif}</span>
              <span style={statPeriodStyle}>Terakhir 30 menit</span>
            </div>
          </div>
        </div>

        {/* Pending Items */}
        <div style={pendingGridStyle}>
          <div style={pendingCardStyle}>
            <span style={pendingLabelStyle}>Penjualan</span>
            <span style={pendingValueStyle}>{stats.penjualan}</span>
          </div>
          <div style={pendingCardStyle}>
            <span style={pendingLabelStyle}>Retur/pengembalian</span>
            <span style={pendingValueStyle}>{stats.retur}</span>
          </div>
          <div style={pendingCardStyle}>
            <span style={pendingLabelStyle}>Abandoned carts</span>
            <span style={pendingValueStyle}>{stats.abandonedCarts}</span>
          </div>
          <div style={pendingCardStyle}>
            <span style={pendingLabelStyle}>Produk telah habis</span>
            <span style={pendingValueStyle}>{stats.produkHabis}</span>
          </div>
        </div>

        {/* Notifications - PESAN DAN REVIEW AKTIF */}
        <div style={notifGridStyle}>
          <div 
            style={notifCardClickableStyle} 
            onClick={() => setShowPesan(true)}
          >
            <div style={notifLeftStyle}>
              <span style={notifIconStyle}>✉️</span>
              <span style={notifLabelStyle}>Pesan baru</span>
            </div>
            <div style={notifRightStyle}>
              <span style={notifValueStyle}>{stats.pesanBaru + pesanList.filter(p => p.status === "Belum dibaca").length}</span>
              <span style={notifArrowStyle}>→</span>
            </div>
          </div>
          <div 
            style={notifCardClickableStyle} 
            onClick={() => setShowReview(true)}
          >
            <div style={notifLeftStyle}>
              <span style={notifIconStyle}>⭐</span>
              <span style={notifLabelStyle}>Review produk</span>
            </div>
            <div style={notifRightStyle}>
              <span style={notifValueStyle}>{stats.reviewProduk + reviewList.length}</span>
              <span style={notifArrowStyle}>→</span>
            </div>
          </div>
        </div>

        {/* Penjualan Section */}
        <div style={salesCardStyle}>
          <h3 style={salesTitleStyle}>Penjualan</h3>
          <div style={salesGridStyle}>
            <div style={salesItemStyle}>
              <span style={salesValueStyle}>Rp {stats.totalPenjualan.toLocaleString()}</span>
            </div>
            <div style={salesItemStyle}>
              <span style={salesLabelStyle}>Nilai keranjang belanja</span>
              <span style={salesValueStyle}>Rp {stats.nilaiKeranjang.toLocaleString()}</span>
            </div>
            <div style={salesItemStyle}>
              <span style={salesLabelStyle}>Kunjungan</span>
              <span style={salesValueStyle}>{stats.kunjungan}</span>
            </div>
            <div style={salesItemStyle}>
              <span style={salesLabelStyle}>Rate konversi</span>
              <span style={salesValueStyle}>{stats.rateKonversi}%</span>
            </div>
            <div style={salesItemStyle}>
              <span style={salesLabelStyle}>Pendapatan bersih</span>
              <span style={salesValueStyle}>Rp {stats.pendapatanBersih.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Ramalan Section - Bisa Diklik */}
        <div style={forecastCardStyle}>
          <h3 style={forecastTitleStyle}>
            <span style={forecastTitleIconStyle}>🔮</span> 
            Ramalan & Prediksi
          </h3>
          <div style={forecastGridStyle}>
            <div 
              style={forecastItemClickableStyle} 
              onClick={() => handleRamalanClick('trafik')}
            >
              <div style={forecastIconStyle}>📊</div>
              <div style={forecastLabelStyle}>Trafik</div>
              <div style={forecastValueStyle}>+12%</div>
              <div style={forecastTrendStyle}>📈 Meningkat</div>
            </div>
            <div 
              style={forecastItemClickableStyle} 
              onClick={() => handleRamalanClick('konversi')}
            >
              <div style={forecastIconStyle}>🔄</div>
              <div style={forecastLabelStyle}>Konversi</div>
              <div style={forecastValueStyle}>5.2%</div>
              <div style={forecastTrendStyle}>📊 Stabil</div>
            </div>
            <div 
              style={forecastItemClickableStyle} 
              onClick={() => handleRamalanClick('nilai')}
            >
              <div style={forecastIconStyle}>💰</div>
              <div style={forecastLabelStyle}>Nilai Belanja</div>
              <div style={forecastValueStyle}>Rp125K</div>
              <div style={forecastTrendStyle}>📈 Naik 15%</div>
            </div>
            <div 
              style={forecastItemClickableStyle} 
              onClick={() => handleRamalanClick('penjualan')}
            >
              <div style={forecastIconStyle}>📈</div>
              <div style={forecastLabelStyle}>Penjualan</div>
              <div style={forecastValueStyle}>+8.5%</div>
              <div style={forecastTrendStyle}>📈 Meningkat</div>
            </div>
          </div>
          <div style={forecastFooterStyle}>
            <span style={forecastFooterTextStyle}>Klik item untuk melihat detail ramalan</span>
          </div>
        </div>

        {/* Riwayat Retur Terbaru */}
        <div style={returCardStyle}>
          <h3 style={returTitleStyle}>Retur Terbaru</h3>
          {returItems.length === 0 ? (
            <p style={returEmptyStyle}>Belum ada retur</p>
          ) : (
            returItems.slice(0, 3).map((item, index) => (
              <div key={index} style={returItemStyle}>
                <div style={returItemInfoStyle}>
                  <b>{item.nama}</b>
                  <p style={returItemDateStyle}>Tanggal: {item.tanggalRetur}</p>
                </div>
                <span style={returStatusStyle}>{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL PESAN */}
      {showPesan && (
        <div style={modalOverlayStyle} onClick={() => setShowPesan(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>📬 Pesan Masuk</h3>
              <button style={modalCloseStyle} onClick={() => setShowPesan(false)}>✕</button>
            </div>
            
            <div style={modalBodyStyle}>
              {pesanList.length === 0 ? (
                <div style={modalEmptyStyle}>
                  <span style={modalEmptyIconStyle}>📭</span>
                  <p style={modalEmptyTextStyle}>Tidak ada pesan</p>
                </div>
              ) : (
                pesanList.map((pesan) => (
                  <div key={pesan.id} style={pesanItemStyle}>
                    <div style={pesanAvatarStyle}>{pesan.avatar}</div>
                    <div style={pesanContentStyle}>
                      <div style={pesanHeaderStyle}>
                        <span style={pesanNamaStyle}>{pesan.dari}</span>
                        <span style={pesanStatusStyle(pesan.status)}>
                          {pesan.status}
                        </span>
                      </div>
                      <div style={pesanEmailStyle}>{pesan.email}</div>
                      <p style={pesanTextStyle}>{pesan.pesan}</p>
                      <div style={pesanFooterStyle}>
                        <span style={pesanWaktuStyle}>{pesan.waktu}</span>
                        <button style={pesanBalasStyle}>Balas</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={modalFooterStyle}>
              <button style={modalButtonStyle} onClick={() => setShowPesan(false)}>
                Tutup
              </button>
              <button style={modalDetailButtonStyle}>
                Arsipkan Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REVIEW */}
      {showReview && (
        <div style={modalOverlayStyle} onClick={() => setShowReview(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>⭐ Ulasan Produk</h3>
              <button style={modalCloseStyle} onClick={() => setShowReview(false)}>✕</button>
            </div>
            
            <div style={modalBodyStyle}>
              {reviewList.length === 0 ? (
                <div style={modalEmptyStyle}>
                  <span style={modalEmptyIconStyle}>📝</span>
                  <p style={modalEmptyTextStyle}>Belum ada review</p>
                </div>
              ) : (
                reviewList.map((review) => (
                  <div key={review.id} style={reviewItemStyle}>
                    <div style={reviewAvatarStyle}>{review.avatar}</div>
                    <div style={reviewContentStyle}>
                      <div style={reviewHeaderStyle}>
                        <span style={reviewNamaStyle}>{review.dari}</span>
                        <div style={reviewRatingStyle}>
                          {[1,2,3,4,5].map((bintang) => (
                            <span key={bintang} style={{color: bintang <= review.rating ? '#ffd700' : '#e0e0e0'}}>★</span>
                          ))}
                        </div>
                      </div>
                      <div style={reviewProdukStyle}>Produk: {review.produk}</div>
                      <p style={reviewKomentarStyle}>"{review.komentar}"</p>
                      <div style={reviewFooterStyle}>
                        <span style={reviewWaktuStyle}>{review.waktu}</span>
                        <div style={reviewAksiStyle}>
                          <button style={reviewBalasStyle}>Balas</button>
                          <button style={reviewHapusStyle}>Hapus</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={modalFooterStyle}>
              <button style={modalButtonStyle} onClick={() => setShowReview(false)}>
                Tutup
              </button>
              <button style={modalDetailButtonStyle}>
                Lihat Semua Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RAMALAN (tetap sama) */}
      {showRamalan && (
        <div style={modalOverlayStyle} onClick={() => setShowRamalan(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            {(() => {
              const content = getRamalanContent();
              return (
                <>
                  <div style={modalHeaderStyle}>
                    <h3 style={modalTitleStyle}>{content.title}</h3>
                    <button style={modalCloseStyle} onClick={() => setShowRamalan(false)}>✕</button>
                  </div>
                  
                  <div style={modalBodyStyle}>
                    <div style={{...modalIconStyle, background: content.color}}>
                      {content.icon}
                    </div>
                    
                    <p style={modalTextStyle}>{content.description}</p>
                    
                    <div style={modalDetailContainerStyle}>
                      {content.details.map((detail, idx) => (
                        <div key={idx} style={modalDetailItemStyle}>
                          <span style={modalDetailBulletStyle}>•</span>
                          <span style={modalDetailTextStyle}>{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div style={modalChartStyle}>
                      <div style={modalChartBarStyle}>
                        <div style={{...modalChartFillStyle, width: '70%', background: content.color}}></div>
                      </div>
                      <div style={modalChartLabelStyle}>
                        <span>Rendah</span>
                        <span>Sedang</span>
                        <span>Tinggi</span>
                      </div>
                    </div>

                    <div style={modalTipStyle}>
                      <span style={modalTipIconStyle}>💡</span>
                      <span style={modalTipTextStyle}>
                        {ramalanTerpilih === 'trafik' && 'Tambah staf pada jam sibuk untuk layanan lebih cepat'}
                        {ramalanTerpilih === 'konversi' && 'Beri diskon khusus untuk pengunjung pertama'}
                        {ramalanTerpilih === 'nilai' && 'Tawarkan bundle produk untuk naikkan nilai belanja'}
                        {ramalanTerpilih === 'penjualan' && 'Siapkan stok lebih untuk produk terlaris'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={modalFooterStyle}>
                    <button style={modalButtonStyle} onClick={() => setShowRamalan(false)}>
                      Tutup
                    </button>
                    <button style={modalDetailButtonStyle}>
                      Lihat Detail Lengkap →
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== STYLE ========== */

// Page Style
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
  fontFamily: "'Poppins', 'Inter', sans-serif",
  padding: "100px 20px 40px 20px",
};

// Dashboard Content
const dashboardContentStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const dashboardHeaderStyle = {
  marginBottom: "40px",
  textAlign: "center",
};

const dashboardTitleStyle = {
  fontSize: TITLE_SIZE,
  color: TITLE_COLOR,
  margin: "0 0 10px 0",
  textShadow: "2px 2px 4px rgba(255,255,255,0.5)",
  fontWeight: "700",
};

const dashboardSubtitleStyle = {
  fontSize: SUBTITLE_SIZE,
  color: SUBTITLE_COLOR,
  margin: 0,
};

// Stats Cards
const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "30px",
  marginBottom: "30px",
};

const statCardStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(255, 182, 193, 0.3)",
  display: "flex",
  alignItems: "center",
  gap: "25px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
};

const statIconStyle = {
  fontSize: "48px",
  background: "linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%)",
  width: "80px",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "20px",
  color: "white",
};

const statContentStyle = {
  display: "flex",
  flexDirection: "column",
};

const statLabelStyle = {
  fontSize: "16px",
  color: SUBTITLE_COLOR,
  marginBottom: "5px",
};

const statValueStyle = {
  fontSize: "36px",
  fontWeight: "bold",
  color: TITLE_COLOR,
  lineHeight: "1.2",
};

const statPeriodStyle = {
  fontSize: "14px",
  color: "#cfa5b5",
};

// Pending Items
const pendingGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
  marginBottom: "30px",
};

const pendingCardStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 15px 30px rgba(255, 182, 193, 0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
};

const pendingLabelStyle = {
  fontSize: "15px",
  color: SUBTITLE_COLOR,
};

const pendingValueStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#ff69b4",
};

// Notifications - BARU (bisa diklik)
const notifGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "25px",
  marginBottom: "30px",
};

const notifCardClickableStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "20px 25px",
  borderRadius: "20px",
  boxShadow: "0 15px 30px rgba(255, 182, 193, 0.2)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  ":hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 20px 35px rgba(255, 105, 180, 0.3)",
  }
};

const notifLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const notifIconStyle = {
  fontSize: "24px",
};

const notifLabelStyle = {
  fontSize: "16px",
  color: SUBTITLE_COLOR,
};

const notifRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const notifValueStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: TITLE_COLOR,
};

const notifArrowStyle = {
  fontSize: "18px",
  color: "#ff69b4",
  opacity: 0.7,
};

// Sales Section
const salesCardStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(255, 182, 193, 0.3)",
  marginBottom: "30px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
};

const salesTitleStyle = {
  margin: "0 0 25px 0",
  fontSize: "24px",
  color: TITLE_COLOR,
  fontWeight: "600",
};

const salesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "20px",
};

const salesItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "15px",
  background: "rgba(255, 240, 245, 0.5)",
  borderRadius: "16px",
};

const salesLabelStyle = {
  fontSize: "13px",
  color: SUBTITLE_COLOR,
};

const salesValueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: TITLE_COLOR,
};

// Forecast Section
const forecastCardStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "30px",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(255, 182, 193, 0.3)",
  marginBottom: "30px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
};

const forecastTitleStyle = {
  margin: "0 0 25px 0",
  fontSize: "24px",
  color: TITLE_COLOR,
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const forecastTitleIconStyle = {
  fontSize: "28px",
};

const forecastGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "15px",
};

const forecastItemClickableStyle = {
  padding: "20px",
  background: "linear-gradient(135deg, #fff0f5, #ffe4e1)",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 5px 15px rgba(255, 182, 193, 0.2)",
};

const forecastIconStyle = {
  fontSize: "32px",
  marginBottom: "10px",
};

const forecastLabelStyle = {
  fontSize: "14px",
  color: TITLE_COLOR,
  fontWeight: "600",
  marginBottom: "5px",
};

const forecastValueStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ff69b4",
  marginBottom: "5px",
};

const forecastTrendStyle = {
  fontSize: "12px",
  color: SUBTITLE_COLOR,
};

const forecastFooterStyle = {
  marginTop: "20px",
  textAlign: "center",
  padding: "10px",
  background: "rgba(255, 255, 255, 0.5)",
  borderRadius: "30px",
};

const forecastFooterTextStyle = {
  fontSize: "13px",
  color: SUBTITLE_COLOR,
  fontStyle: "italic",
};

// Retur Section
const returCardStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 15px 30px rgba(255, 182, 193, 0.2)",
  marginBottom: "30px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)",
};

const returTitleStyle = {
  margin: "0 0 20px 0",
  fontSize: "20px",
  color: TITLE_COLOR,
  fontWeight: "600",
};

const returEmptyStyle = {
  textAlign: "center",
  color: SUBTITLE_COLOR,
  padding: "20px",
};

const returItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
  borderBottom: "1px solid #ffb6c1",
};

const returItemInfoStyle = {
  flex: 1,
};

const returItemDateStyle = {
  fontSize: "12px",
  color: SUBTITLE_COLOR,
  margin: "3px 0 0 0",
};

const returStatusStyle = {
  background: "#ffd700",
  color: "#8b5f6c",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
};

/* ========== STYLE MODAL ========== */
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.5)",
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
  maxWidth: "500px",
  maxHeight: "80vh",
  overflow: "hidden",
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
  animation: "slideUp 0.3s ease",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 25px",
  borderBottom: "1px solid #ffb6c1",
};

const modalTitleStyle = {
  margin: 0,
  fontSize: "20px",
  color: TITLE_COLOR,
  fontWeight: "600",
};

const modalCloseStyle = {
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

const modalBodyStyle = {
  padding: "25px",
  overflowY: "auto",
  maxHeight: "calc(80vh - 130px)",
};

const modalEmptyStyle = {
  textAlign: "center",
  padding: "40px 20px",
};

const modalEmptyIconStyle = {
  fontSize: "60px",
  opacity: 0.5,
  marginBottom: "20px",
};

const modalEmptyTextStyle = {
  fontSize: "16px",
  color: SUBTITLE_COLOR,
};

const modalIconStyle = {
  fontSize: "48px",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px auto",
  color: "white",
};

const modalTextStyle = {
  fontSize: "16px",
  color: TITLE_COLOR,
  marginBottom: "20px",
  fontWeight: "500",
  textAlign: "center",
};

const modalDetailContainerStyle = {
  background: "#fff0f5",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
};

const modalDetailItemStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
  alignItems: "flex-start",
};

const modalDetailBulletStyle = {
  color: "#ff69b4",
  fontSize: "18px",
  lineHeight: "1.4",
};

const modalDetailTextStyle = {
  fontSize: "14px",
  color: TITLE_COLOR,
  lineHeight: "1.4",
  flex: 1,
};

const modalChartStyle = {
  marginBottom: "20px",
};

const modalChartBarStyle = {
  height: "8px",
  background: "#ffe4e1",
  borderRadius: "4px",
  overflow: "hidden",
  marginBottom: "5px",
};

const modalChartFillStyle = {
  height: "100%",
  borderRadius: "4px",
};

const modalChartLabelStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: SUBTITLE_COLOR,
};

const modalTipStyle = {
  background: "linear-gradient(135deg, #fff0f5, #ffe4e1)",
  padding: "15px",
  borderRadius: "12px",
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
};

const modalTipIconStyle = {
  fontSize: "20px",
};

const modalTipTextStyle = {
  fontSize: "14px",
  color: TITLE_COLOR,
  lineHeight: "1.4",
  flex: 1,
};

const modalFooterStyle = {
  display: "flex",
  gap: "10px",
  padding: "20px 25px",
  borderTop: "1px solid #ffb6c1",
};

const modalButtonStyle = {
  flex: 1,
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s",
};

const modalDetailButtonStyle = {
  flex: 2,
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.3s",
};

/* ========== STYLE PESAN ========== */
const pesanItemStyle = {
  display: "flex",
  gap: "15px",
  padding: "15px",
  borderBottom: "1px solid #ffb6c1",
  transition: "background 0.3s",
  ":hover": {
    background: "#fff0f5",
  }
};

const pesanAvatarStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #ffb6c1, #ff69b4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  color: "white",
};

const pesanContentStyle = {
  flex: 1,
};

const pesanHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "5px",
};

const pesanNamaStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: TITLE_COLOR,
};

const pesanStatusStyle = (status) => ({
  fontSize: "11px",
  padding: "3px 8px",
  borderRadius: "12px",
  background: status === "Belum dibaca" ? "#ff69b4" : "#e0e0e0",
  color: status === "Belum dibaca" ? "white" : "#666",
});

const pesanEmailStyle = {
  fontSize: "12px",
  color: SUBTITLE_COLOR,
  marginBottom: "5px",
};

const pesanTextStyle = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "8px",
  lineHeight: "1.4",
};

const pesanFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const pesanWaktuStyle = {
  fontSize: "11px",
  color: "#999",
};

const pesanBalasStyle = {
  background: "transparent",
  border: "1px solid #ff69b4",
  color: "#ff69b4",
  padding: "4px 12px",
  borderRadius: "15px",
  fontSize: "12px",
  cursor: "pointer",
};

/* ========== STYLE REVIEW ========== */
const reviewItemStyle = {
  display: "flex",
  gap: "15px",
  padding: "15px",
  borderBottom: "1px solid #ffb6c1",
};

const reviewAvatarStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #ffd700, #ffb6c1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  color: "white",
};

const reviewContentStyle = {
  flex: 1,
};

const reviewHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "5px",
};

const reviewNamaStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: TITLE_COLOR,
};

const reviewRatingStyle = {
  display: "flex",
  gap: "2px",
  fontSize: "16px",
};

const reviewProdukStyle = {
  fontSize: "12px",
  color: "#ff69b4",
  marginBottom: "5px",
  fontWeight: "500",
};

const reviewKomentarStyle = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "8px",
  fontStyle: "italic",
  lineHeight: "1.4",
};

const reviewFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const reviewWaktuStyle = {
  fontSize: "11px",
  color: "#999",
};

const reviewAksiStyle = {
  display: "flex",
  gap: "8px",
};

const reviewBalasStyle = {
  background: "transparent",
  border: "1px solid #ff69b4",
  color: "#ff69b4",
  padding: "4px 12px",
  borderRadius: "15px",
  fontSize: "12px",
  cursor: "pointer",
};

const reviewHapusStyle = {
  background: "transparent",
  border: "1px solid #ff4444",
  color: "#ff4444",
  padding: "4px 12px",
  borderRadius: "15px",
  fontSize: "12px",
  cursor: "pointer",
};

// Animasi
const style = document.createElement('style');
style.textContent = `
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
  
  .notif-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 35px rgba(255, 105, 180, 0.3);
  }
  
  .forecast-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(255, 105, 180, 0.3);
  }
  
  .pesan-item:hover {
    background: #fff0f5;
  }
  
  .review-item:hover {
    background: #fff0f5;
  }
`;
document.head.appendChild(style);

export default Dashboard;