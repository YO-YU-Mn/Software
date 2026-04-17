import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export function AddStudentPage({ onBack }) {
  const { theme } = useTheme();
  const G = `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`;

  const [tab, setTab] = useState("register");
  
  const [regForm, setRegForm] = useState({ code: "", password: "", name: "", email: "", specialization: "", level: "", semester: "", phone: "" });
  const [enrollForm, setEnrollForm] = useState({ studentCode: "", courseId: "" });
  const [foundStudent, setFoundStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // حالات رفع الملف
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // قائمة التخصصات الثابتة
  const specializations = ["CS", "Physics", "Chem", "Math", "Bio"];

  // جلب جميع الكورسات (للتسجيل)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/courses/allcourses', {
          headers: { Authorization: token }
        });
        setCourses(res.data);
      } catch (err) {
        toast.error('فشل تحميل الكورسات');
      }
    };
    fetchCourses();
  }, []);

  // جلب آخر الطلاب المضافين
  const fetchRecentStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:9000/students/all', {
        headers: { Authorization: token }
      });
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
      setRecentStudents(sorted);
    } catch (err) {
      toast.error('فشل تحميل الطلاب');
    }
  };

  useEffect(() => {
    fetchRecentStudents();
  }, []);

  // البحث عن طالب بالكود
  const searchStudent = async (code) => {
    if (!code) {
      setFoundStudent(null);
      setStudentCourses([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:9000/students/student/${code}`, {
        headers: { Authorization: token }
      });
      if (res.data.success === false) {
        setFoundStudent(null);
        setStudentCourses([]);
        toast.error('الطالب غير موجود');
      } else {
        setFoundStudent(res.data);
        const enrolledDetails = courses.filter(c => res.data.currentCourses?.includes(c.course_id));
        setStudentCourses(enrolledDetails);
      }
    } catch (err) {
      toast.error('خطأ في البحث');
    }
  };

  const handleRegister = async () => {
    if (!regForm.code || !regForm.password || !regForm.name || !regForm.specialization || !regForm.level || !regForm.semester) {
      toast.error('جميع الحقول المطلوبة يجب ملؤها');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...regForm,
        level: Number(regForm.level),
        semester: Number(regForm.semester),
        password: Number(regForm.password)
      };
      const res = await axios.post('http://localhost:9000/students/addstudent', payload, {
        headers: { Authorization: token }
      });
      if (res.data.success) {
        toast.success('تم إضافة الطالب بنجاح');
        setRegForm({ code: "", password: "", name: "", email: "", specialization: "", level: "", semester: "", phone: "" });
        fetchRecentStudents();
      } else {
        toast.error(res.data.message || 'فشل الإضافة');
      }
    } catch (err) {
      toast.error('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!enrollForm.studentCode || !enrollForm.courseId) {
      toast.error('اختر الطالب والمادة');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:9000/courses/admin/register/${enrollForm.studentCode}`, {
        course_id: enrollForm.courseId
      }, {
        headers: { Authorization: token }
      });
      toast.success('تم تسجيل الطالب في المادة');

      const res = await axios.get(`http://localhost:9000/students/student/${enrollForm.studentCode}`, {
        headers: { Authorization: token }
      });
      setFoundStudent(res.data);
      const enrolledDetails = courses.filter(c => res.data.currentCourses?.includes(c.course_id));
      setStudentCourses(enrolledDetails);
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  // دالة تحميل النموذج (Template)
  const downloadTemplate = () => {
    const headers = [
      "code",
      "password",
      "name",
      "email",
      "phone",
      "specialization",
      "level",
      "semester"
    ];
    const sampleRow = [];
    const data = [headers, sampleRow];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StudentsTemplate");
    XLSX.writeFile(wb, "students_template.xlsx");
    toast.success("تم تحميل النموذج بنجاح");
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }
    setUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:9000/bulkImport/upload', formData, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(res.data);
      toast.success(`تم إضافة ${res.data.successCount} طالب بنجاح`);
      fetchRecentStudents();
      setFile(null);
      const fileInput = document.getElementById('excel-file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
  console.error('Full error:', err);
  if (err.response) {
    console.log('Response data:', err.response.data);
    console.log('Response status:', err.response.status);
    toast.error(`فشل رفع الملف: ${err.response.data.error || err.message}`);
  } else {
    toast.error('فشل رفع الملف');
  }
} finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-7 flex-1 overflow-y-auto" style={{ background: theme.bg }}>
      <button onClick={onBack} className="btn-back" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>← Back</button>
      <h1 className="m-0 mb-5 text-3xl font-extrabold" style={{ color: theme.white }}>Student Registration</h1>

      <div className="flex gap-0 mb-6" style={{ background: theme.card, borderRadius: 10, border: `1px solid ${theme.border}`, width: "fit-content" }}>
        {[
          ["register", " New Student"],
          ["enroll", " Manage Enrollments"],
          ["addfile", " Add File"]
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              setUploadResult(null);
              setFile(null);
            }}
            className="btn"
            style={{
              padding: "10px 26px",
              borderRadius: 9,
              background: tab === id ? G : "transparent",
              color: tab === id ? "#fff" : theme.muted
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "register" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Student Information</div>
            <div className="flex flex-col gap-3">
              <input placeholder="Code *" value={regForm.code} onChange={e => setRegForm({...regForm, code: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              <input type="password" placeholder="Password *" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              <input placeholder="Full Name *" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              <input placeholder="Email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              <input placeholder="Phone" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              <div className="grid grid-cols-2 gap-2">
                <select value={regForm.specialization} onChange={e => setRegForm({...regForm, specialization: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}>
                  <option value="">Specialization *</option>
                  {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
                <input type="number" placeholder="Level *" value={regForm.level} onChange={e => setRegForm({...regForm, level: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              </div>
              <input type="number" placeholder="Semester *" value={regForm.semester} onChange={e => setRegForm({...regForm, semester: e.target.value})} className="input-field" style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }} />
              <button onClick={handleRegister} disabled={loading} className="btn btn-primary mt-1" style={{ background: G, padding: 13 }}> Register Student</button>
            </div>
          </div>

          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Recently Registered</div>
            {recentStudents.length === 0 ? (
              <p className="text-center py-9" style={{ color: theme.muted, fontSize: 13 }}>No students yet</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {recentStudents.map(s => (
                  <div key={s.code} className="flex justify-between items-center p-3 rounded" style={{ background: theme.surface }}>
                    <div>
                      <div className="font-semibold" style={{ color: theme.text, fontSize: 13 }}>{s.name}</div>
                      <div style={{ color: theme.muted, fontSize: 11, marginTop: 2 }}>{s.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="mono px-2 py-1 rounded mb-1" style={{ fontSize: 11, color: theme.accent, background: `${theme.accent}15` }}>{s.code}</div>
                      <div style={{ fontSize: 10, color: theme.muted }}>{s.specialization} · Level {s.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "enroll" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <h3 className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Search Student</h3>
            <input
              placeholder="Enter student code"
              value={enrollForm.studentCode}
              onChange={e => {
                setEnrollForm({...enrollForm, studentCode: e.target.value});
                searchStudent(e.target.value);
              }}
              className="input-field"
              style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
            />
            {foundStudent && (
              <div className="mt-4 p-3 rounded" style={{ background: theme.surface }}>
                <p><strong>Name:</strong> {foundStudent.name}</p>
                <p><strong>Specialization:</strong> {foundStudent.specialization}</p>
                <p><strong>Level:</strong> {foundStudent.level}</p>
              </div>
            )}
            <h3 className="font-bold mt-4 mb-2" style={{ color: theme.white, fontSize: 15 }}>Select Course</h3>
            <select
              value={enrollForm.courseId}
              onChange={e => setEnrollForm({...enrollForm, courseId: e.target.value})}
              className="input-field"
              style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text }}
            >
              <option value="">Choose course</option>
              {courses.map(c => (
                <option key={c._id} value={c.course_id}>
                  {c.title} ({c.course_id}) - {c.instructor} [{c.enrolledStudents}/{c.capacity}]
                </option>
              ))}
            </select>
            <button onClick={handleEnroll} disabled={loading} className="btn btn-primary mt-4" style={{ background: G, padding: 12 }}>Enroll</button>
          </div>
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <h3 className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Enrolled Courses</h3>
            {studentCourses.length === 0 ? (
              <p style={{ color: theme.muted }}>No courses enrolled</p>
            ) : (
              studentCourses.map(c => (
                <div key={c._id} className="p-2 mb-2 rounded" style={{ background: theme.surface }}>
                  {c.title} ({c.course_id})
                </div>
              ))
            )}
          </div>
        </div>
      )}


      {/* تبويب Add File - رفع ملف إكسل */}
      {tab === "addfile" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>Upload Excel File</div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="input-label" style={{ color: theme.muted }}>Choose Excel file (.xlsx, .xls, .csv)</label>
                <input
                  id="excel-file-input"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={e => setFile(e.target.files[0])}
                  className="input-field"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.text, padding: '8px' }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleFileUpload}
                  disabled={!file || uploading}
                  className="btn btn-primary flex-1"
                  style={{ background: G, padding: '12px' }}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                <button
                  onClick={downloadTemplate}
                  className="btn"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}`, color: theme.accent, padding: '12px' }}
                >
                   Download Template
                </button>
              </div>
              {uploadResult && (
                <div className="mt-4">
                  <p style={{ color: theme.green }}>✅ Successfully added: {uploadResult.successCount} students</p>
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div style={{ color: theme.red, marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      <strong>Errors:</strong>
                      <ul>
                        {uploadResult.errors.map((err, idx) => (
                          <li key={idx}>
                            {typeof err === 'object' ? `Row ${err.row}: ${err.errors.join(', ')}` : err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="font-bold mb-4" style={{ color: theme.white, fontSize: 15 }}>File Format Instructions</div>
            <div style={{ color: theme.muted, fontSize: '13px', lineHeight: 1.6 }}>
              <p>The Excel file should contain the following columns (first row as headers):</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li><strong>code</strong> (required, unique number)</li>
                <li><strong>password</strong> (required, number or string)</li>
                <li><strong>name</strong> (required, full name)</li>
                <li><strong>email</strong> (optional)</li>
                <li><strong>phone</strong> (optional)</li>
                <li><strong>specialization</strong> (required, one of: CS, Physics, Chem, Math, Bio)</li>
                <li><strong>level</strong> (required, number 1-4)</li>
                <li><strong>semester</strong> (required, number 1-2)</li>
              </ul>
              <p className="mt-2">Make sure the file does not contain duplicate codes.</p>
              <p className="mt-2 text-xs">Click "Download Template" to get a ready-to-use Excel file.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}