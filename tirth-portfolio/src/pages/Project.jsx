import { useEffect, useState } from "react";

function Project() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch("https://api.github.com/users/tirth-patel29/repos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }

        return response.json();
      })
      .then((data) => {
        setRepos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main>
        <h1>My Projects</h1>
        <p>Loading projects...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>My Projects</h1>

        <p>Something went wrong: {error}</p>

        <button onClick={fetchRepos}>
          Retry
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>My Projects</h1>

      <input
        type="text"
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="project-list">
        {filteredRepos.map((repo) => (
          <div className="project-card" key={repo.id}>
            <h2>{repo.name}</h2>

            <p>
              {repo.description || "No description available."}
            </p>

            <p>⭐ {repo.stargazers_count} stars</p>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <p>No repositories found.</p>
      )}
    </main>
  );
}

export default Project;