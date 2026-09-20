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
        <meta name="keywords" content="Tri Huynh, Computer Science, AI, Machine Learning, Backend Developer, Software Engineer, Northeastern University" />
        <link rel="canonical" href="https://thuynh-91.github.io/tri-huynh-portfolio/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thuynh-91.github.io/tri-huynh-portfolio/" />
        <meta property="og:title" content="Tri Huynh — AI &amp; Backend Engineer" />
        <meta property="og:description" content="CS at Northeastern, graduating May 2027. I build AI products and then measure whether they actually work." />
        <meta property="og:image" content="https://thuynh-91.github.io/tri-huynh-portfolio/images/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tri Huynh — AI &amp; Backend Engineer" />
        <meta name="twitter:description" content="CS at Northeastern, graduating May 2027. I build AI products and then measure whether they actually work." />
        <meta name="twitter:image" content="https://thuynh-91.github.io/tri-huynh-portfolio/images/og.png" />
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
        <Contact />
        <Footer />
      </main>
    </>
  );
}
