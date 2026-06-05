import { Link } from "react-router-dom";

function HomeButton() {
  return (
    <Link className="home-button" to="/" aria-label="חזרה לדף הבית">
      🏠
    </Link>
  );
}

export default HomeButton;