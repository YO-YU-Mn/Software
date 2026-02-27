import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css' ;
function Contact() {
  return (
  <div>
       <h1>📧 Contact</h1>
        <p>Contact us at: 202327308@stud.cu.edu.eg</p>
        <div>Phone: +20 1113082622 </div>
      <div style={{ marginTop: '20px' , display: 'flex', flexDirection: 'column', width: 'fit-content',marginLeft: 'auto', marginRight: 'auto' }}>
       <Link to ="/" className="modern-button primary" style={{ textDecoration: 'none' }}>Home</Link><br />
        <Link to="/about" className="modern-button secondary" style={{ textDecoration: 'none' }}>about</Link><br />
         <Link to="/Dashboard" className="modern-button secondary" style={{ textDecoration: 'none' }}>dashboard</Link>
      </div>
  </div>
  );
}

export default Contact;
