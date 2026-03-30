// src/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeMenu, setActiveMenu] = useState("");
  const [user, setUser] = useState({ name: "User", role: "customer" });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Ambil data user dari localStorage
  useEffect(() => {
    const name = localStorage.getItem("name") || "User";
    const role = localStorage.getItem("role") || "customer";
    setUser({ name, role });
  }, [location]);

  // Set active menu berdasarkan path URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") setActiveMenu("dashboard");
    else if (path === "/produk") setActiveMenu("produk");
    else if (path === "/kategori") setActiveMenu("kategori");
    else if (path === "/admin/categories") setActiveMenu("kategori");
    else if (path === "/admin/products") setActiveMenu("produk");
    else if (path === "/pesanan") setActiveMenu("pesanan");
    else if (path === "/transactions") setActiveMenu("transaksi");
    else if (path === "/laporan") setActiveMenu("laporan");
    else if (path === "/pengaturan") setActiveMenu("pengaturan");
    else if (path === "/users") setActiveMenu("users");
    else if (path === "/admin/users") setActiveMenu("users");
    else if (path === "/profile") setActiveMenu("profile");
  }, [location]);

  // Effect untuk navbar muncul/sembunyi saat scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleMenuClick = (menu, path) => {
    setActiveMenu(menu);
    setShowMobileMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setUser({ name: "User", role: "customer" });
    navigate("/");
  };

  // ========== GET ROLE BADGE COLOR ==========
  const getRoleBadgeColor = () => {
    switch(user.role.toLowerCase()) {
      case 'admin':
        return { bg: '#ff69b4', color: 'white' };
      case 'cashier':
        return { bg: '#4caf50', color: 'white' };
      case 'customer':
      default:
        return { bg: '#2196f3', color: 'white' };
    }
  };

  const roleBadge = getRoleBadgeColor();

  return (
    <>
      <div style={{
        ...navbarStyle,
        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }}>
        <div style={navContainerStyle}>
          {/* Bagian Kiri - Logo */}
          <div style={navLeftStyle}>
            <div style={logoContainerStyle} onClick={() => navigate('/')}>
              <div style={logoMainContainerStyle}>
                <span style={logoMainStyle}>SC</span>
                <span style={logoSpanStyle}>POTTERY</span>
              </div>
              <span style={logoTaglineStyle}>handcrafted ceramic</span>
            </div>
          </div>
          
          {/* Bagian Tengah - Menu Desktop */}
          <div style={navMenuStyle}>
            {/* Menu untuk semua user */}
            <span 
              style={activeMenu === 'produk' ? navItemActiveStyle : navItemStyle}
              onClick={() => handleMenuClick('produk', '/produk')}
            >
              🛍️ Produk
            </span>
            <span 
              style={activeMenu === 'kategori' ? navItemActiveStyle : navItemStyle}
              onClick={() => handleMenuClick('kategori', '/kategori')}
            >
              📋 Kategori
            </span>
            <span 
              style={activeMenu === 'pesanan' ? navItemActiveStyle : navItemStyle}
              onClick={() => handleMenuClick('pesanan', '/pesanan')}
            >
              📦 Pesanan
            </span>
            <span 
              style={activeMenu === 'profile' ? navItemActiveStyle : navItemStyle}
              onClick={() => handleMenuClick('profile', '/profile')}
            >
              👤 Profile
            </span>
            
            {/* Menu khusus admin */}
            {user?.role === 'admin' && (
              <>
                <span 
                  style={activeMenu === 'dashboard' ? navItemActiveStyle : navItemStyle}
                  onClick={() => handleMenuClick('dashboard', '/dashboard')}
                >
                  📊 Dashboard
                </span>
                <span 
                  style={activeMenu === 'transaksi' ? navItemActiveStyle : navItemStyle}
                  onClick={() => handleMenuClick('transaksi', '/transactions')}
                >
                  💳 Transaksi
                </span>
                <span 
                  style={activeMenu === 'users' ? navItemActiveStyle : navItemStyle}
                  onClick={() => handleMenuClick('users', '/admin/users')}
                >
                  👥 Users
                </span>
                <span 
                  style={activeMenu === 'laporan' ? navItemActiveStyle : navItemStyle}
                  onClick={() => handleMenuClick('laporan', '/laporan')}
                >
                  📈 Laporan
                </span>
              </>
            )}
            
            {/* Menu khusus cashier */}
            {user?.role === 'cashier' && (
              <span 
                style={activeMenu === 'transaksi' ? navItemActiveStyle : navItemStyle}
                onClick={() => handleMenuClick('transaksi', '/transactions')}
              >
                💳 Transaksi
              </span>
            )}
          </div>

          {/* Bagian Kanan - User Info & Logout */}
          <div style={navRightStyle}>
            <div style={userInfoStyle}>
              <span style={userNameStyle}>{user.name}</span>
              <span style={{
                ...userRoleStyle,
                background: roleBadge.bg,
                color: roleBadge.color
              }}>
                {user.role}
              </span>
            </div>
            <button style={logoutStyle} onClick={handleLogout}>
              Logout
            </button>
            
            {/* Mobile Menu Button */}
            <div style={mobileMenuButtonStyle} onClick={() => setShowMobileMenu(!showMobileMenu)}>
              ☰
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div style={mobileMenuStyle}>
          <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('produk', '/produk')}>
            🛍️ Produk
          </div>
          <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('kategori', '/kategori')}>
            📋 Kategori
          </div>
          <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('pesanan', '/pesanan')}>
            📦 Pesanan
          </div>
          <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('profile', '/profile')}>
            👤 Profile
          </div>
          
          {user?.role === 'admin' && (
            <>
              <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('dashboard', '/dashboard')}>
                📊 Dashboard
              </div>
              <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('transaksi', '/transactions')}>
                💳 Transaksi
              </div>
              <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('users', '/admin/users')}>
                👥 Users
              </div>
              <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('laporan', '/laporan')}>
                📈 Laporan
              </div>
            </>
          )}
          
          {user?.role === 'cashier' && (
            <div style={mobileMenuItemStyle} onClick={() => handleMenuClick('transaksi', '/transactions')}>
              💳 Transaksi
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ========== STYLE UNTUK NAVBAR ========== */

// Navbar Style
const navbarStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(255, 182, 193, 0.3)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  padding: "0 30px",
  borderBottom: "2px solid rgba(255, 182, 193, 0.3)",
};

// Container
const navContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "80px",
  maxWidth: "1400px",
  margin: "0 auto",
};

// ========== STYLE LOGO ==========
const navLeftStyle = {
  display: "flex",
  alignItems: "center",
  minWidth: "180px",
  cursor: "pointer",
};

const logoContainerStyle = {
  display: "flex",
  flexDirection: "column",
  lineHeight: "1.2",
  borderLeft: "3px solid #ff69b4",
  paddingLeft: "12px",
};

const logoMainContainerStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: "5px",
};

const logoMainStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#8b5f6c",
  letterSpacing: "1px",
};

const logoSpanStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#ff69b4",
  letterSpacing: "2px",
};

const logoTaglineStyle = {
  fontSize: "11px",
  color: "#b48c9c",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginTop: "2px",
};

// Bagian Tengah - Menu Desktop
const navMenuStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const navItemStyle = {
  cursor: "pointer",
  padding: "8px 16px",
  color: "#b48c9c",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  whiteSpace: "nowrap",
};

const navItemActiveStyle = {
  ...navItemStyle,
  color: "#fff",
  fontWeight: "600",
  background: "linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%)",
  boxShadow: "0 4px 10px rgba(255, 105, 180, 0.3)",
};

// Bagian Kanan
const navRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  minWidth: "180px",
  justifyContent: "flex-end",
};

const userInfoStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  lineHeight: "1.3",
};

const userNameStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#ff69b4",
};

const userRoleStyle = {
  fontSize: "11px",
  padding: "3px 10px",
  borderRadius: "20px",
  textTransform: "capitalize",
  marginTop: "2px",
};

const logoutStyle = {
  background: "linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%)",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "25px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  boxShadow: "0 4px 15px rgba(255, 105, 180, 0.3)",
  transition: "all 0.3s",
  whiteSpace: "nowrap",
};

// Mobile Menu Button
const mobileMenuButtonStyle = {
  display: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#ff69b4",
  marginLeft: "10px",
};

// Mobile Menu
const mobileMenuStyle = {
  position: "fixed",
  top: "80px",
  left: 0,
  right: 0,
  background: "white",
  boxShadow: "0 4px 20px rgba(255, 182, 193, 0.3)",
  zIndex: 999,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  animation: "slideDown 0.3s ease",
};

const mobileMenuItemStyle = {
  padding: "12px 20px",
  background: "#fff0f5",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "500",
  color: "#8b5f6c",
  transition: "all 0.3s",
};

// Responsive Design
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
    .mobile-menu-button {
      display: block;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default Navbar;