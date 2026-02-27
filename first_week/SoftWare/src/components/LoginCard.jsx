import { useNavigate } from "react-router-dom";

function LoginCard() {

      const navigate = useNavigate();
 async function handleLogin(event) {
  console.log("Button Clicked");
    event.preventDefault(); 

    const id = document.getElementById('studentId').value;
    const pass = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: id, password: pass })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Welcome " + (data.studentName || "stusent"));
         navigate("/dashboard");
    } else {
        alert("hello " || data.message); 
    }
}
  return (
    <div className="login-card">
      <h2>System Login</h2>
      <p className="login-subtext">
        Enter your university credentials
      </p>

      <input id="studentId" type="text" placeholder="University ID" />
      <input id="password" type="password" placeholder="Password" />

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