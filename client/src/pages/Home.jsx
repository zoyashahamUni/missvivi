import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Miss Vivi — אטרקציות מסביבי</p>

          <h1>מה עושים היום עם הילדים?</h1>

          <p className="hero-text">
            Miss Vivi עוזרת למצוא אטרקציות מתאימות לילדים בגילאי 6–12
            לפי עיר, גיל ומספר משתתפים.
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