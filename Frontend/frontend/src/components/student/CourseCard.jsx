function CourseCard({ course, isSelected, onSelect, totalHours }) {

   // تحديد ما إذا كان الزر مفعّلاً
    const canSelect = course.canRegister && !isSelected;

     // إذا كانت المادة مسجلة مسبقاً، نعرض بطاقة خاصة
    if (course.isRegistered) {
        return (
            <div className="course-card registered">
                <div className="course-header">
                    <span className="course-code">{course?.id || 'CS101'}</span>
                    <span className="course-hours-badge">
                        <span></span> {course?.hours || 0} Hours
                    </span>
                </div>
                <h3 className="course-title">{course?.name || 'بدون عنوان'}</h3>
                <div className="course-instructor">
                    <span></span> {course?.instructor || 'د. أحمد محمد'}
                </div>
                {course?.schedule && Array.isArray(course.schedule) && (
                    <div className="schedule-info">
                        <div className="schedule-title">
                            <span></span> مواعيد المحاضرات
                        </div>
                        {course.schedule.map((s, index) => (
                            <div key={index} className="schedule-item">
                                <span className="schedule-day">{s?.day || 'غير محدد'}</span>
                                <span className="schedule-time">{s?.time || 'غير محدد'}</span>
                                <span className="schedule-location">
                                    <span></span> {s?.location || 'قاعة 101'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <div className="course-actions">
                    <button className="btn-registered" disabled>
                        <span></span> مسجل مسبقًا
                    </button>
                </div>
            </div>
        );
    }

  return (
    <div className={`course-card ${isSelected ? 'selected' : ''}`}>
      <div className="course-header">
        <span className="course-code">{course?.id || 'CS101'}</span>
        <span className="course-hours-badge">
          <span></span> {course?.hours || 0} Hours
        </span>
      </div>

      <h3 className="course-title">{course?.name || 'بدون عنوان'}</h3>

      <div className="course-instructor">
        <span></span> {course?.instructor || 'د. أحمد محمد'}
      </div>

      {course?.schedule && Array.isArray(course.schedule) && (
        <div className="schedule-info">
          <div className="schedule-title">
            <span><strong>مواعيد المحاضرات</strong></span> 
          </div>
          {course.schedule.map((s, index) => (
            <div key={index} className="schedule-item">
              <span className="schedule-day">{s?.day || 'غير محدد'}</span>
              <span className="schedule-time">{s?.time || 'غير محدد'}</span>
              <span className="schedule-location">
                <span></span> {s?.location || 'قاعة 101'}
              </span>
            </div>
          ))}
        </div>
      )}

        {/* رسالة توضيحية إذا كانت المادة غير متاحة للتسجيل */}
            {!course.canRegister && !isSelected && (
                <div className="prerequisite-warning">
                    <span></span>
                    {!course.prerequisitesMet && " لم تستوفِ المتطلبات السابقة لهذه المادة."}
                    {course.prerequisitesMet && !course.hasCapacity && " السعة ممتلئة لهذه المادة."}
                </div>
            )}

      <div className="course-actions">
        {isSelected ? (
          <button className="btn-remove" onClick={() => onSelect(course)}>
            <span>Delete</span> 
          </button>
        ) : (
          <button
            className="btn-select"
            onClick={() => onSelect(course)}
            disabled={!canSelect || totalHours + (course?.hours || 0) > 18}
          >
            <span>Select</span> 
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;