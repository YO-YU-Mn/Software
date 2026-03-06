import { useNavigate } from "react-router-dom";

function LoginCard() {

      const navigate = useNavigate();
 async function handleLogin(event) {
  console.log("Button Clicked");
    event.preventDefault(); 

    const id = document.getElementById('studentId').value;
    const pass = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: id, password: pass })
        });

        const data = await response.json();

        if (response.status === 200) {
            // نجح الدخول
            alert(data.message); // "تم الدخول بنجاح"
            localStorage.setItem('token', data.token);
            localStorage.setItem('studentName', data.studentName);
            navigate("/dashboard");
        } else if (response.status === 404) {
            alert(data.message); // "الطالب غير مسجل في النظام"
        } else if (response.status === 401) {
            alert(data.message); // "كلمة المرور خاطئة"
        } else {
            alert("خطأ: " + data.message);
        }
    } catch (error) {
        alert("خطأ في الاتصال: " + error.message);
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