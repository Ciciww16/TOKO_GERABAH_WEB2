function ProductCard({ produk }) {
  return (
    <div style={cardStyle}>
      <img src={produk.image} alt={produk.nama} style={imageStyle} />

      <h4 style={namaStyle}>{produk.nama}</h4>
      <p style={descStyle}>{produk.deskripsi}</p>

      <p style={hargaStyle}>
        Rp {produk.harga.toLocaleString("id-ID")}
      </p>

      <small style={stokStyle}>Stok: {produk.stok}</small>

      <div style={buttonWrap}>
        <button style={cartBtn}>Keranjang</button>
        <button style={buyBtn}>Beli</button>
      </div>
    </div>
  );
}

/* ================= STYLE DI SINI ================= */

const cardStyle = {
  backgroundColor: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(8px)",
  borderRadius: "20px",
  padding: "18px",
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "14px",
};

const namaStyle = { fontSize: "17px" };
const descStyle = { fontSize: "13px" };
const hargaStyle = { fontWeight: "bold" };
const stokStyle = { fontSize: "12px" };

const buttonWrap = { display: "flex", gap: "8px", marginTop: "12px" };

const cartBtn = {
  flex: 1,
  padding: "6px",
  borderRadius: "8px",
};

const buyBtn = {
  flex: 1,
  padding: "6px",
  borderRadius: "8px",
  backgroundColor: "black",
  color: "white",
};

export default ProductCard;
