import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function SchedulePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  
  useEffect(() => {
    const fetchRegStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/settings/status', {
          headers: { Authorization: token }
        });
        setRegistrationOpen(res.data.registrationOpen);
      } catch (err) {
        console.error("Failed to fetch registration status", err);
      }
    };
    fetchRegStatus();
  }, []);


  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:9000/courses/current', {
        headers: { Authorization: token }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل الجدول");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  
  const handleDrop = (courseId) => {
    confirmAlert({
      title: 'تأكيد الحذف',
      message: 'هل أنت متأكد من حذف هذه المادة؟',
      buttons: [
        {
          label: 'نعم',
          onClick: async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.delete('http://localhost:9000/courses/drop', {
                headers: { Authorization: token },
                data: { course_id: courseId }
              });
              toast.success('تم حذف المادة بنجاح');
              setCourses(prev => prev.filter(c => c.course_id !== courseId));
            } catch (err) {
              toast.error('حدث خطأ أثناء الحذف');
            }
          }
        },
        {
          label: 'لا',
          onClick: () => {}
        }
      ]
    });
  };


  const handleReset = () => {
    confirmAlert({
      title: 'تأكيد إعادة التسجيل',
      message: 'هل أنت متأكد من إعادة تسجيل المواد؟ سيتم حذف جميع المواد المسجلة حالياً.',
      buttons: [
        {
          label: 'نعم',
          onClick: async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.delete('http://localhost:9000/courses/drop-all', {
                headers: { Authorization: token }
              });
              toast.success('تم حذف جميع المواد، يمكنك التسجيل من جديد');
              navigate("/home_page/registration");
            } catch (err) {
              toast.error('حدث خطأ أثناء حذف المواد');
            }
          }
        },
        {
          label: 'لا',
          onClick: () => {}
        }
      ]
    });
  };

  if (loading) return <p>جاري التحميل...</p>;

  if (courses.length === 0) {
    return (
      <div className="schedule-page">
        <div className="no-data">
          <div className="no-data-icon">📅</div>
          <h3>لا يوجد جدول مسجل</h3>
          <p>لم تقم بتسجيل أي مواد بعد</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-register"
              onClick={() => {
                if (!registrationOpen) {
                  toast.error("تسجيل المواد مغلق حالياً");
                  return;
                }
                navigate("/home_page/registration");
              }}
              disabled={!registrationOpen}
            >
              تسجيل مواد الآن
            </button>
            <button 
              className="btn-ai-schedule"
              onClick={() => navigate('/home_page/schedule-registration')}
            >
              🤖 جدول ذكي
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalHours = courses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h2>الجدول الدراسي</h2>
        <div className="schedule-actions">
          <button 
            className="btn-ai-schedule"
            onClick={() => navigate('/home_page/schedule-registration')}
          >
            🤖 جدول ذكي
          </button>
          <button className="btn-print" onClick={() => window.print()}>
            🖨️ طباعة
          </button>
          <button className="btn-reset" onClick={handleReset}>
            🔄 إعادة تعيين
          </button>
        </div>
      </div>

      <div className="schedule-summary">
        <div className="summary-item">
          <div className="summary-icon">📚</div>
          <div className="summary-info">
            <h4>المواد</h4>
            <p>{courses.length}</p>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">⏱️</div>
          <div className="summary-info">
            <h4>إجمالي الساعات</h4>
            <p>{totalHours} / 18</p>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-icon">📅</div>
          <div className="summary-info">
            <h4>أيام الدراسة</h4>
            <p>{new Set(courses.flatMap(c => c?.schedule?.map(s => s?.day) || []).filter(Boolean)).size}</p>
          </div>
        </div>
      </div>

      <div className="schedule-cards">
        {courses.map(course => (
          <div key={course.course_id} className="schedule-card">
            <div className="card-header">
              <h3 className="course-name">{course.title || 'بدون عنوان'}</h3>
              <span className="course-badge">
                {course.credits || 0} ساعات
              </span>
            </div>

            <div className="course-details">
              <span className="detail-item">
                👨‍🏫 {course.instructor || 'د. أحمد محمد'}
              </span>
              <span className="detail-item">
                🏛️ {course.department || 'علوم حاسب'}
              </span>
            </div>

            {course?.schedule && Array.isArray(course.schedule) && course.schedule.length > 0 && (
              <div className="schedule-timetable">
                <div className="timetable-title">
                  📅 مواعيد المحاضرات
                </div>
                <div className="timetable-grid">
                  {course.schedule.map((s, index) => (
                    <div key={index} className="timetable-row">
                      <span className="timetable-day">{s?.day || 'غير محدد'}</span>
                      <span className="timetable-time">{s?.time || 'غير محدد'}</span>
                      <span className="timetable-location">
                        📍 {s?.location || 'قاعة 101'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="course-info">
              <span className="info-item">
                🔢 كود المادة: {course.course_id}
              </span>
              <span className="info-item">
                ⏱️ {course.credits || 0} ساعات
              </span>
            </div>

            <button 
              className="btn-drop"
              onClick={() => handleDrop(course.course_id)}
            >
              🗑️ حذف
            </button>
          </div>
        ))}
      </div>

      {/* العرض الأسبوعي */}
      <div className="weekly-view">
        <h3>📅 عرض أسبوعي</h3>
        <div className="weekly-grid">
          {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
            <div key={day} className="week-day">
              <div className="day-header">
                <span className="day-name">{day}</span>
                <span className="day-date">2026/03/01</span>
              </div>
              {courses
                .filter(course => course?.schedule?.some?.(s => s?.day === day))
                .map(course => (
                  <div key={course.course_id} className="week-course">
                    <strong>{course.title}</strong>
                    <div>{course?.schedule?.find?.(s => s?.day === day)?.time}</div>
                    <div>{course?.schedule?.find?.(s => s?.day === day)?.location || 'قاعة 101'}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .btn-ai-schedule {
          background: #534AB7;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-ai-schedule:hover {
          background: #3C3489;
        }

       .btn-print, .btn-reset {
  background: white;
  color: #534AB7;
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-print:hover, .btn-reset:hover {
  background: #f5f5f5;
  border-color: #534AB7;
}

        .btn-register {
          background: #534AB7;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-register:hover:not(:disabled) {
          background: #3C3489;
        }

        .btn-register:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-drop {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          width: 100%;
          justify-content: center;
          margin-top: 12px;
        }

        .btn-drop:hover {
          background: #2629dc;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default SchedulePage;