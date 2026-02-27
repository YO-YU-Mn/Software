import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMessage(''); 
    setLoading(true);

    try {
      const response = await fetch('http://localhost:7000/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
    
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'حدث خطأ في تسجيل الدخول');
      }
    } catch (error) {
      setErrorMessage('مشكلة في الاتصال بالسيرفر، اتأكد إن الباك إند شغال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f6f8' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}> تسجيل الدخول</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
          ادخل بريدك الإلكتروني وكلمة المرور
        </p>
        
        {errorMessage && (
          <div style={{ color: '#d32f2f', marginBottom: '15px', textAlign: 'center', backgroundColor: '#ffebee', padding: '12px', borderRadius: '5px', fontSize: '14px' }}>
             {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@test.com"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              padding: '12px', 
              backgroundColor: loading ? '#ccc' : '#0d6efd', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '16px', 
              marginTop: '10px',
              fontWeight: 'bold'
            }}
          >
            {loading ? ' جاري التحميل...' : ' دخول'}
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default Login;