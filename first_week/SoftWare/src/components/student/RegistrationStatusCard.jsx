import { useNavigate } from "react-router-dom";

function RegistrationStatusCard({ status }) {
  const navigate = useNavigate();

  return (
    <div className="student-card registration-card">
      <h2>حالة تسجيل المقررات</h2>

      <p className={`status ${status}`}>
        {status === "open" ? "التسجيل مفتوح" : "التسجيل مغلق"}
      </p>

      <button
        disabled={status !== "open"}
        onClick={() => navigate("/dashboard/registration")}
      >
        تسجيل المقررات للفصل الحالي
      </button>
    </div>
  );
}

export default RegistrationStatusCard;