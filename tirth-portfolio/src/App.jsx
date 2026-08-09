import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

function App() {
  const skills = [
    "React",
    "JavaScript",
    "C++",
    "HTML & CSS",
    "MySQL",
    "UI/UX",
  ];

  return (
    <>
      <Header name="Tirth Patel" />

      <main>
        <About />

        <Skills skillList={skills} />
      </main>

      <Footer />
    </>
  );
}

export default App;