import ProfilePicture from './ProfilePicture';
import useStudent from '../../hooks/useStudent'; 

function StudentInfoCard() {
  const { student, refreshStudent } = useStudent();

  return (
    <div className="student-card info-card">
      <div className="info-card-header">
        <ProfilePicture 
          currentImageUrl={student?.profilePicture}
          studentCode={student?.code}
          onUploadSuccess={refreshStudent}
        />
        <h2>البيانات الأكاديمية</h2>
      </div>
      <div className="student-grid">
        <div className="info-group">
          <label>name</label>
          <p>{student?.name}</p>
        </div>
        <div className="info-group">
          <label>University Code</label>
          <p>{student?.code}</p>
        </div>
        <div className="info-group">
          <label>Specialization</label>
          <p>{student?.specialization}</p>
        </div>
        <div className="info-group">
          <label>Academic Year</label>
          <p>{student?.level}</p>
        </div>
        <div className="info-group">
          <label>Semester</label>
          <p>{student?.semester}</p>
        </div>
        <div className="info-group">
          <label>GPA</label>
          <p>{student?.GPA}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentInfoCard;