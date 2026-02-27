import { useState } from "react";
import { useNavigate } from "react-router-dom";
import courses from "../data/coursesData";


function RegistrationPage() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const coursesList = Array.isArray(courses) ? courses : [];
  
  const totalHours = selectedCourses.reduce((sum, c) => sum + (c.hours || 0), 0);

  function hasConflict(course) {
    
    if (!course.schedule || !Array.isArray(course.schedule)) return false;
    
    for (let selected of selectedCourses) {
      if (!selected.schedule || !Array.isArray(selected.schedule)) continue;
      
      for (let s1 of selected.schedule) {
        for (let s2 of course.schedule) {
          if (s1?.day === s2?.day && s1?.time === s2?.time) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function handleSelect(course) {
    if (!course) return;
    
    if (selectedCourses.find(c => c?.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c?.id !== course.id));
      return;
    }

    if (totalHours + (course.hours || 0) > 18) {
      alert("لا يمكن اختيار أكثر من 18 ساعة");
      return;
    }

    if (hasConflict(course)) {
      alert("يوجد تعارض في المواعيد!");
      return;
    }

    setSelectedCourses([...selectedCourses, course]);
  }

  function handleSubmit() {
    if (selectedCourses.length === 0) {
      alert("اختر مواد أولاً");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("studentSchedule", JSON.stringify(selectedCourses));
      setLoading(false);
      navigate("/dashboard/schedule");
    }, 1500);
  }

  return (
    <div className="registration-page">
      <div className="registration-header">
        <h2>تسجيل المقررات</h2>
        <div className="hours-card">
          <div className="hours-icon">📚</div>
          <div className="hours-info">
            <div className="hours-label">إجمالي الساعات</div>
            <div className="hours-value">{totalHours}</div>
            <div className="hours-max">الحد الأقصى: 18 ساعة</div>
          </div>
        </div>
      </div>

      {/* ✅ عرض رسالة إذا كانت المصفوفة فارغة */}
      {coursesList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>لا توجد مواد متاحة</h3>
          <p>سيتم إضافة المواد قريباً</p>
        </div>
      ) : (
        <>
          <div className="courses-grid">
            {coursesList.map(course => (
              <div 
                key={course?.id || Math.random()} 
                className={`course-card ${selectedCourses.find(c => c?.id === course?.id) ? 'selected' : ''}`}
              >
                <div className="course-header">
                  <span className="course-code">{course?.code || 'CS101'}</span>
                  <span className="course-hours-badge">
                    <span>⏱️</span> {course?.hours || 0} ساعات
                  </span>
                </div>
                
                <h3 className="course-title">{course?.name || 'بدون عنوان'}</h3>
                
                <div className="course-instructor">
                  <span>👨‍🏫</span> {course?.instructor || 'د. أحمد محمد'}
                </div>

                {/* ✅ تأكد من وجود schedule قبل عرضه */}
                {course?.schedule && Array.isArray(course.schedule) && course.schedule.length > 0 && (
                  <div className="schedule-info">
                    <div className="schedule-title">
                      <span>📅</span> المواعيد
                    </div>
                    {course.schedule.map((s, index) => (
                      <div key={index} className="schedule-item">
                        <span className="schedule-day">{s?.day || 'غير محدد'}</span>
                        <span className="schedule-time">{s?.time || 'غير محدد'}</span>
                        <span className="schedule-location">
                          <span>📍</span> {s?.location || 'قاعة 101'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="course-description">
                  {course?.description || 'وصف المادة الدراسية وأهدافها...'}
                </p>

                <div className="course-actions">
                  {selectedCourses.find(c => c?.id === course?.id) ? (
                    <button 
                      className="btn-remove"
                      onClick={() => handleSelect(course)}
                    >
                      <span>🗑️</span> إزالة
                    </button>
                  ) : (
                    <button 
                      className="btn-select"
                      onClick={() => handleSelect(course)}
                      disabled={totalHours + (course?.hours || 0) > 18}
                    >
                      <span>➕</span> اختيار المادة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="registration-footer">
            <div className="selected-summary">
              <div className="selected-count">
                <span className="count-number">{selectedCourses.length}</span>
                <span>مواد مختارة</span>
              </div>
              <div className="total-hours-footer">
                إجمالي الساعات: {totalHours}/18
              </div>
            </div>
            
            <button 
              className="btn-submit" 
              onClick={handleSubmit}
              disabled={loading || selectedCourses.length === 0}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <span>✅</span>
                  تأكيد التسجيل
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default RegistrationPage;