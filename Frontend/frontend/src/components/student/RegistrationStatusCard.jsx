import { useNavigate } from "react-router-dom";

function RegistrationStatusCard({ status }) {
  const navigate = useNavigate();//go to another page from funcrion

  return (
    <div className="student-card registration-card">
      <h2>حالة تسجيل المقررات</h2>

      <p className={`status ${status}`}>
        {status === "open" ? " registeration open" : " registeration closed"}
      </p>

      <button
        disabled={status !== "open"}
        onClick={() => navigate("/home_page/registration")}
      >
       Register Your Subjects From Here
      </button>
    </div>
  );
}

export default RegistrationStatusCard;