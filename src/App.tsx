import { useMemo } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Leadership } from "./components/Leadership";
import { Nav } from "./components/Nav";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";
import { sections } from "./data/content";
import { useActiveSection } from "./hooks/useActiveSection";

export function App() {
  const sectionIds = useMemo(() => sections.map((section) => section.id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav activeSection={activeSection} />
      <main id="main">
        <Hero />
        <Work />
        <Skills />
        <About />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
