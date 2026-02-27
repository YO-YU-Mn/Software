// import logo from './logo.svg';
import './App.css';
import {  Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import NotFound from './NotFound';
import Dashboard from './Dashboard';
import Login from './Login'; 
import ProtectedRoute from './ProtectedRoute';
function App() {
  return (
    // <BrowserRouter>
      <div className="App">
        <Navbar />
        {/* These components are swapped based on the URL */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
         <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
          {/* The Wildcard Route (*): Catches any URL not matched above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    // </BrowserRouter>
  );
}

export default App;
