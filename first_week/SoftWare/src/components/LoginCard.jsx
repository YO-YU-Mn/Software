import { useNavigate } from "react-router-dom";

function LoginCard() {

      const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
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