import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Attractions() {
    const location = useLocation();

    const [searchData, setSearchData] = useState({
        city: "",
        age: "",
        participants: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        if (!location.state?.restoreSearch) {
            return;
        }

        const savedSearchData = localStorage.getItem("lastSearchData");
        const savedAttractions = localStorage.getItem("lastAttractions");

        if (savedSearchData) {
            setSearchData(JSON.parse(savedSearchData));
        }

        if (savedAttractions) {
            setAttractions(JSON.parse(savedAttractions));
        }
    }, [location.state]);
    function handleChange(event) {
        const { name, value } = event.target;

        setSearchData({
            ...searchData,
            [name]: value,
        });
    }

    async function handleSearch(event) {
        event.preventDefault();
        setIsLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

        try {
            const params = new URLSearchParams(searchData);

            const searchResponse = await fetch(
                `${API_BASE_URL}/api/search-attractions?${params.toString()}`
            );

            const searchResults = await searchResponse.json();

            if (!searchResponse.ok) {
                alert(searchResults.error);
                return;
            }

            if (searchResults.length > 0) {
                setAttractions(searchResults);

                localStorage.setItem("lastSearchData", JSON.stringify(searchData));
                localStorage.setItem("lastAttractions", JSON.stringify(searchResults));

                return;
            }

            const aiResponse = await fetch(
                `${API_BASE_URL}/api/ai/generate-attractions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        city: searchData.city,
                        age: Number(searchData.age),
                    }),
                }
            );

            const aiResults = await aiResponse.json();

            if (!aiResponse.ok) {
                alert(aiResults.error);
                return;
            }

            setAttractions(aiResults);

            localStorage.setItem("lastSearchData", JSON.stringify(searchData));
            localStorage.setItem("lastAttractions", JSON.stringify(aiResults));
        } catch (error) {
            console.log("Search failed:", error.message);
            alert("אירעה שגיאה בחיפוש");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="page attractions-page">
            <section className="content-container">
                <div className="page-header">
                    <p className="eyebrow">חיפוש אטרקציות</p>
                    <h1>בואו נמצא פעילות שמתאימה לילדים</h1>
                    <p>
                        בחרי עיר, גיל ומספר משתתפים — ו־Miss Vivi תציג אטרקציות מתאימות.
                    </p>
                </div>

                <form className="search-card" onSubmit={handleSearch}>
                    <label>
                        עיר
                        <input
                            type="text"
                            name="city"
                            value={searchData.city}
                            onChange={handleChange}
                            placeholder="לדוגמה: תל אביב"
                        />
                    </label>

                    <label>
                        גיל הילד/ה
                        <input
                            type="number"
                            name="age"
                            value={searchData.age}
                            onChange={handleChange}
                            placeholder="לדוגמה: 8"
                        />
                    </label>

                    <label>
                        מספר משתתפים
                        <input
                            type="number"
                            name="participants"
                            value={searchData.participants}
                            onChange={handleChange}
                            placeholder="לדוגמה: 3"
                        />
                    </label>

                    <button type="submit" className="primary-button">
                        חפשי לי אטרקציה
                    </button>
                </form>

                {isLoading && (
                    <div className="loading-card">
                        <h2>Miss Vivi מחפשת מסביבי...</h2>
                        <p>אנחנו בודקות מקומות אמיתיים ומתאימים לילדים. זה יכול לקחת כמה שניות.</p>
                    </div>
                )}

                <div className="results-grid">
                    {attractions.map((attraction) => (
                        <article className="attraction-card" key={attraction._id}>
                            <h2>{attraction.name}</h2>
                            <p>
                                {attraction.city} · {attraction.type}
                            </p>
                            <p>
                                מתאים לגילאי {attraction.minAge}–{attraction.maxAge}
                            </p>
                            <p>{attraction.description}</p>
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
                            <Link className="secondary-button" to={`/attractions/${attraction._id}`}>
                                לפרטי האטרקציה
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="back-link">
                    <Link to="/">חזרה לדף הבית</Link>
                </div>
            </section>
        </main>
    );
}

export default Attractions;