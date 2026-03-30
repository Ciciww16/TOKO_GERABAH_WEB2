// src/pages/Transactions.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function Transactions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setUserRole(role);

    if (role !== 'admin' && role !== 'cashier') {
      alert('⚠️ Akses Ditolak! Halaman ini hanya untuk Admin dan Cashier.');
      navigate('/produk');
    }
  }, [navigate]);

  // Ambil data transaksi dari database
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:5000/transactions", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data transaksi');
        }
        
        const data = await response.json();
        console.log('Data transaksi:', data);
        setTransactions(data);
        
      } catch (err) {
        console.error('Error fetching transactions:', err);
        // Data dummy
        setTransactions([
          { 
            id: 1, 
            invoice: "INV-20260310-1", 
            customer: "Tsabitha", 
            date: "2026-03-10", 
            total: 165000, 
            status: "Selesai", 
            items: [
              { id: 1, product_name: "Vas Bunga Kecil Polos", quantity: 2, subtotal: 90000 },
              { id: 2, product_name: "Vas Bunga Sedang", quantity: 1, subtotal: 75000 }
            ]
          },
          { 
            id: 2, 
            invoice: "INV-20260311-2", 
            customer: "Ncitra", 
            date: "2026-03-11", 
            total: 95000, 
            status: "Selesai", 
            items: [
              { id: 3, product_name: "Mangkok Sup", quantity: 1, subtotal: 95000 }
            ]
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transaksi berdasarkan tanggal
  const filterTransactions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      
      switch(dateFilter) {
        case 'today':
          return txDate.getTime() === today.getTime();
        case 'week':
          return txDate >= oneWeekAgo;
        case 'month':
          return txDate >= oneMonthAgo;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = filterTransactions();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Selesai': return '#4caf50';
      case 'Diproses': return '#ff9800';
      case 'Dibatalkan': return '#f44336';
      default: return '#999';
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetail(true);
  };

  // Hitung total penjualan
  const totalPenjualan = filteredTransactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalItems = filteredTransactions.reduce((sum, tx) => sum + (tx.items?.length || 1), 0);

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>💳 Transaksi Penjualan</h1>
            <p style={subtitleStyle}>
              {userRole === 'admin' ? 'Kelola semua transaksi' : 'Lihat transaksi harian'}
            </p>
          </div>
        </div>

        {/* Filter dan Statistik */}
        <div style={filterStatsContainerStyle}>
          <div style={filterContainerStyle}>
            <button 
              style={dateFilter === 'all' ? filterActiveStyle : filterButtonStyle}
              onClick={() => setDateFilter('all')}
            >
              Semua
            </button>
            <button 
              style={dateFilter === 'today' ? filterActiveStyle : filterButtonStyle}
              onClick={() => setDateFilter('today')}
            >
              Hari Ini
            </button>
            <button 
              style={dateFilter === 'week' ? filterActiveStyle : filterButtonStyle}
              onClick={() => setDateFilter('week')}
            >
              Minggu Ini
            </button>
            <button 
              style={dateFilter === 'month' ? filterActiveStyle : filterButtonStyle}
              onClick={() => setDateFilter('month')}
            >
              Bulan Ini
            </button>
          </div>

          <div style={statsCardStyle}>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Total Transaksi</span>
              <span style={statValueStyle}>{filteredTransactions.length}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Total Penjualan</span>
              <span style={statValueStyle}>{formatRupiah(totalPenjualan)}</span>
            </div>
            <div style={statItemStyle}>
              <span style={statLabelStyle}>Total Item</span>
              <span style={statValueStyle}>{totalItems}</span>
            </div>
          </div>
        </div>

        {/* Tabel Transaksi */}
        <div style={tableContainerStyle}>
          {loading ? (
            <div style={loadingStyle}>Memuat data transaksi...</div>
          ) : filteredTransactions.length === 0 ? (
            <div style={emptyStyle}>
              <p style={emptyTextStyle}>Tidak ada transaksi</p>
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Invoice</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Tanggal</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Item</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={tdStyle}>
                      <span style={invoiceStyle}>{tx.invoice}</span>
                    </td>
                    <td style={tdStyle}>{tx.customer}</td>
                    <td style={tdStyle}>{formatDate(tx.date)}</td>
                    <td style={tdStyle}>
                      <span style={priceStyle}>{formatRupiah(tx.total)}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={itemCountStyle}>
                        {tx.items ? tx.items.length : 1} item
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{...statusBadgeStyle, background: getStatusColor(tx.status)}}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button 
                        style={detailButtonStyle}
                        onClick={() => handleViewDetail(tx)}
                      >
                        Detail
                      </button>
                      {userRole === 'admin' && (
                        <button 
                          style={deleteButtonStyle}
                          onClick={() => {
                            if (window.confirm(`Hapus transaksi ${tx.invoice}?`)) {
                              // Implementasi hapus
                              alert('Fitur hapus dalam pengembangan');
                            }
                          }}
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Detail Transaksi */}
      {showDetail && selectedTransaction && (
        <div style={modalOverlayStyle} onClick={() => setShowDetail(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>📋 Detail Transaksi</h3>
              <button style={modalCloseStyle} onClick={() => setShowDetail(false)}>✕</button>
            </div>
            
            <div style={modalBodyStyle}>
              <div style={modalInfoGridStyle}>
                <div style={modalInfoItemStyle}>
                  <span style={modalInfoLabelStyle}>Invoice:</span>
                  <span style={modalInfoValueStyle}>{selectedTransaction.invoice}</span>
                </div>
                <div style={modalInfoItemStyle}>
                  <span style={modalInfoLabelStyle}>Customer:</span>
                  <span style={modalInfoValueStyle}>{selectedTransaction.customer}</span>
                </div>
                <div style={modalInfoItemStyle}>
                  <span style={modalInfoLabelStyle}>Tanggal:</span>
                  <span style={modalInfoValueStyle}>{formatDate(selectedTransaction.date)}</span>
                </div>
                <div style={modalInfoItemStyle}>
                  <span style={modalInfoLabelStyle}>Status:</span>
                  <span style={{...modalStatusStyle, background: getStatusColor(selectedTransaction.status)}}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              <h4 style={modalSubTitleStyle}>Item yang dibeli:</h4>
              
              <div style={modalItemsContainerStyle}>
                {selectedTransaction.items && selectedTransaction.items.length > 0 ? (
                  selectedTransaction.items.map((item, index) => (
                    <div key={index} style={modalItemCardStyle}>
                      <div style={modalItemHeaderStyle}>
                        <span style={modalItemNameStyle}>{item.product_name}</span>
                        <span style={modalItemQtyStyle}>{item.quantity} pcs</span>
                      </div>
                      <div style={modalItemPriceStyle}>
                        {formatRupiah(item.subtotal)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={modalEmptyItemsStyle}>
                    <p>Tidak ada detail item</p>
                  </div>
                )}
              </div>

              <div style={modalTotalStyle}>
                <span style={modalTotalLabelStyle}>Total:</span>
                <span style={modalTotalValueStyle}>{formatRupiah(selectedTransaction.total)}</span>
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
  fontWeight: "600",
};

const subtitleStyle = {
  fontSize: "16px",
  color: "#b48c9c",
  margin: 0,
};

const filterStatsContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "20px",
};

const filterContainerStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const filterButtonStyle = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid #ff69b4",
  background: "transparent",
  color: "#ff69b4",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s",
};

const filterActiveStyle = {
  ...filterButtonStyle,
  background: "#ff69b4",
  color: "white",
  border: "1px solid #ff69b4",
};

const statsCardStyle = {
  display: "flex",
  gap: "20px",
  background: "white",
  padding: "15px 25px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(255,182,193,0.2)",
  flexWrap: "wrap",
};

const statItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "100px",
};

const statLabelStyle = {
  fontSize: "12px",
  color: "#b48c9c",
  marginBottom: "5px",
};

const statValueStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ff69b4",
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
  fontSize: "14px",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #ffb6c1",
  color: "#333",
  fontSize: "14px",
};

const invoiceStyle = {
  fontFamily: "monospace",
  fontWeight: "500",
  color: "#ff69b4",
};

const priceStyle = {
  fontWeight: "600",
  color: "#333",
};

const itemCountStyle = {
  background: "#fff0f5",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "12px",
  color: "#ff69b4",
};

const statusBadgeStyle = {
  padding: "5px 12px",
  borderRadius: "20px",
  color: "white",
  fontSize: "12px",
  fontWeight: "500",
  display: "inline-block",
};

const detailButtonStyle = {
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "5px 12px",
  borderRadius: "8px",
  marginRight: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  transition: "all 0.3s",
};

const deleteButtonStyle = {
  background: "transparent",
  border: "2px solid #f44336",
  color: "#f44336",
  padding: "5px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  transition: "all 0.3s",
};

const loadingStyle = {
  padding: "60px",
  textAlign: "center",
  color: "#b48c9c",
  fontSize: "16px",
};

const emptyStyle = {
  padding: "60px",
  textAlign: "center",
};

const emptyTextStyle = {
  color: "#b48c9c",
  fontSize: "16px",
  marginBottom: "20px",
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
  boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 25px",
  borderBottom: "1px solid #ffb6c1",
};

const modalTitleStyle = {
  fontSize: "20px",
  color: "#8b5f6c",
  margin: 0,
  fontWeight: "600",
};

const modalCloseStyle = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#ff69b4",
};

const modalBodyStyle = {
  padding: "20px 25px",
  overflowY: "auto",
  maxHeight: "calc(80vh - 130px)",
};

const modalInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginBottom: "20px",
  background: "#fff0f5",
  padding: "15px",
  borderRadius: "12px",
};

const modalInfoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const modalInfoLabelStyle = {
  fontSize: "12px",
  color: "#b48c9c",
};

const modalInfoValueStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
};

const modalStatusStyle = {
  padding: "4px 10px",
  borderRadius: "20px",
  color: "white",
  fontSize: "12px",
  fontWeight: "500",
  display: "inline-block",
  width: "fit-content",
};

const modalSubTitleStyle = {
  fontSize: "16px",
  color: "#8b5f6c",
  margin: "0 0 15px 0",
};

const modalItemsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
  maxHeight: "250px",
  overflowY: "auto",
};

const modalItemCardStyle = {
  background: "#fff0f5",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ffb6c1",
};

const modalItemHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "5px",
};

const modalItemNameStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#8b5f6c",
};

const modalItemQtyStyle = {
  fontSize: "12px",
  color: "#ff69b4",
  background: "white",
  padding: "2px 8px",
  borderRadius: "12px",
};

const modalItemPriceStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
  textAlign: "right",
};

const modalEmptyItemsStyle = {
  padding: "20px",
  textAlign: "center",
  color: "#b48c9c",
};

const modalTotalStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  background: "linear-gradient(135deg, #fff0f5, #ffe4e1)",
  borderRadius: "12px",
  marginTop: "10px",
};

const modalTotalLabelStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#8b5f6c",
};

const modalTotalValueStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ff69b4",
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "20px 25px",
  borderTop: "1px solid #ffb6c1",
};

const modalButtonStyle = {
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "10px 30px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default Transactions;