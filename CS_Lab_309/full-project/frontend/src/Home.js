import React, { useState } from 'react';

function Home() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:7000/generate-schedule');
      const data = await response.json();

      if (response.ok) {
        setSchedule(data.schedule);
      } else {
        setError(data.message || 'فشل في توليد الجدول');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🏠 الصفحة الرئيسية</h1>
      <p>أهلاً وسهلاً في نظام إدارة الطلاب والمواد الدراسية</p>

      <div style={{ margin: '30px 0' }}>
        <button
          onClick={generateSchedule}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? '⏳ جاري التوليد...' : '📅 توليد جدول دراسي'}
        </button>
      </div>

      {error && (
        <div style={{
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
        }}>
           {error}
        </div>
      )}

      {schedule && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h2>📋 الجدول الدراسي الأسبوعي</h2>
          {schedule.schedule && schedule.schedule.map((day, idx) => (
            <div key={idx} style={{
              backgroundColor: 'white',
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #ddd',
            }}>
              <h3 style={{ color: '#0d6efd', marginBottom: '10px' }}>📅 {day.day}</h3>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#e9ecef' }}>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>⏰ الوقت</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>📚 المادة</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>🏛️ القاعة</th>
                  </tr>
                </thead>
                <tbody>
                  {day.sessions && day.sessions.map((session, sIdx) => (
                    <tr key={sIdx}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{session.time}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: session.course === 'راحة' ? 'bold' : 'normal', color: session.course === 'راحة' ? '#ff6b6b' : '#000' }}>
                        {session.course === 'راحة' ? '☕ ' : '📖 '}{session.course}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{session.room || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
