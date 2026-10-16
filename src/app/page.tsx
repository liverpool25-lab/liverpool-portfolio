import WelcomeIntro from "@/components/WelcomeIntro";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Gallery from "@/components/Gallery";
import Guestbook from "@/components/Guestbook";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import SetupNoticeModal from "@/components/SetupNoticeModal";

export default function Home() {
  return (
    <>
      {/*
       * WelcomeIntro is now an IN-FLOW full-viewport section (not fixed),
       * placed first in the document. Visitors scroll naturally into the
       * main content. The Header is sticky above it.
       */}
      <Header />

      <main className="w-full">
        {/* Intro section — full viewport, visitor scrolls past it */}
        <WelcomeIntro />

        {/* pt-20 compensates for the sticky header height on subsequent sections */}
        <div className="pt-20">
          {/* Hero & Spider-Man Portrait Reveal */}
          <Hero />

          {/* About & Technology Repertoire */}
          <About />

          {/* Selected Projects */}
          <Projects />

          {/* 3D Coverflow Horizontal Gallery */}
          <Gallery />

          {/* Real Guestbook & Supabase Auth */}
          <Guestbook />

          {/* Contact & Verified Social Matrix */}
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal />
      <SetupNoticeModal />
    </>
  );
}
