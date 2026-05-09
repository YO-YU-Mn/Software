// useStudent.js — profile loading + refetch for empty/error states
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import { useAuth } from '@/contexts/AuthContext';

function useStudent() {
  const { refreshKey } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        headers: { authorization: token },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setStudent(data);
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
      setStudent(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshKey]);

  return { student, loading, error, refetch: fetchProfile };
}

export default useStudent;
