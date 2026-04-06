import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token'); //go to local storage if there is token go to another page
    //else 
    
    // لو مفيش token → ارجعه على Login
    if(!token) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
