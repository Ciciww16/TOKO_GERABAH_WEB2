// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const navigate = useNavigate();
  const { login } = useCart();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotif(data.msg || "Login gagal");
        setShowNotif(true);
        setTimeout(() => setShowNotif(false), 3000);
        return;
      }

      login(data);

      setNotif(`Login berhasil! Selamat datang ${data.name}`);
      setShowNotif(true);

      setTimeout(() => {
        switch(data.role.toLowerCase()) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'cashier':
            navigate('/transactions');
            break;
          default:
            navigate('/produk');
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotif("Terjadi kesalahan server");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    }
  };

  return (
    <>
      {showNotif && (
        <div style={toastStyle}>
          <b>{notif}</b>
        </div>
      )}

      <div style={styles.bg}>
        <div style={styles.card}>
          <h2 style={styles.title}>SC Pottery Store 💕</h2>
          <p style={styles.subtitle}>Login to your account</p>

          <form id="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          <div style={linkContainerStyle}>
            <p style={textStyle}>
              Belum punya akun? <Link to="/register" style={linkStyle}>Daftar di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </>
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
    width: "320px",
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
  animation: "slideDown 0.3s ease",
};

const linkContainerStyle = {
  marginTop: "15px",
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
  cursor: "pointer",
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
  
  button:hover {
    transform: scale(1.02);
  }
  
  input:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255,105,180,0.1);
  }
`;
document.head.appendChild(style);

export default Login;