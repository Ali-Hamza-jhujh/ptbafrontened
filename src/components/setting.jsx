import React, { useState, useEffect } from "react";
import "../App.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.style.transition = "background-color 0.5s ease, color 0.5s ease";
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="settings-container">
      <h1>Website Settings</h1>

      <div className="setting-item">
        <label>Theme:</label>
        <button onClick={toggleTheme}>
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
      </div>

      <div className="setting-item">
        <label>Note:</label>
        <span>This setting applies to the whole website and is saved for your next visit!</span>
      </div>
    </div>
  );
};

export default Settings;
