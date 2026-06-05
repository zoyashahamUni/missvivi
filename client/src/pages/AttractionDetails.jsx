import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function AttractionDetails() {
    const { id } = useParams();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [attraction, setAttraction] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        async function fetchAttractionDetails() {
            try {
                const attractionResponse = await fetch(
                    `${API_BASE_URL}/api/attractions/${id}`
                );

                const attractionData = await attractionResponse.json();

                if (!attractionResponse.ok) {
                    alert(attractionData.error);
                    return;
                }

                setAttraction(attractionData);

                const activitiesResponse = await fetch(
                    `h${API_BASE_URL}/api/attractions/${id}/activities`
                );

                const activitiesData = await activitiesResponse.json();

                if (!activitiesResponse.ok) {
                    alert(activitiesData.error);
                    return;
                }

                setActivities(activitiesData);
            } catch (error) {
                console.log("Failed to fetch attraction details:", error.message);
                alert("אירעה שגיאה בטעינת פרטי האטרקציה");
            }
        }

        fetchAttractionDetails();
    }, [id]);

    if (!attraction) {
        return (
            <main className="page">
                <section className="content-container">
                    <p>טוען פרטי אטרקציה...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="page details-page">
            <section className="content-container">
                <div className="details-card">
                    <p className="eyebrow">{attraction.type}</p>

                    <h1>{attraction.name}</h1>

                    <p className="details-meta">
                        {attraction.city} · מתאים לגילאי {attraction.minAge}–
                        {attraction.maxAge}
                    </p>

                    <p className="details-description">{attraction.description}</p>
                    {attraction.sourceUrl && (
                        <a
                            className="secondary-button"
                            href={attraction.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            לאתר / מקור
                        </a>
                    )}
                </div>

                <section className="activities-section">
                    <h2>פעילויות באטרקציה</h2>

                    {activities.length === 0 ? (
                        <p>אין עדיין פעילויות לאטרקציה זו.</p>
                    ) : (
                        <div className="results-grid">
                            {activities.map((activity) => (
                                <article className="attraction-card" key={activity._id}>
                                    <h3>{activity.name}</h3>

                                    <p>
                                        מתאים לגילאי {activity.minAge}–{activity.maxAge}
                                    </p>

                                    <p>משך הפעילות: {activity.durationMinutes} דקות</p>

                                    <p>מחיר למשתתף: ₪{activity.pricePerParticipant}</p>

                                    <Link
                                        className="secondary-button"
                                        to={`/activities/${activity._id}`}
                                    >
                                        לפרטי הפעילות
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <div className="back-link">
                    <Link to="/attractions">חזרה לחיפוש אטרקציות</Link>
                </div>
            </section>
        </main>
    );
}

export default AttractionDetails;