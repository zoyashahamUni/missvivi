import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setRegisterData({
      ...registerData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      localStorage.setItem("userId", data._id);
      localStorage.setItem("fullName", data.fullName);

      alert("ההרשמה הצליחה!");
      navigate("/attractions");
    } catch (error) {
      console.log("Register request failed:", error.message);
      alert("אירעה שגיאה בהרשמה");
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-container">
        <div className="page-header">
          <p className="eyebrow">Miss Vivi</p>
          <h1>הרשמה</h1>
          <p>צרו משתמש חדש כדי לחפש אטרקציות ולבצע הזמנות.</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>משתמש חדש</h2>

          <label>
            שם מלא
            <input
              type="text"
              name="fullName"
              value={registerData.fullName}
              onChange={handleChange}
              placeholder="לדוגמה: Zoya Shaham"
            />
          </label>

          <label>
            שם משתמש
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleChange}
              placeholder="בחרו שם משתמש"
            />
          </label>

          <label>
            סיסמה
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              placeholder="לפחות 4 תווים"
            />
          </label>

          <button type="submit" className="primary-button">
            הרשמה
          </button>
        </form>

        <div className="back-link">
          <Link to="/login">כבר יש לך משתמש? התחברות</Link>
          <br />
          <Link to="/">חזרה לדף הבית</Link>
        </div>
      </section>
    </main>
  );
}

export default Register;