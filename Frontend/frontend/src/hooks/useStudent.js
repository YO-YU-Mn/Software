import { useState, useEffect } from 'react';

function useStudent() {
    const [student, setStudent] = useState(null);

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9000/students/profile', {
            headers: { authorization: token }
        });
        const data = await response.json();
        setStudent(data);
    };

    useEffect(() => {
        getProfile();
    }, []);

    return { student, refreshStudent: getProfile }; 
}

export default useStudent;