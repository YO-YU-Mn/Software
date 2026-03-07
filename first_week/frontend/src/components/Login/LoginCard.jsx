
/*import { useNavigate } from "react-router-dom";

function LoginCard() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home_page");
  };

  return (
    <div className="login-card">
      <h2>System Login</h2>
      <p className="login-subtext">
        Enter your university credentials
      </p>

      <input type="text" placeholder="University ID" />
      <input type="password" placeholder="Password" />

      <button onClick={handleLogin}>
      Login
      </button>


      <p className="support-text">
        For account issues, contact IT Support
      </p>
    </div>
  );
}

export default LoginCard;
*/


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginCard() {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin() {
        const response = await fetch('http://localhost:9000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, password })
        });
        const data = await response.json();

        if(data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            
            // ✅ التعديل هنا بس
            if(data.role === 'admin') {
                window.location.href = 'http://localhost:5174';
            } else {
                navigate('/home_page');
            }
        } else {
            setError(data.message);
        }
    }

    return (
        <div className="login-card">
            <h2>System Login</h2>
            <p className="login-subtext">
                Enter your university credentials
            </p>

            <input
                type="text"
                placeholder="University ID"
                onChange={e => setCode(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
            />

            {error && <p style={{color: 'red'}}>{error}</p>}

            <button onClick={handleLogin}>Login</button>

            <p className="support-text">
                For account issues, contact IT Support
            </p>
        </div>
    );
}

export default LoginCard;