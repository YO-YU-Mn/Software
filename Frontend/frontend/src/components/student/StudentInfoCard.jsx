function StudentInfoCard({ student }) {
  return (
    <div className="student-card info-card">
      <h2>البيانات الأكاديمية</h2>

      <div className="student-grid">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong> code:</strong> {student.code}</p>
        <p><strong> level:</strong> {student.level}</p>
        <p><strong>Department:</strong> {student.specialization}</p>
       
        <p><strong>GPA:</strong> {student.GPA}</p>
        
        <p><strong>semester</strong>{student.semester}</p>
        <p><strong>current Courses</strong>{student.currentCourses}</p>
        <p><strong>completed Courses</strong>{student.completedCourses}</p>

      </div>
    </div>
  );
}

export default StudentInfoCard;