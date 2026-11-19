import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Gauge, ShieldCheck, Zap } from "lucide-react";
import { Header } from "./components/Header";
import { Loader } from "./components/Loader";
import { BrandMark } from "./components/BrandMark";
import { StationExperience } from "./components/StationExperience";
import { PumpExperience } from "./components/PumpExperience";
import FuelVideo from "./sections/FuelVideo";
import FuelCarousel from "./components/FuelCarousel";

export default function App() {
  const { scrollYProgress } = useScroll();
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.32,
  });

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -72 },
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
    });

    return () => lenis.destroy();
  }, []);

  return (
    <div className="site-shell" id="top">
      <Header />
      <Loader />

      <div className="scroll-rail" aria-hidden="true">
        <span>01</span>
        <div>
          <motion.i style={{ scaleY: railProgress, transformOrigin: "top" }} />
        </div>
        <span>05</span>
      </div>

      <main>
        <StationExperience />
        <FuelBridgeSection />
        <FuelVideo />
        <PumpExperience />
        <FuelCarousel />
        <NetworkSection />
        <FooterSection />
      </main>
    </div>
  );
}

function FuelBridgeSection() {
  return (
    <section className="fuel-bridge" id="network">
      <div className="fuel-bridge__inner">
        <div className="fuel-bridge__eyebrow">
          JS FUEL / ONE FORECOURT. FOUR ENERGY CHOICES.
        </div>
        <h2>
          Fuel for every kind of <span>movement.</span>
        </h2>
        <p>
          Petrol, Diesel, CNG and LPG come together under one recognisable JS
          Fuel experience — clear, accessible and built around the way people
          actually move.
        </p>
        <div className="fuel-bridge__fuels" aria-label="Fuel types">
          <span>PETROL</span>
          <span>DIESEL</span>
          <span>CNG</span>
          <span>LPG</span>
        </div>
      </div>
    </section>
  );
}

function NetworkSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 30%"],
  });
  const titleY = useTransform(scrollYProgress, [0, 0.45], [52, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.28], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.1, 0.62], [70, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.42], [0, 1]);

  return (
    <section ref={ref} className="network-section" id="experience">
      <div className="network-section__inner">
        <motion.div
          className="network-section__heading"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          <span>THE JS FUEL EXPERIENCE</span>
          <h2>A better stop between where you are and where you are going.</h2>
        </motion.div>

        <motion.div
          className="network-cards"
          style={{ y: cardsY, opacity: cardsOpacity }}
        >
          <article>
            <Gauge size={23} strokeWidth={1.6} />
            <span>01</span>
            <h3>Clear fueling</h3>
            <p>
              Readable dispensers, familiar fuel choices and an easy forecourt
              flow.
            </p>
          </article>
          <article>
            <Zap size={23} strokeWidth={1.6} />
            <span>02</span>
            <h3>Built for movement</h3>
            <p>
              A station experience designed around quick stops and confident
              onward journeys.
            </p>
          </article>
          <article>
            <ShieldCheck size={23} strokeWidth={1.6} />
            <span>03</span>
            <h3>One identity</h3>
            <p>
              Consistent JS Fuel branding from the canopy to the dispenser face.
            </p>
          </article>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__top">
        <BrandMark />
        <p>
          Petrol · Diesel · CNG · LPG
          <br />
          Energy that keeps the next move within reach.
        </p>
      </div>

      <div className="site-footer__grid">
        <div>
          <span>EXPLORE</span>
          <a href="#station">3D Station</a>
          <a href="#network">Fuel Network</a>
          <a href="#dispenser">Dispenser</a>
        </div>
        <div>
          <span>FUELS</span>
          <a href="#petrol">Petrol</a>
          <a href="#diesel">Diesel</a>
          <a href="#cng">CNG</a>
          <a href="#lpg">LPG</a>
        </div>
        <div className="site-footer__cta-wrap">
          <span>BACK TO START</span>
          <a className="site-footer__cta" href="#top">
            Replay experience <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>JS FUEL / IMMERSIVE 3D EXPERIENCE</span>
        <span>ENERGY THAT MOVES WITH YOU</span>
      </div>
      <div className="site-footer__wordmark">JS FUEL</div>
    </footer>
  );
}
