import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <Link className="brand" to="/">Tirth Patel</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>

        {isAuthenticated ? (
          <>
            <span className="user-email">{user?.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
