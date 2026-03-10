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

  /* STATE TAMBAHAN */
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
    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${darkMode ? bgDark : bgLight})`
  }}
>


      
      {notif && <div style={notifStyle}>{notif}</div>}

      {/* HEADER */}
      <div style={headerStyle}>
        <h1 style={{ color: darkMode ? "white" : "#222" }}>TOKO GERABAH CICIWW</h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>

          <button
            onClick={()=>setDarkMode(!darkMode)}
            style={darkBtn}
          >
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

      {/* TEKS */}
      <div style={{ textAlign: "center", marginBottom: "40px", color: darkMode ? "white" : "black" }}>
        <h2 style={{ fontSize: "34px", fontWeight: "400" }}>
          Selamat datang, <b>{name}</b>
        </h2>
        <p style={{ fontSize: "18px" }}>
          Anda login sebagai <b>{role}</b>
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{marginBottom:"20px", display:"flex", gap:"10px"}}>
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
    >
        <option value="all">Semua Harga</option>
        <option value="50">&lt; 50rb</option>
        <option value="100">50rb - 100rb</option>
        <option value="101">&gt; 100rb</option>
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
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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

      {/* CART PANEL */}
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

          <h4>Total: Rp {totalHarga.toLocaleString()}</h4>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              style={btnBlack}
              onClick={()=>{
                if(cart.length===0){
                  alert("Keranjang kosong!");
                }else{
                  setShowCheckout(true);
                }
              }}
            >
              Checkout
            </button>

            <button style={btnOutline} onClick={() => setShowCart(false)}>
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* POPUP CHECKOUT */}

      {showCheckout && (
        <div style={checkoutBg}>
          <div style={checkoutBox}>

            <h2>Checkout</h2>

            {cart.map(i=>(
              <p key={i.id}>{i.nama} x {i.qty}</p>
            ))}

            <h3>Total: Rp {totalHarga.toLocaleString()}</h3>

            <button
              style={btnBlack}
              onClick={()=>{
                alert("Pembayaran berhasil!");
                setCart([]);
                setShowCheckout(false);
              }}
            >
              Bayar
            </button>

            <button
              style={btnOutline}
              onClick={()=>setShowCheckout(false)}
            >
              Batal
            </button>

          </div>
        </div>
      )}

      {/* FOOTER */}
<div style={{
  marginTop: "50px",
  padding: "40px",
  background: darkMode ? "#111" : "#f2f2f2",
  color: darkMode ? "white" : "#222",
  borderRadius: "12px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px"
}}>

  {/* ABOUT */}
  <div>
    <h3>Toko Gerabah Ciciww</h3>
    <p style={{ fontSize: "14px" }}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad alias impedit est deserunt exercitationem pariatur ipsam harum magni culpa commodi?
    </p>
    <p style={{ fontSize: "14px", marginTop:"8px" }}>📞 +62 123-4567-8912</p>
    <p style={{ fontSize: "14px" }}>✉ person-email@gmail.com</p>
  </div>

  {/* MENU */}
  <div>
    <h4>Menu</h4>
    <ul style={{ listStyle: "none", padding:0, margin:0, fontSize:"14px" }}>
      <li>Home</li>
      <li>Kelas</li>
      <li>Testimonial</li>
      <li>FAQ</li>
      <li>Syarat & Ketentuan</li>
    </ul>
  </div>

  {/* SUBSCRIBE */}
  <div>
    <h4>Subscribe untuk info Menarik</h4>
    <div style={{ marginTop:"8px" }}>
      <input
        type="email"
        placeholder="Subscribe..."
        style={{ padding:"8px", borderRadius:"8px", border:"1px solid #ccc", width:"100%", marginBottom:"8px" }}
      />
      <button
        style={{ padding:"8px 16px", borderRadius:"8px", border:"none", background:"#ffff", color:"white", width:"100%" }}
        onClick={() => alert("Terima kasih sudah subscribe!")}
      >
        Subscribe
      </button>
    </div>
  </div>

  {/* COPYRIGHT */}
  <div style={{ gridColumn:"1/-1", textAlign:"center", marginTop:"20px", fontSize:"12px", opacity:0.7 }}>
    © Copyright 2026 by Suci Disakiti, All Right Reserved
  </div>
</div>

{/* NAVBAR DI ATAS */}
<div style={{
  display: "flex",
  justifyContent: "center",
  gap: "24px",
  padding: "12px 0",
  background: darkMode ? "#111" : "#fff",
  color: darkMode ? "white" : "#222",
  position: "sticky",
  top: 0,
  zIndex: 999,
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px"
}}>
  <span style={{ cursor:"pointer" }} onClick={()=>window.scrollTo({top:0, behavior:"smooth"})}>Home</span>
  <span style={{ cursor:"pointer" }} onClick={()=>alert("Menu Kelas")}>Kelas</span>
  <span style={{ cursor:"pointer" }} onClick={()=>alert("Menu Testimonial")}>Testimonial</span>
  <span style={{ cursor:"pointer" }} onClick={()=>alert("Menu FAQ")}>FAQ</span>
  <span style={{ cursor:"pointer" }} onClick={()=>alert("Syarat & Ketentuan")}>Syarat & Ketentuan</span>
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



const bgLight =  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=2560"; 
const bgDark =   "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1920";




const headerStyle={
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center"
};

const gridStyle={
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:"18px"
};

const cardStyle={
  position:"relative",
  background:"rgba(255,255,255,0.3)",
  backdropFilter:"blur(8px)",
  padding:"16px",
  borderRadius:"14px",
  boxShadow:"0 8px 20px rgba(0,0,0,0.25)",
  transition:"transform 0.3s ease"
};


const imgStyle={
  width:"100%",
  height:"220px",
  objectFit:"cover",
  borderRadius:"12px"
};

const btnGroup={
  display:"flex",
  gap:"8px",
  marginTop:"10px"
};

const btnBlack={
  flex:1,background:"#000",
  color:"white"
  ,border:"none",
  padding:"8px",
  borderRadius:"8px"
};

const btnOutline={
  flex:1,
  background:"rgba(255,255,255,0.3)",
  border:"1px solid #000",
  padding:"8px",
  borderRadius:"8px"
};

const searchInput={
  padding:"8px",
  borderRadius:"8px",
  border:"1px solid #ccc"
};

const cartIcon={
  position:"relative",
  fontSize:"22px",
  cursor:"pointer"
};

const cartBadge={
  position:"absolute",
  top:"-6px",
  right:"-10px",
  background:"red",
  color:"white",
  borderRadius:"50%",
  padding:"2px 6px",
  fontSize:"12px"
};

const cartPanel={
  position:"fixed",
  top:"80px",
  right:"20px",
  width:"300px",
  background:"white",
  padding:"16px",
  borderRadius:"12px",
  boxShadow:"0 10px 30px rgba(0,0,0,0.3)"
};

const cartItem={
  display:"flex",
  justifyContent:"space-between",
  marginBottom:"8px",
  alignItems:"center"
};

const qtyBtn={
  width:"26px",
  height:"26px",
  borderRadius:"6px",
  border:"none",
  background:"#000",
  color:"white",
  cursor:"pointer"
};

const qtyNumber={
  minWidth:"18px",
  textAlign:"center"
};

const notifStyle={
  position:"fixed",
  top:"20px",
  right:"20px",
  background:"#000",
  color:"white",
  padding:"10px 16px",
  borderRadius:"10px",
  zIndex:9999
};


const logoutStyle={
  background:"#000",
  color:"white",
  border:"none",
  padding:"8px 16px",
  borderRadius:"8px"
};

const darkBtn={
  background:"#000",
  color:"white",
  border:"none",
  padding:"8px",
  borderRadius:"8px"
};



const checkoutBg={
  position:"fixed",
  top:0,
  left:0,
  width:"100%",
  height:"100%",
  background:"rgba(0,0,0,0.5)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
};

const checkoutBox={
  background:"white",
  padding:"30px",
  borderRadius:"12px"
};

export default Dashboard;
