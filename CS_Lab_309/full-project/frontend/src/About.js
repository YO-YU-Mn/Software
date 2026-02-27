import React from 'react';
import './Contact.css' ;
import { Link } from 'react-router-dom';

function About() {
  return (
    <div style={{ marginTop: '20px' , display: 'flex', flexDirection: 'column', width: 'fit-content',marginLeft: 'auto', marginRight: 'auto' }}>
      <h1>ℹ️ About</h1>
      <p>This is a student and course management system.</p>
      <Link to="/"  className="modern-button primary" style={{ textDecoration: 'none' }} >Home</Link><br />
            <Link to="/Contact" className="modern-button secondary" style={{ textDecoration: 'none' }}>contact</Link><br />
            <Link to="/Dashboard" className="modern-button secondary" style={{ textDecoration: 'none' }}>dashboard</Link>
    </div>
  );
}

export default About;
