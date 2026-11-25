"use client";

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
      anchors: {
        offset: -72,
      },
      wheelMultiplier: 1,
      touchMultiplier: 1,
      lerp: 0.08,
      smoothWheel: true,
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
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 34,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const line = {
    hidden: {
      scaleX: 0,
      opacity: 0,
    },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="network"
      className="relative isolate overflow-hidden bg-[#07090c] px-5 py-24 text-white sm:px-8 md:py-32 lg:px-16 lg:py-40 xl:px-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(213,25,53,0.16),transparent_34%),radial-gradient(circle_at_20%_90%,rgba(213,25,53,0.08),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 select-none font-[Poppins] text-[240px] font-extrabold leading-none tracking-[-0.09em] text-white/[0.025] sm:text-[340px] lg:-right-10 lg:text-[520px]"
      >
        JS
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.3,
        }}
        className="relative z-10 mx-auto w-full max-w-[1280px]"
      >
        <motion.div
          variants={item}
          className="mb-7 flex items-center gap-4 sm:mb-10"
        >
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-white/45 sm:text-[10px]">
            JS FUEL / ONE FORECOURT
          </span>

          <motion.span
            variants={line}
            className="h-px w-14 origin-left bg-[#d51935] sm:w-24"
          />

          <span className="hidden font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-white/45 sm:inline-block sm:text-[10px]">
            FOUR ENERGY CHOICES
          </span>
        </motion.div>

        <motion.h2
          variants={item}
          className="max-w-[1100px] font-[Poppins] text-[clamp(3.4rem,8vw,8.5rem)] font-semibold leading-[0.87] tracking-[-0.07em]"
        >
          Fuel for every
          <br />
          kind of{" "}
          <motion.span className="relative inline-block text-[#d51935]">
            movement.
          </motion.span>
        </motion.h2>

        <motion.div
          variants={item}
          className="mt-10 grid gap-8 border-t border-white/10 pt-7 sm:mt-14 sm:pt-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20"
        >
          <p className="max-w-[680px] text-[15px] leading-7 text-white/60 sm:text-[17px] sm:leading-8">
            Petrol, Diesel, CNG and LPG come together under one recognisable JS
            Fuel experience — clear, accessible and built around the way people
            actually move.
          </p>

          <div className="flex flex-wrap gap-2.5 lg:justify-end">
            {["PETROL", "DIESEL", "CNG", "LPG"].map((fuel, index) => (
              <motion.span
                key={fuel}
                variants={item}
                transition={{
                  delay: index * 0.06,
                }}
                className="group relative overflow-hidden rounded-full border border-white/15 bg-white/[0.025] px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.17em] text-white/55 transition-colors duration-300 hover:border-[#d51935]/70 hover:text-white sm:px-5 sm:py-3 sm:text-[10px]"
              >
                <span className="relative z-10">{fuel}</span>

                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-[#d51935] transition-transform duration-500 ease-out group-hover:translate-x-0"
                />
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-14 flex items-center gap-4 sm:mt-20"
        >
          <span className="h-2 w-2 rounded-full bg-[#d51935]" />

          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/30 sm:text-[9px]">
            Petrol · Diesel · CNG · LPG
          </span>

          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
        </motion.div>
      </motion.div>
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
