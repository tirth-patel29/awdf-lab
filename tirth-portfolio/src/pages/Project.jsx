function Project() {
  const projects = [
    {
      name: "ShareJadPi",
      description: "A cross-platform file sharing application.",
    },
    {
      name: "OracleAuth",
      description: "A decentralized identity verification project.",
    },
    {
      name: "Dhanlaxmi Map",
      description: "A bus tracking and location-based project.",
    },
  ];

  return (
    <main>
      <h1>My Projects</h1>

      <div>
        {projects.map((project) => (
          <section key={project.name}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Project;