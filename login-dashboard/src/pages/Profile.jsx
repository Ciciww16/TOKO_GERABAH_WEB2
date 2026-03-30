// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/profile", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          currentPassword: "",
          newPassword: ""
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (response.ok) {
        alert('✅ Profil berhasil diupdate');
        setEditing(false);
        fetchProfile();
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/profile/password", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        alert('✅ Password berhasil diubah');
        setFormData({ ...formData, currentPassword: "", newPassword: "" });
      } else {
        const error = await response.json();
        alert(`❌ ${error.msg}`);
      }
    } catch (err) {
      console.error('Error changing password:', err);
    }
  };

  if (loading) return <div style={loadingStyle}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={titleStyle}>👤 Profil Saya</h1>
        
        <div style={profileCardStyle}>
          {!editing ? (
            <>
              <div style={profileInfoStyle}>
                <div style={infoRowStyle}>
                  <span style={labelStyle}>Nama:</span>
                  <span style={valueStyle}>{user?.name}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={labelStyle}>Email:</span>
                  <span style={valueStyle}>{user?.email}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={labelStyle}>Role:</span>
                  <span style={roleBadgeStyle(user?.role)}>
                    {user?.role}
                  </span>
                </div>
                <div style={infoRowStyle}>
                  <span style={labelStyle}>Member sejak:</span>
                  <span style={valueStyle}>
                    {new Date(user?.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
              <button style={editButtonStyle} onClick={() => setEditing(true)}>
                Edit Profil
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <h3 style={subTitleStyle}>Edit Profil</h3>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={buttonGroupStyle}>
                <button type="submit" style={saveButtonStyle}>
                  Simpan
                </button>
                <button 
                  type="button" 
                  style={cancelButtonStyle}
                  onClick={() => setEditing(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          <hr style={dividerStyle} />

          <h3 style={subTitleStyle}>Ubah Password</h3>
          <form onSubmit={handleChangePassword}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Password Lama</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                style={inputStyle}
                required
                minLength="6"
              />
            </div>
            <button type="submit" style={changePasswordButtonStyle}>
              Ubah Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Styles
const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffd1dc 0%, #ffe4e1 50%, #fff0f5 100%)",
  fontFamily: "'Poppins', sans-serif",
  padding: "100px 20px 40px 20px",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
};

const titleStyle = {
  fontSize: "32px",
  color: "#8b5f6c",
  marginBottom: "30px",
  textAlign: "center",
};

const profileCardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 10px 30px rgba(255,182,193,0.2)",
};

const profileInfoStyle = {
  marginBottom: "20px",
};

const infoRowStyle = {
  display: "flex",
  padding: "10px 0",
  borderBottom: "1px solid #ffb6c1",
};

const labelStyle = {
  width: "120px",
  fontSize: "14px",
  color: "#666",
  fontWeight: "500",
};

const valueStyle = {
  flex: 1,
  fontSize: "14px",
  color: "#333",
  fontWeight: "500",
};

const roleBadgeStyle = (role) => ({
  background: role === 'admin' ? '#ff69b4' : 
              role === 'cashier' ? '#4caf50' : '#2196f3',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-block',
});

const editButtonStyle = {
  width: "100%",
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "20px",
};

const subTitleStyle = {
  fontSize: "18px",
  color: "#8b5f6c",
  margin: "0 0 15px 0",
};

const formGroupStyle = {
  marginBottom: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ffb6c1",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const saveButtonStyle = {
  flex: 1,
  background: "linear-gradient(135deg, #ff69b4, #ff1493)",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const cancelButtonStyle = {
  flex: 1,
  background: "transparent",
  border: "2px solid #999",
  color: "#666",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const dividerStyle = {
  margin: "30px 0",
  border: "none",
  borderTop: "2px solid #ffb6c1",
};

const changePasswordButtonStyle = {
  width: "100%",
  background: "transparent",
  border: "2px solid #ff69b4",
  color: "#ff69b4",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "10px",
};

const loadingStyle = {
  textAlign: "center",
  padding: "50px",
  color: "#b48c9c",
};

export default Profile;