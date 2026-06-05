import { Link } from "react-router-dom";
import missViviLogo from "../assets/miss-vivi-logo.png";

function Home() {
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-content">
  <div className="brand-row">
  <img className="brand-logo" src={missViviLogo} alt="Miss Vivi logo" />
  <p className="eyebrow">Miss Vivi — אטרקציות מסביבי</p>
</div>

          <h1>מה עושים היום עם הילדים?</h1>

          <p className="hero-text">
            Miss Vivi מחפשת קודם אטרקציות שכבר שמורות במערכת. אם לא נמצאות
            תוצאות מתאימות, היא נעזרת ב־AI כדי למצוא אטרקציות אמיתיות עם מקור
            וקישור לאתר.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/attractions">
              חפשו אטרקציה
            </Link>

            <Link className="secondary-button" to="/login">
              התחברות
            </Link>

            <Link className="secondary-button" to="/register">
              הרשמה
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h2>חיפוש פשוט ומהיר</h2>
          <p>
            השם Miss Vivi נולד מהרעיון של “מסביבי” — למצוא בקלות מקומות
            ופעילויות שנמצאים סביבכם ומתאימים לגיל ולצרכים שלכם.
          </p>
          <p>בחרו עיר, גיל ומספר משתתפים — וקבלו רעיונות שמתאימים לילדים.</p>

          <ul>
            <li>מתאים למשפחות</li>
            <li>פעילויות לפי גיל</li>
            <li>הזמנה פשוטה וברורה</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Home;