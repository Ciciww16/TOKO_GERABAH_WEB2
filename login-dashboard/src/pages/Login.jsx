import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notif, setNotif] = useState("");
  const [token, setToken] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const navigate = useNavigate();

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

      alert(`Login berhasil\n\nToken:\n${data.token.slice(0, 25)}...`);

      setToken(data.token);

      navigate("/dashboard", {
        state: {
          role: data.role,
          name: data.name,
          token: data.token,
        },
      });

    } catch (err) {
      console.error(err);
      setNotif("Terjadi kesalahan server");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    }
  };

  return (
    <>
      {/* TOAST ERROR */}
      {showNotif && (
        <div style={toastStyle}>
          <b>{notif}</b>
        </div>
      )}

      <div style={styles.bg}>
        <div style={styles.card}>
          <h2 style={styles.title}>Login SC Pottery Store💕</h2>

          <form onSubmit={handleLogin}>
            {/* NAME */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            {/* PASSWORD */}
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={eyeStyle}
              >
                {showPassword ? "❤️" : "💔"}
              </span>
            </div>

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* STYLE */
const styles = {
  bg: {
    height: "100vh",
    backgroundImage: "url('/login-bg.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: "30px",
    width: "280px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: {
    color: "#e84393",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    height: "40px",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #e843b475",
    boxSizing: "border-box", 
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#e843b475",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

const eyeStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  userSelect: "none",
};

const toastStyle = {
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#e74c3c",
  color: "white",
  padding: "14px 18px",
  borderRadius: "10px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  zIndex: 9999,
  fontSize: "14px",
  minWidth: "260px",
  textAlign: "center",
};

export default Login;
