import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      localStorage.setItem("userId", data._id);
      localStorage.setItem("fullName", data.fullName);

      alert("ההתחברות הצליחה!");
      navigate("/attractions");
    } catch (error) {
      console.log("Login request failed:", error.message);
      alert("אירעה שגיאה בהתחברות");
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-container">
        <div className="page-header">
          <p className="eyebrow">Miss Vivi</p>
          <h1>התחברות</h1>
          <p>התחברי כדי להמשיך לחפש אטרקציות ולבצע הזמנות.</p>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>משתמשת קיימת</h2>

          <label>
            שם משתמש
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              placeholder="שם המשתמש שלך"
            />
          </label>

          <label>
            סיסמה
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="הסיסמה שלך"
            />
          </label>

          <button type="submit" className="primary-button">
            התחברות
          </button>
        </form>

        <div className="back-link">
          <Link to="/register">אין לך משתמשת? הרשמה</Link>
          <br />
          <Link to="/">חזרה לדף הבית</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;