function StudentInfoCard({ student }) {
  return (
    <div className="student-card info-card">
      <h2>البيانات الأكاديمية</h2>

      <div className="student-grid">
        <p><strong>الاسم:</strong> {student.name}</p>
        <p><strong>الكود الجامعي:</strong> {student.code}</p>
        <p><strong>السنة الدراسية:</strong> {student.level}</p>
        <p><strong>التخصص:</strong> {student.specialization}</p>
        <p><strong>سنة التخرج:</strong> {student.gradute_year}</p>
        <p><strong>GPA:</strong> {student.GPA}</p>
        <p><strong>الكلية:</strong> {student.university}</p>
        <p><strong>semester</strong>{student.semester}</p>
      </div>
    </div>
  );
}

export default StudentInfoCard;