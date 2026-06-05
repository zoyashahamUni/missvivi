import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ActivityDetails() {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(
          `http://localhost:3001/api/activities/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error);
          return;
        }

        setActivity(data);
      } catch (error) {
        console.log("Failed to fetch activity:", error.message);
        alert("אירעה שגיאה בטעינת פרטי הפעילות");
      }
    }

    fetchActivity();
  }, [id]);

  if (!activity) {
    return (
      <main className="page">
        <section className="content-container">
          <p>טוען פרטי פעילות...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page details-page">
      <section className="content-container">
        <div className="details-card">
          <p className="eyebrow">פרטי פעילות</p>

          <h1>{activity.name}</h1>

          <p className="details-meta">
            מתאים לגילאי {activity.minAge}–{activity.maxAge}
          </p>

          <p>משך הפעילות: {activity.durationMinutes} דקות</p>
          <p>מספר משתתפים מקסימלי: {activity.maxParticipants}</p>
          <p>מחיר למשתתף: ₪{activity.pricePerParticipant}</p>

          {activity.attractionId && (
            <p>
              אטרקציה: {activity.attractionId.name} ·{" "}
              {activity.attractionId.city}
            </p>
          )}

          <div className="hero-actions">
            <Link
              className="primary-button"
              to={`/booking?activityId=${activity._id}&attractionId=${activity.attractionId._id}`}
            >
              הזמן עכשיו
            </Link>

            <Link
              className="secondary-button"
              to={`/attractions/${activity.attractionId._id}`}
            >
              חזרה לאטרקציה
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ActivityDetails;