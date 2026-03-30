// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setNotif("Password dan konfirmasi password tidak cocok");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      return;
    }

    if (password.length < 6) {
      setNotif("Password minimal 6 karakter");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Registrasi gagal");
      }

      setNotif("Registrasi berhasil! Silakan login.");
      setShowNotif(true);
      
      setTimeout(() => {
        setShowNotif(false);
        navigate("/");
      }, 2000);

    } catch (err) {
      setNotif(err.message);
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      {showNotif && (
        <div style={toastStyle}>
          <b>{notif}</b>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>SC Pottery Store</h2>
        <p style={styles.subtitle}>Buat akun baru</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={eyeStyle}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div style={linkContainerStyle}>
          <p style={textStyle}>
            Sudah punya akun? <Link to="/" style={linkStyle}>Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px 30px",
    width: "350px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    color: "#ff69b4",
    marginBottom: "5px",
    fontSize: "24px",
    fontWeight: "600",
  },
  subtitle: {
    color: "#b48c9c",
    marginBottom: "25px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    height: "45px",
    padding: "0 15px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #ffb6c1",
    boxSizing: "border-box",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    height: "45px",
    backgroundColor: "#ff69b4",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "5px",
  },
};

const eyeStyle = {
  position: "absolute",
  right: "15px",
  top: "38%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "18px",
  color: "#ff69b4",
};

const toastStyle = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  padding: "14px 24px",
  borderRadius: "50px",
  zIndex: 9999,
  fontSize: "14px",
  boxShadow: "0 10px 30px rgba(255,105,180,0.4)",
};

const linkContainerStyle = {
  marginTop: "20px",
};

const textStyle = {
  color: "#b48c9c",
  fontSize: "14px",
  margin: 0,
};

const linkStyle = {
  color: "#ff69b4",
  textDecoration: "none",
  fontWeight: "600",
};

export default Register;