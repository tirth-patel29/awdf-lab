import { Link } from "react-router-dom";

function Notfound() {
  return (
    <main>
      <h1>404</h1>
      <h2>Page Not Found</h2>

      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/">Go Back Home</Link>
    </main>
  );
}

export default Notfound;