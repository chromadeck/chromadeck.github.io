"use client";

import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Screens } from "../components/Screens";
import { HowItWorks } from "../components/HowItWorks";
import { Video } from "../components/Video";
import { Principles } from "../components/Principles";
import { Download } from "../components/Download";
import { Footer } from "../components/Footer";
import { Regrade } from "../components/Regrade";
import { MotionProvider } from "../components/tools/MotionProvider";

export default function Page() {
  return (
    <MotionProvider>
      <div className="min-h-[100dvh] flex flex-col">
        <Nav />
        <main className="flex-1">
          <Hero />
          <Screens />
          <HowItWorks />
          <Video />
          <Principles />
          <Download />
        </main>
        <Footer />
        <Regrade />
      </div>
    </MotionProvider>
  );
}
