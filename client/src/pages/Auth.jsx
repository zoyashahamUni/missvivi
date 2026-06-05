import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Auth() {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        fullName: "",
        username: "",
        password: "",
    });

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    function handleRegisterChange(event) {
        const { name, value } = event.target;

        setRegisterData({
            ...registerData,
            [name]: value,
        });
    }

    function handleLoginChange(event) {
        const { name, value } = event.target;

        setLoginData({
            ...loginData,
            [name]: value,
        });
    }

    async function handleRegisterSubmit(event) {
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
                console.log("Register error:", data.error);
                alert(data.error);
                return;
            }

            console.log("Register success:", data);
            alert("ההרשמה הצליחה!");

            localStorage.setItem("userId", data._id);
            localStorage.setItem("fullName", data.fullName);
            navigate("/attractions");

        } catch (error) {
            console.log("Register request failed:", error.message);
            alert("אירעה שגיאה בהרשמה");
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Login error:", data.error);
                alert(data.error);
                return;
            }

            console.log("Login success:", data);
            alert("ההתחברות הצליחה!");

            localStorage.setItem("userId", data._id);
            localStorage.setItem("fullName", data.fullName);
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
                    <h1>הרשמה / התחברות</h1>
                    <p>
                        התחברו כדי לחפש אטרקציות, לבחור פעילות ולבצע הזמנה לילדים.
                    </p>
                </div>

                <div className="auth-grid">
                    <form className="form-card" onSubmit={handleRegisterSubmit}>
                        <h2>הרשמה</h2>

                        <label>
                            שם מלא
                            <input
                                type="text"
                                name="fullName"
                                value={registerData.fullName}
                                onChange={handleRegisterChange}
                                placeholder="לדוגמה: Zoya Shaham"
                            />
                        </label>

                        <label>
                            שם משתמש
                            <input
                                type="text"
                                name="username"
                                value={registerData.username}
                                onChange={handleRegisterChange}
                                placeholder="בחרו שם משתמש"
                            />
                        </label>

                        <label>
                            סיסמה
                            <input
                                type="password"
                                name="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                placeholder="לפחות 4 תווים"
                            />
                        </label>

                        <button type="submit" className="primary-button">
                            הרשמה
                        </button>
                    </form>

                    <form className="form-card" onSubmit={handleLoginSubmit}>
                        <h2>התחברות</h2>

                        <label>
                            שם משתמש
                            <input
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                placeholder="שם המשתמש שלך"
                            />
                        </label>

                        <label>
                            סיסמה
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="הסיסמה שלך"
                            />
                        </label>

                        <button type="submit" className="primary-button">
                            התחברות
                        </button>
                    </form>
                </div>

                <div className="back-link">
                    <Link to="/">חזרה לדף הבית</Link>
                </div>
            </section>
        </main>
    );
}

export default Auth;