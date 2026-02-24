import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "Admin";
  const name = location.state?.name || "User";

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notif, setNotif] = useState("");

  const tambahKeKeranjang = (produk) => {
    setCart((prev) => {
      const ada = prev.find((item) => item.id === produk.id);
      if (ada) {
        return prev.map((item) =>
          item.id === produk.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...produk, qty: 1 }];
    });

    setNotif(`${produk.nama} ditambahkan ke keranjang`);
    setTimeout(() => setNotif(""), 2000);
  };

  const beliSekarang = (produk) => {
  alert(
    `Membeli ${produk.nama}\nHarga: Rp ${produk.harga.toLocaleString()}`
  );
};


  // 🔽 TAMBAHAN (TIDAK MENGUBAH LOGIC LAMA)
  const tambahQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const kurangiQty = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  return (
    <div style={pageStyle}>
      {notif && <div style={notifStyle}>{notif}</div>}

      {/* HEADER */}
      <div style={headerStyle}>
        <h1 style={{ color: "black" }}>TOKO GERABAH CICIWW</h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={cartIcon} onClick={() => setShowCart(!showCart)}>
            🛒
            {cart.length > 0 && <span style={cartBadge}>{cart.length}</span>}
          </div>

          <button onClick={() => navigate("/")} style={logoutStyle}>
            Logout
          </button>
        </div>
      </div>

      {/* TEKS */}
      <div style={{ textAlign: "center", marginBottom: "40px", color: "black" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "400" }}>
          Selamat datang, <b>{name}</b>
        </h2>
        <p style={{ fontSize: "18px" }}>
          Anda login sebagai <b>{role}</b>
        </p>
      </div>

      {/* PRODUK */}
      <div style={gridStyle}>
        {produk.map((item) => (
          <div
            key={item.id}
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img src={item.image} style={imgStyle} alt={item.nama} />
            <h4>{item.nama}</h4>
            <p style={{ fontSize: "13px" }}>{item.deskripsi}</p>
            <b>Rp {item.harga.toLocaleString()}</b>

            <div style={btnGroup}>
              <button style={btnOutline} onClick={() => tambahKeKeranjang(item)}>
                + Keranjang
              </button>
              <button style={btnBlack} onClick={() => beliSekarang(item)}>
                Beli
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PANEL KERANJANG */}
      {showCart && (
        <div style={cartPanel}>
          <h3>Keranjang</h3>

          {cart.length === 0 ? (
            <p>Keranjang kosong</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={cartItem}>
                <span>{item.nama}</span>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button style={qtyBtn} onClick={() => kurangiQty(item.id)}>−</button>
                  <span style={qtyNumber}>{item.qty}</span>

                  <button style={qtyBtn} onClick={() => tambahQty(item.id)}>+</button>
                </div>

                <span>Rp {(item.harga * item.qty).toLocaleString()}</span>
              </div>
            ))
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              style={{
                flex: 1,
                background: "#000",
                color: "white",
                border: "none",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (cart.length === 0) {
                  alert("Keranjang kosong!");
                } else {
                  let daftar = cart.map(i => `${i.nama} x ${i.qty}`).join("\n");
                  let total = cart.reduce((sum, i) => sum + i.harga * i.qty, 0);
                  alert(`Membeli semua barang:\n${daftar}\n\nTotal: Rp ${total.toLocaleString()}`);
                  setCart([]);
                  setShowCart(false);
                }
              }}
            >
              Beli Semua
            </button>

            <button
              style={{
                flex: 1,
                background: "#555",
                color: "white",
                border: "none",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => setShowCart(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* DATA PRODUK */
const produk = [
  { id: 1, nama: "Vas Bunga Kecil", harga: 50000, deskripsi: "Vas kecil", image: "/produk/vas-bunga.jpg" },
  { id: 2, nama: "Piring Makan", harga: 30000, deskripsi: "Piring 8 inch", image: "/produk/piring.png" },
  { id: 3, nama: "Cangkir Kopi", harga: 25000, deskripsi: "Cangkir kopi", image: "/produk/cangkir.jpg" },
  { id: 4, nama: "Patung Buddha", harga: 150000, deskripsi: "Dekorasi", image: "/produk/patung buddha.jpg" },
  { id: 5, nama: "Tempat Lilin", harga: 45000, deskripsi: "Tempat lilin", image: "/produk/tempat lilin.jpg" },
  { id: 6, nama: "Mangkok Sup", harga: 35000, deskripsi: "Mangkok", image: "/produk/mangkuk sup.jpg" },
  { id: 7, nama: "Pot Kaktus", harga: 40000, deskripsi: "Pot kecil", image: "/produk/pot kaktus.jpg" },
  { id: 8, nama: "Hiasan Dinding", harga: 120000, deskripsi: "Hiasan", image: "/produk/hiasan dinding.webp" },
  { id: 9, nama: "Lampu Meja", harga: 200000, deskripsi: "Lampu Keramik", image: "/produk/lampu meja.jpg" },
  { id: 10, nama: "Asbak Mini", harga: 20000, deskripsi: "Asbak Mini", image: "/produk/asbak mini.jpg" },
];

/* STYLE */
const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  backgroundImage: "url('/bg-dashboard.webp')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "18px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.7)",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  transition: "transform 0.3s ease",
};

const imgStyle = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "12px",
};

const btnGroup = { display: "flex", gap: "8px", marginTop: "10px" };
const btnBlack = { flex: 1, background: "#000", color: "white", border: "none", padding: "8px", borderRadius: "8px" };
const btnOutline = { flex: 1, background: "rgba(255,255,255,0.3)", border: "1px solid #000", padding: "8px", borderRadius: "8px" };

const cartIcon = { position: "relative", fontSize: "22px", cursor: "pointer" };
const cartBadge = { position: "absolute", top: "-6px", right: "-10px", background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "12px" };

const cartPanel = {
  position: "fixed",
  top: "80px",
  right: "20px",
  width: "300px",
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
};

const cartItem = { display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" };

const qtyBtn = {
  width: "26px",
  height: "26px",
  borderRadius: "6px",
  border: "none",
  background: "#000",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  lineHeight: "1",
  padding: "0",
};

const qtyNumber = {
  minWidth: "18px",
  textAlign: "center",
  fontWeight: "600",
  lineHeight: "26px",
};



const notifStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#000",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
  zIndex: 9999,
};

const logoutStyle = { background: "#000", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px" };

export default Dashboard;
