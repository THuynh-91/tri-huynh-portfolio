import Head from 'next/head';
import Navbar from '../components/Navbar';
import ScrollProgress from '../components/ScrollProgress';
import AnimatedBackground from '../components/AnimatedBackground';
import ParticleBackground from '../components/ParticleBackground';
import KonamiCode from '../components/KonamiCode';
import KonamiHint from '../components/KonamiHint';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import BackToTop from '../components/BackToTop';
import SmoothScroll from '../components/SmoothScroll';
import SpotifyPlayer from '../components/SpotifyPlayer';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Education from '../components/Education';
import Certifications from '../components/Certifications';
import About from '../components/About';
import GitHubActivity from '../components/GitHubActivity';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Tri Huynh | Backend & ML Engineer @ Northeastern</title>
        <meta name="description" content="Computer Science student at Northeastern University specializing in AI and Backend Development. Building intelligent systems with machine learning and scalable architectures." />
        <meta name="keywords" content="Tri Huynh, Computer Science, AI, Machine Learning, Backend Developer, Software Engineer, Northeastern University, AWS Certified" />
        <meta property="og:title" content="Tri Huynh | Backend & ML Engineer" />
        <meta property="og:description" content="Backend & ML Engineer specializing in scalable systems and artificial intelligence" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background & Progress */}
      <ScrollProgress />
      <AnimatedBackground />
      <ParticleBackground />

      {/* Easter Eggs & Interactive Features */}
      <KonamiCode />
      <KonamiHint />
      <FloatingTerminalButton />
      <BackToTop />
      <SpotifyPlayer />
      <SmoothScroll />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <Projects />
        <Skills />
        <Education />
        <Certifications />
        <About />
        <GitHubActivity />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
