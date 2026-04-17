import { useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import toast from 'react-hot-toast';

export function BulkCourseImportPage({ setPage }) {
  const { theme, isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('يرجى اختيار ملف Excel فقط (.xls أو .xlsx)');
        return;
      }

      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        return;
      }

      const response = await axios.post('http://localhost:9000/courses/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });

      setResults(response.data);
      if (response.data.success) {
        toast.success(`تم إضافة ${response.data.successCount} مادة بنجاح`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('حدث خطأ أثناء رفع الملف');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const instructions = `
قالب Excel للمواد:

الأعمدة المطلوبة:
- course_id: معرف المادة (مثل CSE101)
- title: اسم المادة
- credits: عدد الساعات
- instructor: اسم المحاضر
- department: القسم
- level: المستوى (1-4)
- semester: الترم (1 أو 2)
- capacity: السعة الكلية للمادة
- prerequisites: مواد سابقة مفصولة بفواصل (اختياري)
- schedule: صيغة الجدول: يوم|وقت|موقع مفصول بفواصل منقوطة (اختياري)

مثال على البيانات:
course_id,title,credits,instructor,department,level,semester,capacity,prerequisites,schedule
CSE101,Programming 1,3,Dr. Ali,CS,1,1,35,,Sunday|08:00-10:00|Room 101;Tuesday|10:00-12:00|Room 102
PHY201,Mechanics,4,Dr. Samir,Physics,2,1,40,CSE101,Monday|10:00-12:00|Room 205
`;

    const blob = new Blob([instructions], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course_import_template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('تم تحميل ملف التعليمات');
  };

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setPage('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: theme.accent,
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← العودة للوحة التحكم
        </button>
        <h1 style={{ color: theme.text, margin: '0', fontSize: '2rem', fontWeight: '600' }}>
          رفع المواد بالجملة
        </h1>
        <p style={{ color: theme.muted, margin: '0.5rem 0 0 0' }}>
          رفع ملف Excel يحتوي على بيانات المواد لإضافتها إلى النظام
        </p>
      </div>

      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ color: theme.text, margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
          تعليمات الاستخدام
        </h3>
        <div style={{ color: theme.muted, lineHeight: '1.6' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>أعمدة الملف:</strong>
            <ul style={{ marginRight: '1rem', marginTop: '0.5rem' }}>
              <li><code>course_id</code>: معرف المادة</li>
              <li><code>title</code>: اسم المادة</li>
              <li><code>credits</code>: عدد الساعات</li>
              <li><code>instructor</code>: اسم المحاضر</li>
              <li><code>department</code>: القسم</li>
              <li><code>level</code>: المستوى (1-4)</li>
              <li><code>semester</code>: الترم (1 أو 2)</li>
              <li><code>capacity</code>: السعة</li>
              <li><code>prerequisites</code>: قائمة مواد مفصولة بفواصل (اختياري)</li>
              <li><code>schedule</code>: يوم|وقت|مكان مفصول بفواصل منقوطة (اختياري)</li>
            </ul>
          </div>
          <div>
            <strong>ملاحظات مهمة:</strong>
            <ul style={{ marginRight: '1rem', marginTop: '0.5rem' }}>
              <li>يجب أن يكون الملف بصيغة Excel (.xls أو .xlsx)</li>
              <li>الصف الأول يجب أن يحتوي على عناوين الأعمدة</li>
              <li>الحقول غير المطابقة سيتم رفضها مع رسائل خطأ مفصلة</li>
              <li>سيتم تخطي المواد ذات المعرفات المكررة</li>
            </ul>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          style={{
            background: theme.accent,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}
        >
          تحميل ملف التعليمات والأمثلة
        </button>
      </div>

      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="course-file-upload"
            style={{
              display: 'inline-block',
              background: isDark ? `${theme.accent}20` : `${theme.accent}10`,
              border: `2px dashed ${theme.accent}`,
              borderRadius: '8px',
              padding: '2rem',
              cursor: 'pointer',
              textAlign: 'center',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
            <div style={{ color: theme.text, fontWeight: '500', marginBottom: '0.5rem' }}>
              {file ? file.name : 'اختر ملف Excel'}
            </div>
            <div style={{ color: theme.muted, fontSize: '0.9rem' }}>
              أو اسحب الملف وأفلت هنا
            </div>
          </label>
          <input
            id="course-file-upload"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              background: file && !uploading ? theme.accent : theme.border,
              color: file && !uploading ? 'white' : theme.muted,
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 2rem',
              cursor: file && !uploading ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {uploading ? '⏳' : '📤'} {uploading ? 'جاري الرفع...' : 'رفع الملف'}
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: `1px solid ${theme.border}`,
              color: theme.text,
              borderRadius: '8px',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {results && (
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '2rem'
          }}
        >
          <h3 style={{ color: theme.text, margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>
            نتائج الرفع
          </h3>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.green }}>
                {results.successCount}
              </div>
              <div style={{ color: theme.muted, fontSize: '0.9rem' }}>تمت إضافتها بنجاح</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.red }}>
                {results.errors?.length || 0}
              </div>
              <div style={{ color: theme.muted, fontSize: '0.9rem' }}>أخطاء</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.text }}>
                {results.total}
              </div>
              <div style={{ color: theme.muted, fontSize: '0.9rem' }}>إجمالي السجلات</div>
            </div>
          </div>

          {results.errors && results.errors.length > 0 && (
            <div>
              <h4 style={{ color: theme.red, margin: '0 0 1rem 0' }}>الأخطاء الموجودة:</h4>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                background: isDark ? `${theme.red}10` : `${theme.red}05`,
                border: `1px solid ${theme.red}30`,
                borderRadius: '8px',
                padding: '1rem'
              }}>
                {results.errors.map((error, index) => (
                  <div
                    key={index}
                    style={{
                      color: theme.red,
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      background: isDark ? `${theme.red}15` : `${theme.red}10`,
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <strong>الصف {error.row}:</strong> {error.errors.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
