import { useState, useEffect } from 'react';

function useStudent() {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        async function getProfile() {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9000/student/profile', {
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