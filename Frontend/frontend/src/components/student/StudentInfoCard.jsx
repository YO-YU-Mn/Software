function StudentInfoCard({ student }) {
  return (
    <div className="student-card info-card">
      <h2>البيانات الأكاديمية</h2>

      <div className="student-grid">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong> code:</strong> {student.code}</p>
        <p><strong> level:</strong> {student.level}</p>
        <p><strong>Department:</strong> {student.specialization}</p>
        <p><strong> graduation year:</strong> {student.gradute_year}</p>
        <p><strong>GPA:</strong> {student.GPA}</p>
        <p><strong>uni:</strong> {student.university}</p>
        <p><strong>semester</strong>{student.semester}</p>
      </div>
    </div>
  );
}

export default StudentInfoCard;