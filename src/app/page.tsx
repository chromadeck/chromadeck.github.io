"use client";

import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Download } from "../components/Download";
import { Video } from "../components/Video";
import { Requirements } from "../components/Requirements";
import { Footer } from "../components/Footer";
import { MotionProvider } from "../components/tools/MotionProvider";

export default function Page() {
  return (
    <MotionProvider>
      <div className="min-h-[100dvh] flex flex-col">
        <Nav />
        <main className="flex-1">
          <Hero />
          <Features />
          <HowItWorks />
          <Video />
          <Requirements />
          <Download />
        </main>
        <Footer />
      </div>
    </MotionProvider>
  );
}
