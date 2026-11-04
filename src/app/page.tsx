"use client";

import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Download } from "../components/Download";
import { Video } from "../components/Video";
import { Requirements } from "../components/Requirements";
import { Footer } from "../components/Footer";

export default function Page() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Intro />
        <Features />
        <HowItWorks />
        <Video />
        <Requirements />
        <Download />
      </main>
      <Footer />
    </div>
  );
}
