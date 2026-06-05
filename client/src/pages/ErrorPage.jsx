import { Link, useLocation } from "react-router-dom";

function ErrorPage() {
  const location = useLocation();

  const message =
    location.state?.message || "אירעה שגיאה לא צפויה. נסו שוב.";
  const returnTo = location.state?.returnTo || "/attractions";
  const returnText = location.state?.returnText || "חזרה לחיפוש אטרקציות";

  return (
    <main className="page error-page">
      <section className="content-container">
        <div className="error-card">
          <p className="eyebrow">Miss Vivi</p>

          <h1>לא ניתן להשלים את הפעולה</h1>

          <p>{message}</p>

          <div className="hero-actions">
            <Link
              className="primary-button"
              to={returnTo}
              state={{
                afterLoginReturnTo: location.state?.afterLoginReturnTo,
              }}
            >
              {returnText}
            </Link>

            <Link className="secondary-button" to="/">
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ErrorPage;