import { useState,useRef  } from 'react';
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
            
            
            if(data.role === 'admin') {
                window.location.href = 'http://localhost:5173';
            } else {
                navigate('/home_page'); 
            }
        } 
        else {
            setError(data.message);
        }
    }

    //keyboard
    const codeRef = useRef(null);
    const passwordRef = useRef(null);
    const loginButtonRef = useRef(null)


    // دالة للتعامل مع ضغطات الكيبورد
    const handleKeyDown = (e, field) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault(); 
            if (field === 'code') {
                
                passwordRef.current.focus();
            } else if (field === 'password') {
                
                loginButtonRef.current.focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin(); 
        }
        else if(e.key==='ArrowUp'){
           e.preventDefault();
            if (field === 'password') {
               
                codeRef.current.focus();
            } else if (field === 'button') {
               
                passwordRef.current.focus();
            }
        }
    };


    return (
        <div className="login-card">
            <h2>System Login</h2>
            <p className="login-subtext">
                Enter your university credentials
            </p>

            <input
                ref={codeRef}
                type="text"
                placeholder="University ID"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'code')}
            />
            <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'password')}
            />

            {error && <p style={{color: 'red'}}>{error}</p>}

            <button
                ref={loginButtonRef}
                onClick={handleLogin}
                onKeyDown={e => handleKeyDown(e, 'button')} 
            >
                Login
            </button>
           
        </div>
    );
}
export default LoginCard;