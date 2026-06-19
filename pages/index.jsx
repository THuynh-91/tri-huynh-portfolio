import Head from 'next/head';
import Navbar from '../components/Navbar';
import ScrollProgress from '../components/ScrollProgress';
import Backdrop from '../components/Backdrop';
import ParticleBackground from '../components/ParticleBackground';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import EggHunt from '../components/EggHunt';
import BackToTop from '../components/BackToTop';
import SmoothScroll from '../components/SmoothScroll';
import SpotifyPlayer from '../components/SpotifyPlayer';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Education from '../components/Education';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Tri Huynh | AI & Backend Engineer</title>
        <meta
          name="description"
          content="Tri Huynh, CS student at Northeastern specializing in AI and backend development. I build ML-powered applications and the scalable systems behind them."
        />
        <meta name="keywords" content="Tri Huynh, Computer Science, AI, Machine Learning, Backend Developer, Software Engineer, Northeastern University, AWS Certified" />
        <meta property="og:title" content="Tri Huynh | AI & Backend Engineer" />
        <meta property="og:description" content="I build ML-powered applications and the scalable systems behind them." />
        <meta property="og:type" content="website" />
      </Head>

      {/* Ambient backdrop & scroll progress */}
      <Backdrop />
      <ParticleBackground />
      <ScrollProgress />

      {/* Easter eggs & interactive features */}
      <FloatingTerminalButton />
      <EggHunt />
      <BackToTop />
      <SpotifyPlayer />
      <SmoothScroll />

      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
