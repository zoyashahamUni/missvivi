import { useNavigate } from "react-router-dom";

function UserStatus() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

let user = null;

try {
  user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  user = null;
}

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="user-status">
        <span>⚪ לא מחוברת</span>
      </div>
    );
  }

  return (
    <div className="user-status">
      <span>🟢 {user.fullName || user.username}</span>
      <button type="button" onClick={handleLogout}>
        התנתקות
      </button>
    </div>
  );
}

export default UserStatus;