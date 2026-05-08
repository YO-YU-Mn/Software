import { useState, useEffect } from 'react';

function useStudent() {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        async function getProfile() {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/students/profile`, {
                headers: { authorization: token }
            });
            const data = await response.json();
            setStudent(data);
        }
        getProfile();
    }, []);
    
    return student;
}

export default useStudent;