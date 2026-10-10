import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { BeforeAfter } from "./components/BeforeAfter";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Download } from "./components/Download";
import { Footer } from "./components/Footer";

function App() {
  return (
    <StrictMode>
      <div className="min-h-[100dvh] grid">
        <Nav />
        <main>
          <Hero />
          <BeforeAfter />
          <Features />
          <HowItWorks />
          <Download />
        </main>
        <Footer />
      </div>
    </StrictMode>
  );
}

const el = document.getElementById("app");
if (el) {
  createRoot(el).render(<App />);
}