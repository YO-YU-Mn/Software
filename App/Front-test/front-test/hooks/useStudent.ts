import { useState, useEffect } from 'react';
import { fetchStudentProfile } from '../services/student';
import { useAuth } from '../context/AuthContext';

export default function useStudent() {

  const { token } = useAuth();

  const [student, setStudent] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  async function refresh() {

    if (!token) return;

    try {

      setLoading(true);

      const data = await fetchStudentProfile(token);

      setStudent(data);

    } catch (err) {

      console.log('Student Error:', err);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    refresh();

  }, [token]);

  return {
    student,
    refresh,
    loading,
  };
}