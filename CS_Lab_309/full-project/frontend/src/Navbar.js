import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // فحص أول مرة
    checkLoginStatus();

    // راقب تغيرات localStorage (polling كل 500ms)
    const interval = setInterval(checkLoginStatus, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px 20px',
      marginBottom: '20px',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {!isLoggedIn ? (
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', backgroundColor: '#ff6b6b', padding: '8px 12px', borderRadius: '4px' }}>
             تسجيل الدخول
          </Link>
        ) : (
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', backgroundColor: '#4CAF50', padding: '8px 12px', borderRadius: '4px' }}>
             Dashboard
          </Link>
        )}
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>🏠 Home</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>ℹ️ About</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>📧 Contact</Link>
      </div>
      {isLoggedIn && (
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          🚪 Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
