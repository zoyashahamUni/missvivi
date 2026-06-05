import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Booking() {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const activityId = searchParams.get("activityId");
    const attractionId = searchParams.get("attractionId");
    const today = new Date().toISOString().split("T")[0];

    const [bookingData, setBookingData] = useState({
        customerName: localStorage.getItem("fullName") || "",
        visitDate: "",
        participants: "",
        childAge: "",
    });

    const [confirmedBooking, setConfirmedBooking] = useState(null);

    function handleChange(event) {
        const { name, value } = event.target;

        setBookingData({
            ...bookingData,
            [name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const userId = localStorage.getItem("userId");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        if (!userId) {
            navigate("/error", {
                state: {
                    message: "יש להתחבר לאתר לפני ביצוע הזמנה.",
                },
            });
            return;
        }
        const finalBookingData = {
            ...bookingData,
            userId,
            attractionId,
            activityId,
            participants: Number(bookingData.participants),
            childAge: Number(bookingData.childAge),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalBookingData),
            });

            const data = await response.json();

            if (!response.ok) {
                navigate("/error", {
                    state: {
                        message: data.error,
                        returnTo: `/booking?activityId=${activityId}&attractionId=${attractionId}`,
                        returnText: "חזרה לתיקון ההזמנה",
                    },
                });
                return;
            }

            console.log("Booking success:", data);
            setConfirmedBooking(data);
        } catch (error) {
            console.log("Booking failed:", error.message);
            navigate("/error", {
                state: {
                    message: "אירעה שגיאה בשליחת ההזמנה",
                    returnTo: `/booking?activityId=${activityId}&attractionId=${attractionId}`,
                    returnText: "חזרה להזמנה",
                },
            });
        }
    }

    function formatBookingNumber(id) {
        if (!id) {
            return "";
        }

        return `MV-${id.slice(-5).toUpperCase()}`;
    }

    return (
        <main className="page booking-page">
            <section className="content-container">
                <div className="page-header">
                    <p className="eyebrow">הזמנה</p>
                    <h1>כמעט סיימנו — רק פרטי ההזמנה</h1>
                    <p>מלאי את הפרטים ונבדוק אם יש מקום פנוי לפעילות.</p>
                </div>

                <form className="form-card booking-form" onSubmit={handleSubmit}>
                    <label>
                        שם המזמין
                        <input
                            type="text"
                            name="customerName"
                            value={bookingData.customerName}
                            onChange={handleChange}
                            placeholder="שם מלא"
                        />
                    </label>

                    <label>
                        תאריך ביקור
                        <input
                            type="date"
                            name="visitDate"
                            value={bookingData.visitDate}
                            onChange={handleChange}
                            min={today}
                        />
                    </label>

                    <label>
                        מספר משתתפים
                        <input
                            type="number"
                            name="participants"
                            value={bookingData.participants}
                            onChange={handleChange}
                            placeholder="לדוגמה: 3"
                        />
                    </label>

                    <label>
                        גיל הילד/ה
                        <input
                            type="number"
                            name="childAge"
                            value={bookingData.childAge}
                            onChange={handleChange}
                            placeholder="לדוגמה: 8"
                        />
                    </label>

                    <button type="submit" className="primary-button">
                        שלח הזמנה
                    </button>
                </form>

                {confirmedBooking && (
                    <div className="confirmation-card">
                        <h2>ההזמנה אושרה 🎉</h2>
                        <p>מספר הזמנה: {formatBookingNumber(confirmedBooking._id)}</p>                        <p>שם המזמין: {confirmedBooking.customerName}</p>
                        <p>
                            תאריך ביקור:{" "}
                            {new Date(confirmedBooking.visitDate).toLocaleDateString("he-IL")}
                        </p>
                        <p>מספר משתתפים: {confirmedBooking.participants}</p>
                        <p>גיל הילד/ה: {confirmedBooking.childAge}</p>
                        <p>מחיר סופי: ₪{confirmedBooking.totalPrice}</p>
                    </div>
                )}
                <div className="back-link">
                    <Link to="/attractions">חזרה לחיפוש אטרקציות</Link>
                </div>
            </section>
        </main>
    );
}

export default Booking;