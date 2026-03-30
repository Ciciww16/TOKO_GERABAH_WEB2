// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [riwayatPembelian, setRiwayatPembelian] = useState([]);
  const [returItems, setReturItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    pengunjungOnline: 0,
    cartAktif: 0,
    penjualan: 0,
    retur: 0,
    abandonedCarts: 0,
    produkHabis: 0,
    pesanBaru: 0,
    reviewProduk: 0,
    totalPenjualan: 0,
    nilaiKeranjang: 0,
    kunjungan: 0,
    rateKonversi: 0,
    pendapatanBersih: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    if (token && name && role) {
      setUser({ id: userId, name, role, token });
      fetchUserTransactions(userId, token);
    }
  }, []);

  const fetchUserTransactions = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:5000/transactions/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRiwayatPembelian(data);
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat transaksi:', err);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userId', userData.id);
    fetchUserTransactions(userData.id, userData.token);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setRiwayatPembelian([]);
    setReturItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  const tambahKeKeranjang = (produk) => {
    setCart(prev => {
      const ada = prev.find(item => item.id === produk.id);
      if (ada) {
        return prev.map(item =>
          item.id === produk.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...produk, qty: 1 }];
    });
  };

  const beliSekarang = async (produk) => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    if (produk.stock < 1) {
      alert('Stok produk habis');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          total: produk.harga,
          items: [{
            product_id: produk.id,
            quantity: 1,
            subtotal: produk.harga
          }]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Gagal checkout');
      }
      
      produk.stock -= 1;
      
      const itemBeli = {
        id: data.transaction_id,
        invoice: data.invoice,
        ...produk,
        qty: 1,
        tanggal: new Date().toLocaleDateString('id-ID'),
        status: 'Selesai',
        userId
      };
      
      setRiwayatPembelian(prev => [itemBeli, ...prev]);
      
      alert(`✅ Berhasil membeli ${produk.nama}\nInvoice: ${data.invoice}`);
      
    } catch (err) {
      console.error('Error:', err);
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang belanja kosong');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        subtotal: item.harga * item.qty
      }));
      
      const total = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
      
      const response = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          total,
          items
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Gagal checkout');
      }
      
      const itemsBeli = cart.map(item => ({
        id: data.transaction_id,
        invoice: data.invoice,
        ...item,
        tanggal: new Date().toLocaleDateString('id-ID'),
        status: 'Selesai',
        userId
      }));
      
      setRiwayatPembelian(prev => [...itemsBeli, ...prev]);
      setCart([]);
      
      alert(`✅ Checkout berhasil!\nInvoice: ${data.invoice}`);
      
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const kurangQty = (id) => {
    setCart(prev =>
      prev
        .map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item)
        .filter(item => item.qty > 0)
    );
  };

  const tambahQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const returBarang = (item) => {
    setReturItems(prev => [{
      ...item,
      tanggalRetur: new Date().toLocaleDateString('id-ID'),
      status: 'Diproses'
    }, ...prev]);
    
    setRiwayatPembelian(prev => 
      prev.filter(i => i.id !== item.id || i.invoice !== item.invoice)
    );
    
    alert(`🔄 Retur untuk ${item.nama} sedang diproses`);
  };

  return (
    <CartContext.Provider value={{
      cart,
      riwayatPembelian,
      returItems,
      stats,
      user,
      loading,
      login,
      logout,
      tambahKeKeranjang,
      beliSekarang,
      kurangQty,
      tambahQty,
      checkout,
      returBarang,
    }}>
      {children}
    </CartContext.Provider>
  );
};