import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/student/CourseCard";
import RegistrationFooter from "../components/student/RegistrationFooter";
import axios from "axios";
import toast from 'react-hot-toast'; 

function RegistrationPage() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [coursesList, setCoursesList] = useState([]);
  const navigate = useNavigate();
  const totalHours = selectedCourses.reduce((sum, c) => sum + (c.hours || 0), 0);

  const [registrationOpen, setRegistrationOpen] = useState(true);
const [regStatusLoading, setRegStatusLoading] = useState(true);

useEffect(() => {
  const fetchRegStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:9000/settings/status', {
        headers: { Authorization: token }
      });
      setRegistrationOpen(res.data.registrationOpen);
    } catch (err) {
      console.error(err);
      toast.error('فشل تحميل حالة التسجيل');
    } finally {
      setRegStatusLoading(false);
    }
  };
  fetchRegStatus();
}, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9000/courses/available-courses", {
          headers: { Authorization: token }
        });
        
        setCoursesList(res.data);
      } catch (err) {
        console.error(err);
        toast.error("فشل تحميل المواد"); 
      } finally {
        setPageLoading(false);
      }
    };
    fetchCourses();
  }, []);

  function hasConflict(course) {
    if (!course.schedule) return false;
    for (let selected of selectedCourses) {
      if (!selected.schedule) continue;
      for (let s1 of selected.schedule) {
        for (let s2 of course.schedule) {
          if (s1.day === s2.day && s1.time === s2.time) return true;
        }
      }
    }
    return false;
  }

  function handleSelect(course) {
 if (!registrationOpen) {
    toast.error("تسجيل المواد مغلق حالياً");
    return;
  }
     if (course.isRegistered) {
        toast.error("هذه المادة مسجلة مسبقاً");
        return;
    }
    if (!course.canRegister) {
        toast.error("لا يمكنك تسجيل هذه المادة (المتطلبات غير مكتملة أو السعة ممتلئة)");
        return;
    }
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
      return;
    }
    if (totalHours + course.hours > 18) {
      toast.error("لا يمكن اختيار أكثر من 18 ساعة"); 
      return;
    }
    if (hasConflict(course)) {
      toast.error("يوجد تعارض في المواعيد!"); 
      return;
    }
    setSelectedCourses([...selectedCourses, course]);
  }

  async function handleSubmit() {
    if (!registrationOpen) {
    toast.error("تسجيل المواد مغلق حالياً");
    return;
  }
    if (selectedCourses.length === 0) {
        toast.error("اختر مواد أولاً");
        return;
    }
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const course_ids = selectedCourses.map(c => c.id);

        const response = await axios.post(
            "http://localhost:9000/courses/register-courses",
            { course_ids },
            { headers: { Authorization: token } }
        );

        if (response.data.success) {
            const { registered, errors } = response.data;
            if (errors.length > 0) {
                toast.success(`تم تسجيل ${registered.length} مادة بنجاح`);
                errors.forEach(err => {
                    toast.error(`فشل تسجيل ${err.course_id}: ${err.message}`);
                });
            } else {
                toast.success("تم تسجيل موادك بنجاح!");
            }
            navigate("/home_page/schedule");
        } else {
            toast.error("فشل في تسجيل المواد");
        }
    } catch (error) {
        console.error(error);
        toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
        setLoading(false);
    }
}

  if (pageLoading) return <p>Loading...</p>;

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

      {coursesList.length === 0 ? (
        <div className="empty-state">
          <h3>لا توجد مواد متاحة</h3>
          <p>سيتم إضافة المواد قريباً</p>
        </div>
      ) : (
        <>
          <div className="courses-grid">
            {coursesList.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={selectedCourses.find(c => c.id === course.id)}
                onSelect={handleSelect}
                totalHours={totalHours}
              />
            ))}
          </div>

          <RegistrationFooter
            selectedCourses={selectedCourses}
            totalHours={totalHours}
            loading={loading}
            onSubmit={handleSubmit}
            disabled={!registrationOpen}
          />
        </>
      )}
    </div>
  );
}

export default RegistrationPage;