import React, { useState } from 'react';
import './ScheduleRegistration.css';

const ScheduleRegistration = () => {
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [currentFilter, setCurrentFilter] = useState('all');
  const [chosenPref, setChosenPref] = useState(null);
  const [showPrefStep, setShowPrefStep] = useState(false);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalCourse, setModalCourse] = useState(null);

  const courses = [
    { code: "CS301", name: "هياكل البيانات والخوارزميات", dept: "CS", hours: 3, type: "إجباري",
      slots: [{ day: "الأحد", times: ["8:00 ص — 10:00 ص", "12:00 م — 2:00 م"] }, { day: "الثلاثاء", times: ["8:00 ص — 10:00 ص", "12:00 م — 2:00 م"] }] },
    { code: "CS302", name: "قواعد البيانات", dept: "CS", hours: 3, type: "إجباري",
      slots: [{ day: "الاثنين", times: ["10:00 ص — 12:00 م", "2:00 م — 4:00 م"] }, { day: "الأربعاء", times: ["10:00 ص — 12:00 م", "2:00 م — 4:00 م"] }] },
    { code: "CS303", name: "الشبكات والاتصالات", dept: "CS", hours: 3, type: "إجباري",
      slots: [{ day: "الأحد", times: ["10:00 ص — 12:00 م", "3:00 م — 5:00 م"] }, { day: "الثلاثاء", times: ["10:00 ص — 12:00 م", "3:00 م — 5:00 م"] }] },
    { code: "CS401", name: "الذكاء الاصطناعي", dept: "CS", hours: 3, type: "اختياري",
      slots: [{ day: "الاثنين", times: ["8:00 ص — 10:00 ص", "4:00 م — 6:00 م"] }, { day: "الأربعاء", times: ["8:00 ص — 10:00 ص", "4:00 م — 6:00 م"] }] },
    { code: "CS402", name: "تطوير تطبيقات الويب", dept: "CS", hours: 3, type: "اختياري",
      slots: [{ day: "الثلاثاء", times: ["2:00 م — 4:00 م"] }, { day: "الخميس", times: ["2:00 م — 4:00 م"] }] },
    { code: "MATH301", name: "الإحصاء والاحتمالات", dept: "MATH", hours: 3, type: "إجباري",
      slots: [{ day: "الأحد", times: ["12:00 م — 2:00 م", "5:00 م — 7:00 م"] }, { day: "الثلاثاء", times: ["12:00 م — 2:00 م", "5:00 م — 7:00 م"] }] },
    { code: "MATH302", name: "الجبر الخطي", dept: "MATH", hours: 3, type: "إجباري",
      slots: [{ day: "الاثنين", times: ["8:00 ص — 10:00 ص"] }, { day: "الأربعاء", times: ["8:00 ص — 10:00 ص"] }] },
    { code: "ENG301", name: "أنظمة التشغيل", dept: "ENG", hours: 3, type: "إجباري",
      slots: [{ day: "الأحد", times: ["2:00 م — 4:00 م"] }, { day: "الثلاثاء", times: ["2:00 م — 4:00 م"] }] },
    { code: "ENG302", name: "معمارية الحاسب", dept: "ENG", hours: 3, type: "إجباري",
      slots: [{ day: "الاثنين", times: ["12:00 م — 2:00 م", "4:00 م — 6:00 م"] }, { day: "الأربعاء", times: ["12:00 م — 2:00 م", "4:00 م — 6:00 م"] }] },
    { code: "ENG401", name: "معالجة الإشارات الرقمية", dept: "ENG", hours: 3, type: "اختياري",
      slots: [{ day: "الخميس", times: ["10:00 ص — 12:00 م", "3:00 م — 5:00 م"] }] },
  ];

  const toggleCourse = (code) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCourses(newSelected);
  };

  const getTotalHours = () => {
    let total = 0;
    selectedCourses.forEach(code => {
      const course = courses.find(c => c.code === code);
      if (course) total += course.hours;
    });
    return total;
  };

  const getFilteredCourses = () => {
    return courses.filter(c => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'إجباري' || currentFilter === 'اختياري') return c.type === currentFilter;
      return c.dept === currentFilter;
    });
  };

  const startGenerate = () => {
    if (selectedCourses.size === 0) return;
    setShowPrefStep(true);
    setScheduleResult(null);
    setChosenPref(null);
  };

  const selectPref = (pref) => {
    setChosenPref(pref);
  };

  const generateSchedule = async () => {
    if (!chosenPref) return;

    setLoading(true);
    setShowPrefStep(false);

    const selectedCoursesList = [...selectedCourses].map(code =>
      courses.find(c => c.code === code)
    );

    const coursesDescription = selectedCoursesList.map(course => {
      const slotsDesc = course.slots.map(slot =>
        `${slot.day}: ${slot.times.join(' أو ')}`
      ).join(' | ');
      return `- ${course.name} (${course.code}) | ${course.hours} ساعات | ${course.type} | المواعيد المتاحة: ${slotsDesc}`;
    }).join('\n');

    try {
      // هنا هتستدعي الـ backend API بتاعك
      const response = await fetch('http://localhost:3000/api/ai/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preference: chosenPref,
          coursesList: coursesDescription
        })
      });

      const data = await response.json();
      
      // استخراج الـ JSON من الرد
      const text = data.content?.[0]?.text || '';
      const cleanJSON = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJSON);
      
      setScheduleResult(result);
    } catch (error) {
      console.error('Error:', error);
      setScheduleResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const resetToPrefStep = () => {
    setShowPrefStep(true);
    setScheduleResult(null);
    setChosenPref(null);
  };

  return (
    <div className="schedule-page">
      <div className="header">
        <h1>تسجيل مقررات الترم الحالي</h1>
        <p>اختر المقررات، شوف المواعيد المتاحة، ثم اضغط Generate لإنشاء جدولك بالذكاء الاصطناعي</p>
      </div>

      <div className="student-info">
        <div className="info-card">
          <div className="info-label">اسم الطالب</div>
          <div className="info-value">أحمد محمد علي</div>
        </div>
        <div className="info-card">
          <div className="info-label">الرقم الجامعي</div>
          <div className="info-value">20210045</div>
        </div>
        <div className="info-card">
          <div className="info-label">الساعات المسجلة / المسموح</div>
          <div className="info-value">{getTotalHours()} / 18 ساعة</div>
        </div>
      </div>

      <div className="section-title">مقررات الترم الحالي</div>

      <div className="filters">
        <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>الكل</button>
        <button className={`filter-btn ${currentFilter === 'إجباري' ? 'active' : ''}`} onClick={() => setCurrentFilter('إجباري')}>إجباري</button>
        <button className={`filter-btn ${currentFilter === 'اختياري' ? 'active' : ''}`} onClick={() => setCurrentFilter('اختياري')}>اختياري</button>
        <button className={`filter-btn ${currentFilter === 'CS' ? 'active' : ''}`} onClick={() => setCurrentFilter('CS')}>علم الحاسب</button>
        <button className={`filter-btn ${currentFilter === 'MATH' ? 'active' : ''}`} onClick={() => setCurrentFilter('MATH')}>رياضيات</button>
        <button className={`filter-btn ${currentFilter === 'ENG' ? 'active' : ''}`} onClick={() => setCurrentFilter('ENG')}>هندسة</button>
      </div>

      <div className="courses-grid">
        {getFilteredCourses().map(course => (
          <div key={course.code} className={`course-card ${selectedCourses.has(course.code) ? 'selected' : ''}`}>
            <div className="card-top">
              <div className="course-code">{course.code}</div>
              <div className={`select-toggle ${selectedCourses.has(course.code) ? 'checked' : ''}`} onClick={() => toggleCourse(course.code)}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2">
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              </div>
            </div>
            <div className="course-name">{course.name}</div>
            <div className="course-meta">
              <span className="badge badge-dept">{course.dept}</span>
              <span className="badge badge-hours">{course.hours} ساعات</span>
              <span className="badge badge-type">{course.type}</span>
            </div>
            <div className="card-actions">
              <button className="btn-select" onClick={() => toggleCourse(course.code)}>
                {selectedCourses.has(course.code) ? '✓ تم الاختيار' : '+ اختيار'}
              </button>
              <button className="btn-schedule" onClick={() => setModalCourse(course)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                المواعيد
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-bar">
        <div className="summary-stats">
          <div className="stat">
            <div className="stat-num">{selectedCourses.size}</div>
            <div className="stat-label">مقرر مختار</div>
          </div>
          <div className="stat">
            <div className="stat-num">{getTotalHours()}</div>
            <div className="stat-label">ساعة معتمدة</div>
          </div>
        </div>
        <button className="generate-btn" onClick={startGenerate} disabled={selectedCourses.size === 0}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Generate جدولك
        </button>
      </div>

      <div className="section-title">الجدول الدراسي المقترح</div>
      <div className="result-area">
        {showPrefStep && (
          <div className="pref-step">
            <div className="pref-title">ما هو تفضيلك لمواعيد الجدول؟</div>
            <div className="pref-sub">الذكاء الاصطناعي سيختار أفضل المواعيد المتاحة بناءً على اختيارك</div>
            <div className="pref-options">
              <div className={`pref-card ${chosenPref === 'صباحي' ? 'selected' : ''}`} onClick={() => selectPref('صباحي')}>
                <div className="pref-icon">🌅</div>
                <div className="pref-name">صباحي</div>
                <div className="pref-desc">من 8 ص حتى 12 م</div>
              </div>
              <div className={`pref-card ${chosenPref === 'متوسط' ? 'selected' : ''}`} onClick={() => selectPref('متوسط')}>
                <div className="pref-icon">🌤️</div>
                <div className="pref-name">متوسط</div>
                <div className="pref-desc">من 10 ص حتى 3 م</div>
              </div>
              <div className={`pref-card ${chosenPref === 'مسائي' ? 'selected' : ''}`} onClick={() => selectPref('مسائي')}>
                <div className="pref-icon">🌆</div>
                <div className="pref-name">مسائي</div>
                <div className="pref-desc">من 2 م حتى 8 م</div>
              </div>
            </div>
            <button className="pref-confirm" onClick={generateSchedule} disabled={!chosenPref}>
              توليد الجدول ←
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-wrap">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
            جاري إنشاء الجدول المثالي لك...
          </div>
        )}

        {scheduleResult && !loading && (
          <div className="schedule-result">
            {scheduleResult.error ? (
              <div className="error-msg">
                حصل خطأ: {scheduleResult.error}<br />
                <button className="retry-btn" onClick={resetToPrefStep}>حاول تاني</button>
              </div>
            ) : (
              <>
                <div className="schedule-header">
                  <div className="schedule-header-title">
                    الجدول الدراسي — إجمالي {scheduleResult.schedule?.reduce((s, c) => s + c.hours, 0) || 0} ساعة
                  </div>
                  <span className="schedule-pref-badge">
                    {chosenPref === 'صباحي' && '🌅 صباحي'}
                    {chosenPref === 'متوسط' && '🌤️ متوسط'}
                    {chosenPref === 'مسائي' && '🌆 مسائي'}
                  </span>
                </div>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>الكود</th><th>اسم المقرر</th><th>الساعات</th><th>اليوم</th><th>الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleResult.schedule?.map(course => (
                      <tr key={course.code}>
                        <td><strong>{course.code}</strong></td>
                        <td>{course.name}</td>
                        <td style={{ textAlign: 'center' }}>{course.hours}</td>
                        <td>{course.day || '—'}</td>
                        <td>{course.time || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {scheduleResult.notes && (
                  <div className="result-notes">ملاحظات: {scheduleResult.notes}</div>
                )}
                <button className="retry-btn" onClick={resetToPrefStep}>↩ تغيير التفضيل</button>
              </>
            )}
          </div>
        )}

        {!showPrefStep && !loading && !scheduleResult && (
          <div className="result-placeholder">اختر المقررات التي تريدها ثم اضغط Generate</div>
        )}
      </div>

      {/* Modal */}
      {modalCourse && (
        <div className="modal-overlay open" onClick={() => setModalCourse(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{modalCourse.name}</div>
                <div className="modal-subtitle">{modalCourse.code} — {modalCourse.hours} ساعات — {modalCourse.type}</div>
              </div>
              <button className="modal-close" onClick={() => setModalCourse(null)}>×</button>
            </div>
            <div className="modal-body">
              {modalCourse.slots?.length > 0 ? (
                modalCourse.slots.map((slot, idx) => (
                  <div key={idx} className="slot-group">
                    <div className="slot-day">{slot.day}</div>
                    {slot.times.map((time, tIdx) => (
                      <div key={tIdx} className="slot-time">{time}</div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="no-slots">لا توجد مواعيد متاحة حالياً</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleRegistration;