// useStudent.js — React Native conversion
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../config';

function useStudent() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/students/profile`, {
          headers: { authorization: token },
        });
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
      }
    }
    getProfile();
  }, []);

  return student;
}

export default useStudent;