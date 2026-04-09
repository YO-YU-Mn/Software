import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';  // هذا مهم جداً
import './style.css';  // تأكد من استيراد style.css هنا أيضاً

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);