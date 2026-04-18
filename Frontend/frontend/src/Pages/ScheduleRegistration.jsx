import React, { useState, useEffect } from 'react';
import './ScheduleRegistration.css';

const API = 'http://localhost:9000';
const GROQ_API_KEY = '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'; // ← حط الكي الجديد هنا بعد ما تعمل rotate
const GROQ_API    = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL  = 'llama-3.3-70b-versatile';

const ScheduleRegistration = () => {
  // ─── State ───────────────────────────────────────────────
  const [student, setStudent]                   = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [currentCourses, setCurrentCourses]     = useState([]);
  const [selectedCourses, setSelectedCourses]   = useState(new Set());
  const [currentFilter, setCurrentFilter]       = useState('all');
  const [chosenPref, setChosenPref]             = useState(null);
  const [showPrefStep, setShowPrefStep]         = useState(false);
  const [scheduleResult, setScheduleResult]     = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [pageLoading, setPageLoading]           = useState(true);
  const [modalCourse, setModalCourse]           = useState(null);
  const [registerLoading, setRegisterLoading]   = useState(false);
  const [registerResult, setRegisterResult]     = useState(null);
  const [error, setError]                       = useState(null);

  const token   = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  // ─── Fetch on mount ──────────────────────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setPageLoading(true);
    setError(null);
    try {
      const [profileRes, availRes, currentRes] = await Promise.all([
        fetch(`${API}/students/profile`,          { headers }),
        fetch(`${API}/courses/available-courses`, { headers }),
        fetch(`${API}/courses/current`,           { headers }),
      ]);

      const profileData = await profileRes.json();
      const availData   = await availRes.json();
      const currentData = await currentRes.json();

      setStudent(profileData);
      setAvailableCourses(Array.isArray(availData)   ? availData   : []);
      setCurrentCourses(Array.isArray(currentData) ? currentData : []);
    } catch (err) {
      setError('تعذّر الاتصال بالسيرفر. تأكد من تشغيل الباك إند.');
    } finally {
      setPageLoading(false);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────
  const getRegisteredHours = () =>
    currentCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  const getSelectedHours = () => {
    let total = 0;
    selectedCourses.forEach(id => {
      const c = availableCourses.find(x => x.id === id);
      if (c) total += c.hours || 0;
    });
    return total;
  };

  const getCourseSlots = (course) => {
    if (!course.schedule || course.schedule.length === 0) return [];
    const map = {};
    course.schedule.forEach(s => {
      if (!map[s.day]) map[s.day] = [];
      map[s.day].push(s.time);
    });
    return Object.entries(map).map(([day, times]) => ({ day, times }));
  };

  const getSlotsDesc = (course) =>
    getCourseSlots(course)
      .map(s => `${s.day}: ${s.times.join(' أو ')}`)
      .join(' | ');

  const getFiltered = () => {
    return availableCourses.filter(c => {
      if (currentFilter === 'all') return true;
      if (['CS', 'MATH', 'ENG'].includes(currentFilter))
        return (c.id || '').startsWith(currentFilter);
      return true;
    });
  };

  const toggleCourse = (id) => {
    const c = availableCourses.find(x => x.id === id);
    if (!c || !c.canRegister) return;
    const next = new Set(selectedCourses);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedCourses(next);
    setRegisterResult(null);
  };

  // ─── Register courses ─────────────────────────────────────
  const registerSelected = async () => {
    if (selectedCourses.size === 0) return;
    setRegisterLoading(true);
    setRegisterResult(null);
    try {
      const res = await fetch(`${API}/courses/register-courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ course_ids: [...selectedCourses] }),
      });
      const data = await res.json();
      setRegisterResult(data);
      if (data.registered?.length > 0) {
        setSelectedCourses(new Set());
        await fetchAll();
      }
    } catch (err) {
      setRegisterResult({ success: false, message: err.message });
    } finally {
      setRegisterLoading(false);
    }
  };

  // ─── AI Schedule generation (Groq) ───────────────────────
  const startGenerate = () => {
    if (selectedCourses.size === 0) return;
    setShowPrefStep(true);
    setScheduleResult(null);
    setChosenPref(null);
  };

  const generateSchedule = async () => {
    if (!chosenPref) return;
    setLoading(true);
    setShowPrefStep(false);

    const list = [...selectedCourses]
      .map(id => availableCourses.find(c => c.id === id))
      .filter(Boolean);

    const coursesDescription = list
      .map(c => `- ${c.name} (${c.id}) | ${c.hours} ساعات | المواعيد: ${getSlotsDesc(c)}`)
      .join('\n');

    const timeRange =
      chosenPref === 'صباحي' ? '8 ص — 12 م' :
      chosenPref === 'متوسط' ? '10 ص — 3 م' : '2 م — 8 م';

    const userPrompt = `الطالب "${student?.name || 'الطالب'}" يريد جدولاً دراسياً ${chosenPref}ياً (يفضل أوقات ${timeRange}).

المقررات المختارة:
${coursesDescription}

المطلوب: اختر لكل مقرر اليوم والوقت المناسب من المواعيد المتاحة فقط، مع مراعاة التفضيل وعدم التعارض في المواعيد.
أجب فقط بـ JSON بهذا الشكل بدون أي نص خارجه:
{"schedule":[{"code":"...","name":"...","hours":3,"day":"...","time":"..."}],"notes":"ملاحظة مختصرة"}`;

    try {
      const res = await fetch(GROQ_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: 1000,
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content:
                'أنت مساعد جامعي متخصص في تنظيم الجداول الدراسية. أجب دائماً بـ JSON فقط بدون أي نص إضافي أو markdown.',
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || `Groq error ${res.status}`);
      }

      const text  = data.choices?.[0]?.message?.content || '';
      const clean = text.replace(/```json|```/g, '').trim();
      setScheduleResult(JSON.parse(clean));
    } catch (err) {
      setScheduleResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading / Error states ───────────────────────────────
  if (pageLoading) {
    return (
      <div className="schedule-page">
        <div className="loading-wrap" style={{ paddingTop: '5rem' }}>
          <div className="loading-dots"><span /><span /><span /></div>
          جاري تحميل بياناتك...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-page">
        <div className="error-msg" style={{ margin: '4rem auto', maxWidth: 400, textAlign: 'center' }}>
          {error}
          <br />
          <button className="retry-btn" onClick={fetchAll}>إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  const filtered  = getFiltered();
  const maxHours  = 18;
  const usedHours = getRegisteredHours() + getSelectedHours();

  return (
    <div className="schedule-page">

      {/* Header */}
      <div className="header">
        <h1>تسجيل مقررات الترم الحالي</h1>
        <p>اختر المقررات، شوف المواعيد المتاحة، ثم اضغط Generate لإنشاء جدولك بالذكاء الاصطناعي</p>
      </div>

      {/* Student Info */}
      <div className="student-info">
        <div className="info-card">
          <div className="info-label">اسم الطالب</div>
          <div className="info-value">{student?.name || '—'}</div>
        </div>
        <div className="info-card">
          <div className="info-label">الرقم الجامعي</div>
          <div className="info-value">{student?.code || '—'}</div>
        </div>
        <div className="info-card">
          <div className="info-label">التخصص</div>
          <div className="info-value">{student?.specialization || '—'}</div>
        </div>
        <div className="info-card">
          <div className="info-label">الساعات المسجلة / المسموح</div>
          <div
            className="info-value"
            style={{ color: usedHours >= maxHours ? '#dc2626' : undefined }}>
            {getRegisteredHours()} / {maxHours} ساعة
          </div>
        </div>
      </div>

      {/* المواد المسجلة حالياً */}
      {currentCourses.length > 0 && (
        <>
          <div className="section-title">المواد المسجلة حالياً ({currentCourses.length})</div>
          <div className="courses-grid" style={{ marginBottom: '1.5rem' }}>
            {currentCourses.map(c => (
              <div key={c.course_id || c._id} className="course-card registered-card">
                <div className="card-top">
                  <div className="course-code">{c.course_id}</div>
                  <span className="badge badge-registered">مسجّل</span>
                </div>
                <div className="course-name">{c.title}</div>
                <div className="course-meta">
                  <span className="badge badge-hours">{c.credits} ساعات</span>
                  {c.instructor && (
                    <span className="badge badge-dept">{c.instructor}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* المواد المتاحة للتسجيل */}
      <div className="section-title">مقررات متاحة للتسجيل</div>

      <div className="filters">
        {['all', 'CS', 'MATH', 'ENG'].map(f => (
          <button
            key={f}
            className={`filter-btn ${currentFilter === f ? 'active' : ''}`}
            onClick={() => setCurrentFilter(f)}>
            {f === 'all' ? 'الكل' : f === 'CS' ? 'علم الحاسب' : f === 'MATH' ? 'رياضيات' : 'هندسة'}
          </button>
        ))}
      </div>

      {availableCourses.length === 0 ? (
        <div className="result-placeholder">لا توجد مواد متاحة للتسجيل حالياً</div>
      ) : (
        <div className="courses-grid">
          {filtered.map(course => {
            const isSelected   = selectedCourses.has(course.id);
            const isRegistered = course.isRegistered;
            const canRegister  = course.canRegister;
            const slots        = getCourseSlots(course);

            return (
              <div
                key={course.id}
                className={`course-card
                  ${isSelected    ? 'selected'       : ''}
                  ${isRegistered  ? 'registered-card' : ''}
                  ${!canRegister && !isRegistered ? 'disabled-card' : ''}
                `}>
                <div className="card-top">
                  <div className="course-code">{course.id}</div>
                  <div
                    className={`select-toggle ${isSelected ? 'checked' : ''}`}
                    onClick={() => canRegister && toggleCourse(course.id)}>
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="course-name">{course.name}</div>

                <div className="course-meta">
                  <span className="badge badge-hours">{course.hours} ساعات</span>
                  {course.instructor && (
                    <span className="badge badge-dept">{course.instructor}</span>
                  )}
                  {isRegistered && <span className="badge badge-registered">مسجّل</span>}
                  {!canRegister && !isRegistered && !course.prerequisitesMet && (
                    <span className="badge badge-blocked">متطلب سابق</span>
                  )}
                  {!canRegister && !isRegistered && !course.hasCapacity && (
                    <span className="badge badge-blocked">مكتمل</span>
                  )}
                </div>

                <div className="card-actions">
                  {isRegistered ? (
                    <button className="btn-select" disabled>✓ مسجّل مسبقاً</button>
                  ) : canRegister ? (
                    <button
                      className="btn-select"
                      onClick={() => toggleCourse(course.id)}>
                      {isSelected ? '✓ تم الاختيار' : '+ اختيار'}
                    </button>
                  ) : (
                    <button className="btn-select" disabled>غير متاح</button>
                  )}

                  {slots.length > 0 && (
                    <button
                      className="btn-schedule"
                      onClick={() => setModalCourse({ ...course, slots })}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8"  y1="2" x2="8"  y2="6" />
                        <line x1="3"  y1="10" x2="21" y2="10" />
                      </svg>
                      المواعيد
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Bar */}
      <div className="summary-bar">
        <div className="summary-stats">
          <div className="stat">
            <div className="stat-num">{selectedCourses.size}</div>
            <div className="stat-label">مقرر مختار</div>
          </div>
          <div className="stat">
            <div className="stat-num">{getSelectedHours()}</div>
            <div className="stat-label">ساعة إضافية</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="generate-btn"
            style={{ background: '#059669' }}
            onClick={registerSelected}
            disabled={selectedCourses.size === 0 || registerLoading}>
            {registerLoading ? '...' : '✓ تسجيل المواد'}
          </button>
          <button
            className="generate-btn"
            onClick={startGenerate}
            disabled={selectedCourses.size === 0}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Generate جدولك
          </button>
        </div>
      </div>

      {/* نتيجة التسجيل */}
      {registerResult && (
        <div
          className={`result-notes ${registerResult.registered?.length > 0 ? '' : 'error-msg'}`}
          style={{ margin: '1rem 0' }}>
          {registerResult.registered?.length > 0 && (
            <div>✓ تم تسجيل {registerResult.registered.length} مادة بنجاح: {registerResult.registered.join(', ')}</div>
          )}
          {registerResult.errors?.length > 0 && (
            <div style={{ marginTop: 4 }}>
              تعذّر تسجيل: {registerResult.errors.map(e => `${e.course_id} (${e.message})`).join(' | ')}
            </div>
          )}
        </div>
      )}

      {/* AI Result area */}
      <div className="section-title" style={{ marginTop: '1.5rem' }}>الجدول الدراسي المقترح</div>
      <div className="result-area">

        {showPrefStep && (
          <div className="pref-step">
            <div className="pref-title">ما هو تفضيلك لمواعيد الجدول؟</div>
            <div className="pref-sub">الذكاء الاصطناعي سيختار أفضل المواعيد المتاحة بناءً على اختيارك</div>
            <div className="pref-options">
              {[
                { k: 'صباحي', icon: '🌅', desc: 'من 8 ص حتى 12 م' },
                { k: 'متوسط', icon: '🌤️', desc: 'من 10 ص حتى 3 م' },
                { k: 'مسائي', icon: '🌆', desc: 'من 2 م حتى 8 م' },
              ].map(p => (
                <div
                  key={p.k}
                  className={`pref-card ${chosenPref === p.k ? 'selected' : ''}`}
                  onClick={() => setChosenPref(p.k)}>
                  <div className="pref-icon">{p.icon}</div>
                  <div className="pref-name">{p.k}</div>
                  <div className="pref-desc">{p.desc}</div>
                </div>
              ))}
            </div>
            <button className="pref-confirm" onClick={generateSchedule} disabled={!chosenPref}>
              توليد الجدول ←
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-wrap">
            <div className="loading-dots"><span /><span /><span /></div>
            جاري إنشاء الجدول المثالي لك...
          </div>
        )}

        {scheduleResult && !loading && (
          <div className="schedule-result">
            {scheduleResult.error ? (
              <div className="error-msg">
                حصل خطأ: {scheduleResult.error}
                <br />
                <button
                  className="retry-btn"
                  onClick={() => {
                    setShowPrefStep(true);
                    setScheduleResult(null);
                    setChosenPref(null);
                  }}>
                  حاول تاني
                </button>
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
                      <th>الكود</th>
                      <th>اسم المقرر</th>
                      <th>الساعات</th>
                      <th>اليوم</th>
                      <th>الوقت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleResult.schedule?.map(c => (
                      <tr key={c.code}>
                        <td><strong>{c.code}</strong></td>
                        <td>{c.name}</td>
                        <td style={{ textAlign: 'center' }}>{c.hours}</td>
                        <td>{c.day || '—'}</td>
                        <td>{c.time || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {scheduleResult.notes && (
                  <div className="result-notes">ملاحظات: {scheduleResult.notes}</div>
                )}
                <button
                  className="retry-btn"
                  onClick={() => {
                    setShowPrefStep(true);
                    setScheduleResult(null);
                    setChosenPref(null);
                  }}>
                  ↩ تغيير التفضيل
                </button>
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{modalCourse.name}</div>
                <div className="modal-subtitle">
                  {modalCourse.id} — {modalCourse.hours} ساعات
                  {modalCourse.instructor ? ` — ${modalCourse.instructor}` : ''}
                </div>
              </div>
              <button className="modal-close" onClick={() => setModalCourse(null)}>×</button>
            </div>
            <div className="modal-body">
              {modalCourse.slots?.length > 0 ? (
                modalCourse.slots.map((slot, i) => (
                  <div key={i} className="slot-group">
                    <div className="slot-day">{slot.day}</div>
                    {slot.times.map((t, j) => (
                      <div key={j} className="slot-time">{t}</div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="no-slots">لا توجد مواعيد متاحة</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ScheduleRegistration;