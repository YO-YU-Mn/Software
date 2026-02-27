import React, { useState, useEffect } from 'react';
import './Dashboard.css' ;
import './Contact.css' ;

// API configuration - update ports based on your backend servers
const STUDENT_API = 'http://localhost:7000'; // StudentApp
const COURSE_API = 'http://localhost:7100'; // CourseApp
// const USER_API = 'http://localhost:8000'; // app.js

// Fetch functions
const fetchStudents = async () => {
  try {
    const response = await fetch(`${STUDENT_API}/students`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

const fetchCourses = async () => {
  try {
    const response = await fetch(`${COURSE_API}/courses`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

const addStudent = async (studentData) => {
  try {
    const response = await fetch(`${STUDENT_API}/addstudent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add student');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const addCourse = async (courseData) => {
  try {
    const response = await fetch(`${COURSE_API}/addcourse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add course');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({
    student: false,
    course: false,
  });

  // Form states
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    author: '',
    hours: '',
    stock: '',
  });

  useEffect(() => {loadData();}, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check backend connectivity
      const studentCheck = await fetch(`${STUDENT_API}/`, { method: 'HEAD' }).catch(() => null);
      const courseCheck = await fetch(`${COURSE_API}/`, { method: 'HEAD' }).catch(() => null);
      
      setBackendStatus({
        student: !!studentCheck,
        course: !!courseCheck,
      });

      const [studentsData, coursesData] = await Promise.all([
        fetchStudents(),
        fetchCourses(),
      ]);
      
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      setError(err.message);
      setStudents([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.fullName || !studentForm.email || !studentForm.password) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      await addStudent(studentForm);
      setStudentForm({ fullName: '', email: '', password: '', phone: '' });
      alert('✅ Student added successfully!');
      loadData();
    } catch (err) {
      alert(' Error: ' + err.message);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title) {
      alert('Please enter a course title');
      return;
    }
    try {
      await addCourse(courseForm);
      setCourseForm({
        title: '',
        description: '',
        author: '',
        hours: '',
        stock: '',
      });
      alert('✅ Course added successfully!');
      loadData();
    } catch (err) {
      alert(' Error: ' + err.message);
    }
  };
  
      const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
      };

  if (loading) return <p style={{ padding: '20px' }}>⏳ Loading...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📚 Dashboard - Student & Course Management</h1>

      {/* Backend Status */}
      <div style={{  marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>🔌 Backend Status</h3>
        <p>
          StudentApp (7000): <span style={{ color: backendStatus.student ? 'green' : 'red' }}>
            {backendStatus.student ? '✅ Connected' : '❌ Not Connected'}
          </span>
        </p>
        <p>
          CourseApp (7100): <span style={{ color: backendStatus.course ? 'green' : 'red' }}>
            {backendStatus.course ? '✅ Connected' : '❌ Not Connected'}
          </span>
        </p>
        {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Left: Students */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h2>👥 Students ({students.length})</h2>
          {students.length === 0 ? (
            <p style={{ color: '#666' }}>No students yet. Add one below!</p>
          ) : (
            <ul>
              {students.map((student) => (
                <li key={student._id} style={{  marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '3px'}}>
                  <strong>{student.fullName}</strong>
                  <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                    📧 {student.email}
                  </p>
                  {student.courses && student.courses.length > 0 && (
                    <div style={{ marginLeft: '15px', fontSize: '0.9em' }}>
                      <strong>Courses:</strong>
                      <ul>
                        {student.courses.map((course) => (
                          <li key={course._id}>📖 {course.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <hr />
          <h3>➕ Add New Student</h3>
          <form onSubmit={handleAddStudent}>

  {/* Full Name */}
  <div className="floating-group">
    <input
      type="text"
      className="floating-input"
      placeholder=" "
      value={studentForm.fullName}
      onChange={(e) =>
        setStudentForm({ ...studentForm, fullName: e.target.value })
      }
      required
    />
    <label className="floating-label">Full Name *</label>
  </div>

  {/* Email */}
  <div className="floating-group">
    <input
      type="email"
      className="floating-input"
      placeholder=" "
      value={studentForm.email}
      onChange={(e) =>
        setStudentForm({ ...studentForm, email: e.target.value })
      }
      required
    />
    <label className="floating-label">Email *</label>
  </div>

  {/* Password */}
  <div className="floating-group">
    <input
      type={showPassword ? "text" : "password"}
      className="floating-input"
      placeholder=" "
      value={studentForm.password}
      onChange={(e) =>
        setStudentForm({ ...studentForm, password: e.target.value })
      }
      required
    />
    <label className="floating-label">Password *</label>

    {/* زر Show/Hide */}
    <span className="password-toggle" onClick={toggleShowPassword}>
      {showPassword ? "Hide" : "Show"}
    </span>
  </div>

  {/* Phone */}
  <div className="floating-group">
    <input
      type="tel"
      className="floating-input"
      placeholder=" "
      value={studentForm.phone}
      onChange={(e) =>
        setStudentForm({ ...studentForm, phone: e.target.value })
      }
    />
    <label className="floating-label">Phone (optional)</label>
  </div>

  <button
    type="submit"
    // style={{
    //   width: "100%",
    //   padding: "10px",
    //   backgroundColor: "#4CAF50",
    //   color: "white",
    //   border: "none",
    //   borderRadius: "5px",
    //   cursor: "pointer",
    // }}
    className='modern-button2 primary'
  >
    Add Student
  </button>
</form>

        </div>

        {/* Right: Courses */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h2>📖 Courses ({courses.length})</h2>
          {courses.length === 0 ? (
            <p style={{ color: '#666' }}>No courses yet. Add one below!</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course._id} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '3px' }}>
                  <strong>{course.title}</strong>
                  <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                    ⏱️ {course.hours || 'N/A'} hours | 📚 Stock: {course.stock || 'N/A'}
                  </p>  
                  {course.description && (
                    <p style={{ margin: '5px 0', fontSize: '0.85em' }}>{course.description}</p>
                  )}
                  {course.author && (
                    <p style={{ margin: '5px 0', fontSize: '0.85em', color: '#999' }}>
                      By: {course.author}
                    </p>
                  )}
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div style={{ marginLeft: '10px', marginTop: '8px', fontSize: '0.9em' }}>
                      <strong>Prerequisites:</strong>
                      <ul style={{ marginTop: '6px' }}>
                        {course.prerequisites.map((p, idx) => (
                          <li key={p.title ? p.title : idx} style={{ fontSize: '0.9em' }}>
                            📌 {typeof p === 'string' ? p : (p.title || JSON.stringify(p))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <hr />
          <h3>➕ Add New Course</h3>
          <form onSubmit={handleAddCourse}>

  {/* Course Title */}
  <div className="floating-group">
    <input
      type="text"
      className="floating-input"
      placeholder=" "
      value={courseForm.title}
      onChange={(e) =>
        setCourseForm({ ...courseForm, title: e.target.value })
      }
      required
    />
    <label className="floating-label">Course Title *</label>
  </div>

  {/* Description */}
  <div className="floating-group">
    <input
      type="text"
      className="floating-input"
      placeholder=" "
      value={courseForm.description}
      onChange={(e) =>
        setCourseForm({ ...courseForm, description: e.target.value })
      }
    />
    <label className="floating-label">Description</label>
  </div>

  {/* Author */}
  <div className="floating-group">
    <input
      type="text"
      className="floating-input"
      placeholder=" "
      value={courseForm.author}
      onChange={(e) =>
        setCourseForm({ ...courseForm, author: e.target.value })
      }
    />
    <label className="floating-label">Author</label>
  </div>

  {/* Hours */}
  <div className="floating-group">
    <input
      type="number"
      className="floating-input"
      placeholder=" "
      value={courseForm.hours}
      onChange={(e) =>
        setCourseForm({ ...courseForm, hours: e.target.value })
      }
    />
    <label className="floating-label">Hours</label>
  </div>

  {/* Prerequisites */}
  <div className="floating-group">
    <input
      type="text"
      className="floating-input"
      placeholder=" "
      value={courseForm.prerequisites}
      onChange={(e) =>
        setCourseForm({ ...courseForm, prerequisites: e.target.value })
      }
    />
    <label className="floating-label">Prerequisites</label>
  </div>

  {/* Stock */}
  <div className="floating-group">
    <input
      type="number"
      className="floating-input"
      placeholder=" "
      value={courseForm.stock}
      onChange={(e) =>
        setCourseForm({ ...courseForm, stock: e.target.value })
      }
    />
    <label className="floating-label">Stock</label>
  </div>

  <button
    type="submit"
    style={{
    //   width: "100%",
    //   padding: "10px",
    //   backgroundColor: "#2196F3",
    //   color: "white",
    //   border: "none",
    //   borderRadius: "5px",
    //   cursor: "pointer",
    }}
    className='modern-button2 primary'
    
  >
    Add Course
  </button>
</form>

        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          💡 <strong>Tip:</strong> Make sure your backend servers are running:
          <br />
          - StudentApp on port 7000: <code>npm run student</code>
          <br />
          - CourseApp on port 7100: <code>npm run courses</code>
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
