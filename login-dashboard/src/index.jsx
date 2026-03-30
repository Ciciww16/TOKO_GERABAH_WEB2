// login-dashboard/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Membuat root element dari div dengan id="root" di public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render aplikasi React ke dalam root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================
// OPTIONAL: Report Web Vitals (untuk performance)
// ============================================
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);

// ============================================
// OPTIONAL: Service Worker untuk PWA
// ============================================
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('Service Worker registered: ', registration);
//       })
//       .catch(error => {
//         console.log('Service Worker registration failed: ', error);
//       });
//   });
// }