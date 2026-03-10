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

  const [search, setSearch] = useState("");
  const [filterHarga, setFilterHarga] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalHarga = cart.reduce((total, item) => total + item.harga * item.qty, 0);

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
    alert(`Membeli ${produk.nama}\nHarga: Rp ${produk.harga.toLocaleString()}`);
  };

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
    <div
  style={{
    ...pageStyle,
    backgroundImage: "url('/bg.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
  }}
>




      {notif && <div style={notifStyle}>{notif}</div>}

      {/* NAVBAR */}
      <div style={navbarStyle}>
        <span style={{ cursor:"pointer" }} onClick={()=>navigate("/")}>Home</span>
        <span style={{ cursor:"pointer" }} onClick={()=>navigate("/menu")}>Menu</span>
        <span style={{ cursor:"pointer" }} onClick={()=>navigate("/testimonial")}>Testimonial</span>
        <span style={{ cursor:"pointer" }} onClick={()=>navigate("/faq")}>FAQ</span>
        <span style={{ cursor:"pointer" }} onClick={()=>navigate("/syarat")}>Syarat & Ketentuan</span>
      </div>

      {/* HEADER TOKO */}
      <div style={headerStyle}>

        <div>
          <h2 style={{ margin:0, color: darkMode ? "white" : "#222" }}>
            SC POTTERY STORE
          </h2>

          <p style={{
            margin:0,
            fontSize:"14px",
            color: darkMode ? "#ddd" : "#444"
          }}>
            Selamat datang, <b>{name}</b>
          </p>

          <p style={{
            margin:0,
            fontSize:"13px",
            color: darkMode ? "#bbb" : "#666"
          }}>
            Kamu login sebagai <b>{role}</b>
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button onClick={()=>setDarkMode(!darkMode)} style={darkBtn}>
            {darkMode ? "☀" : "🌙"}
          </button>

          <div style={cartIcon} onClick={() => setShowCart(!showCart)}>
            🛒
            {cart.length > 0 && <span style={cartBadge}>{cart.length}</span>}
          </div>

          <button onClick={() => navigate("/")} style={logoutStyle}>
            Logout
          </button>
        </div>
      </div>

      {/* HERO TEXT */}
      <div style={{
        textAlign: "center",
        marginTop: "40px",
        marginBottom: "30px",
        color: "white"
      }}>
        <h1 style={{ fontSize:"36px", marginBottom:"10px" }}>
          Selamat Datang di SC Pottery Store!
        </h1>

        <p style={{ fontSize:"18px" }}>
          Temukan gerabah terbaru dengan harga terjangkau
        </p>
      </div>

      {/* SEARCH + KATEGORI */}
      <div style={{
        marginBottom:"30px",
        display:"flex",
        justifyContent:"center",
        gap:"10px"
      }}>

        <input
          type="text"
          placeholder="🔍 Cari produk..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          style={searchInput}
        />

        <select
          value={filterHarga}
          onChange={(e) => setFilterHarga(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Kategori Produk</option>
          <option value="50">Gerabah Murah</option>
          <option value="100">Gerabah Sedang</option>
          <option value="101">Gerabah Premium</option>
        </select>

      </div>

      {/* PRODUK */}
      <div style={gridStyle}>
        {produk
        .filter(p=>p.nama.toLowerCase().includes(search.toLowerCase()))
        .filter((p)=>{
          if(filterHarga==="50") return p.harga < 50000
          if(filterHarga==="100") return p.harga >=50000 && p.harga<=100000
          if(filterHarga==="101") return p.harga >100000
          return true
        })
        .map((item) => (
          <div
            key={item.id}
            style={cardStyle}
          >
            <img src={item.image} style={imgStyle} alt={item.nama} />
            <h4>{item.nama}</h4>
            <div style={{color:"#ff9800"}}>⭐⭐⭐⭐☆</div>
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

    </div>
  );
}

/* DATA PRODUK */
const produk = [
  { id:1, nama:"Vas Bunga Kecil", harga:50000, deskripsi:"Vas kecil", image:"/produk/vas kecil.avif"},
  { id:2, nama:"Piring Makan", harga:30000, deskripsi:"Piring 8 inch", image:"/produk/piringg.jpg"},
  { id:3, nama:"Cangkir Kopi", harga:25000, deskripsi:"Cangkir kopi", image:"/produk/cangkir.jpeg"},
  { id:4, nama:"Guci Bunga", harga:150000, deskripsi:"Dekorasi", image:"/produk/guci.jpg"},
  { id:5, nama:"Tempat Lilin", harga:45000, deskripsi:"Tempat lilin", image:"/produk/tempat lilinn.avif"},
  { id:6, nama:"Mangkok Sup", harga:35000, deskripsi:"Mangkok", image:"/produk/mangkuk.jpg"},
  { id:7, nama:"Pot Kaktus", harga:40000, deskripsi:"Pot kecil", image:"/produk/pot kktus.jpg"},
  { id:8, nama:"Hiasan Dinding", harga:120000, deskripsi:"Hiasan", image:"/produk/hiasan dinding.webp"},
  { id:9, nama:"Lampu Meja", harga:200000, deskripsi:"Lampu Keramik", image:"/produk/lampuu.jpg"},
  { id:10, nama:"Asbak Mini", harga:20000, deskripsi:"Asbak Mini", image:"/produk/asbak.webp"},
  { id:11, nama:"Teko Keramik", harga:90000, deskripsi:"Teko minum keramik", image:"/produk/teko.jpeg"},
  { id:12, nama:"Celengan Keramik", harga:60000, deskripsi:"Celengan unik", image:"/produk/celengan.avif"}
];

/* STYLE */
const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed"
};


const navbarStyle={
  display:"flex",
  justifyContent:"center",
  gap:"24px",
  padding:"12px 0",
  background:"rgba(255,255,255,0.3)",
  color:"#222",
  position:"sticky",
  top:0,
  zIndex:999,
  backdropFilter:"blur(10px)"
};

const headerStyle={ display:"flex", justifyContent:"space-between", alignItems:"center" };

const gridStyle={ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"18px" };

const cardStyle={
  background:"rgba(255,255,255,0.3)",
  backdropFilter:"blur(8px)",
  padding:"16px",
  borderRadius:"14px",
  boxShadow:"0 8px 20px rgba(0,0,0,0.25)"
};

const imgStyle={ width:"100%", height:"220px", objectFit:"cover", borderRadius:"12px" };

const btnGroup={ display:"flex", gap:"8px", marginTop:"10px" };

const btnBlack={ flex:1, background:"#000", color:"white", border:"none", padding:"8px", borderRadius:"8px" };

const btnOutline={ flex:1, background:"rgba(255,255,255,0.3)", border:"1px solid #000", padding:"8px", borderRadius:"8px" };

const searchInput={ padding:"10px", borderRadius:"8px", border:"1px solid #ccc", width:"260px" };

const selectStyle={ padding:"10px", borderRadius:"8px", border:"1px solid #ccc" };

const cartIcon={ position:"relative", fontSize:"22px", cursor:"pointer" };

const cartBadge={ position:"absolute", top:"-6px", right:"-10px", background:"red", color:"white", borderRadius:"50%", padding:"2px 6px", fontSize:"12px" };

const notifStyle={ position:"fixed", top:"20px", right:"20px", background:"#000", color:"white", padding:"10px 16px", borderRadius:"10px", zIndex:9999 };

const logoutStyle={ background:"#000", color:"white", border:"none", padding:"8px 16px", borderRadius:"8px" };

const darkBtn={ background:"#000", color:"white", border:"none", padding:"8px", borderRadius:"8px" };

export default Dashboard;
