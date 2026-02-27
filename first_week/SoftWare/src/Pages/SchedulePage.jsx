import { useNavigate } from "react-router-dom";


function SchedulePage() {
  const navigate = useNavigate();

 
  const savedData = localStorage.getItem("studentSchedule");
  const saved = savedData ? JSON.parse(savedData) : null;
  
  
  const coursesList = saved && Array.isArray(saved) ? saved : [];

  function handleReset() {
    localStorage.removeItem("studentSchedule");
    navigate("/dashboard/registration");
  }

  
  if (coursesList.length === 0) {
    return (
      <div className="schedule-page">
        <div className="no-data">
          <div className="no-data-icon">📅</div>
          <h3>لا يوجد جدول مسجل</h3>
          <p>لم تقم بتسجيل أي مواد بعد</p>
          <button 
            className="btn-register"
            onClick={() => navigate("/dashboard/registration")}
          >
            <span>➕</span> تسجيل مواد الآن
          </button>
        </div>
      </div>
    );
  }

  const totalHours = coursesList.reduce((sum, c) => sum + (c?.hours || 0), 0);

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h2>الجدول الدراسي</h2>
        <div className="schedule-actions">
          <button className="btn-print" onClick={() => window.print()}>
            <span>🖨️</span> طباعة
          </button>
          <button className="btn-reset" onClick={handleReset}>
            <span>🔄</span> إعادة تسجيل
          </button>
        </div>
      </div>

      <div className="schedule-summary">
        <div className="summary-item">
          <div className="summary-icon">📚</div>
          <div className="summary-info">
            <h4>إجمالي المواد</h4>
            <p>{coursesList.length}</p>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">⏱️</div>
          <div className="summary-info">
            <h4>إجمالي الساعات</h4>
            <p>{totalHours}</p>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">📅</div>
          <div className="summary-info">
            <h4>أيام الدراسة</h4>
            <p>{new Set(coursesList.flatMap(c => c?.schedule?.map(s => s?.day) || []).filter(Boolean)).size}</p>
          </div>
        </div>
      </div>

      <div className="schedule-cards">
        {coursesList.map(course => (
          <div key={course?.id || Math.random()} className="schedule-card">
            <div className="card-header">
              <h3 className="course-name">{course?.name || 'بدون عنوان'}</h3>
              <span className="course-badge">
                <span>⏱️</span> {course?.hours || 0} ساعات
              </span>
            </div>

            <div className="course-details">
              <span className="detail-item">
                <span>👨‍🏫</span> {course?.instructor || 'د. أحمد محمد'}
              </span>
              <span className="detail-item">
                <span>🏛️</span> {course?.department || 'علوم حاسب'}
              </span>
            </div>

            {/* ✅ تأكد من وجود schedule قبل عرضه */}
            {course?.schedule && Array.isArray(course.schedule) && course.schedule.length > 0 && (
              <div className="schedule-timetable">
                <div className="timetable-title">
                  <span>📅</span> مواعيد المحاضرات
                </div>
                <div className="timetable-grid">
                  {course.schedule.map((s, index) => (
                    <div key={index} className="timetable-row">
                      <span className="timetable-day">{s?.day || 'غير محدد'}</span>
                      <span className="timetable-time">{s?.time || 'غير محدد'}</span>
                      <span className="timetable-location">
                        <span>📍</span> {s?.location || 'قاعة 101'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="course-info">
              <span className="info-item">
                <span>📝</span> رمز المادة: {course?.code || 'CS101'}
              </span>
              <span className="info-item">
                <span>⭐</span> {course?.hours || 0} ساعات معتمدة
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* عرض أسبوعي إضافي */}
      <div className="weekly-view">
        <h3>
          <span>📊</span> عرض أسبوعي
        </h3>
        <div className="weekly-grid">
          {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(day => (
            <div key={day} className="week-day">
              <div className="day-header">
                <span className="day-name">{day}</span>
                <span className="day-date">2026/03/01</span>
              </div>
              {coursesList
                .filter(course => course?.schedule?.some?.(s => s?.day === day))
                .map(course => (
                  <div key={course?.id} className="week-course">
                    <strong>{course?.name}</strong>
                    <div>{course?.schedule?.find?.(s => s?.day === day)?.time}</div>
                    <div>{course?.schedule?.find?.(s => s?.day === day)?.location || 'قاعة 101'}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;