function StudentInfoCard({ student }) {
  return (
    <div className="student-card info-card">
      <h2>البيانات الأكاديمية</h2>

      <div className="student-grid">
        <p><strong>الاسم:</strong> {student.fullName}</p>
        <p><strong>الرقم الجامعي:</strong> {student.id}</p>
        <p><strong>السنة الدراسية:</strong> {student.year}</p>
        <p><strong>التخصص:</strong> {student.major}</p>
        <p><strong>الفرقة:</strong> {student.level}</p>
        <p><strong>سنة التخرج:</strong> {student.graduationYear}</p>
        <p><strong>GPA:</strong> {student.gpa}</p>
      </div>
    </div>
  );
}

export default StudentInfoCard;