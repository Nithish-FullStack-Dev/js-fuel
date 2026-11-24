"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { ExperienceCanvas } from "./ExperienceCanvas";

type FuelStep = {
  id: string;
  number: string;
  fuel: string;
  title: string;
  body: string;
  note: string;
  side: "left" | "right";
  hold: [number, number];
};

const fuelSteps: FuelStep[] = [
  {
    id: "petrol",
    number: "01 / 04",
    fuel: "PETROL",
    title: "Everyday journeys. Smoother starts.",
    body: "Responsive, familiar fueling for daily city drives, commutes and the road beyond — delivered through a clear JS Fuel forecourt experience.",
    note: "PETROL / EVERYDAY MOBILITY",
    side: "right",
    hold: [0.12, 0.3],
  },
  {
    id: "diesel",
    number: "02 / 04",
    fuel: "DIESEL",
    title: "Built for distance. Ready for duty.",
    body: "A dependable energy choice for vehicles that work harder and travel farther, with a fueling experience designed to stay simple and direct.",
    note: "DIESEL / DISTANCE & DUTY",
    side: "right",
    hold: [0.36, 0.54],
  },
  {
    id: "cng",
    number: "03 / 04",
    fuel: "CNG",
    title: "Efficient energy for city movement.",
    body: "CNG brings a practical lower-emission fueling option for compatible vehicles, supporting frequent everyday movement with confidence.",
    note: "CNG / EFFICIENT MOBILITY",
    side: "left",
    hold: [0.6, 0.78],
  },
  {
    id: "lpg",
    number: "04 / 04",
    fuel: "LPG",
    title: "Flexible energy. Ready when needed.",
    body: "LPG completes the JS Fuel range with another accessible fuel choice for compatible vehicles — all within one recognisable destination.",
    note: "LPG / FLEXIBLE ENERGY",
    side: "left",
    hold: [0.84, 1],
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");

    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function StationExperience() {
  const isMobile = useIsMobile();

  if (isMobile === null) return null;

  return isMobile ? <MobileStationExperience /> : <DesktopStationExperience />;
}

/* DESKTOP — ORIGINAL EXPERIENCE */

function DesktopStationExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    progressRef.current = scrollYProgress.get();

    return scrollYProgress.on("change", (value) => {
      progressRef.current = value;
    });
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="station-chapter" id="station">
      {fuelSteps.map((step) => (
        <span
          key={step.id}
          className="station-anchor"
          id={step.id}
          style={{ top: `${step.hold[0] * 100}%` }}
        />
      ))}

      <div className="station-chapter__sticky">
        <ExperienceCanvas progressRef={progressRef} mode="desktop" />

        <div className="station-chapter__shade" aria-hidden="true" />
        <div className="station-chapter__grain" aria-hidden="true" />

        {fuelSteps.map((step) => (
          <FuelOverlay key={step.id} step={step} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function FuelOverlay({
  step,
  progress,
}: {
  step: FuelStep;
  progress: MotionValue<number>;
}) {
  const [start, end] = step.hold;
  const span = end - start;
  const at = (fraction: number) => start + span * fraction;

  const veil = useTransform(
    progress,
    [at(0.03), at(0.14), at(0.89), at(0.98)],
    [0, 1, 1, 0],
  );

  const metaOpacity = useTransform(
    progress,
    [at(0.08), at(0.18), at(0.87), at(0.96)],
    [0, 1, 1, 0],
  );

  const titleOpacity = useTransform(
    progress,
    [at(0.14), at(0.24), at(0.87), at(0.96)],
    [0, 1, 1, 0],
  );

  const bodyOpacity = useTransform(
    progress,
    [at(0.2), at(0.3), at(0.87), at(0.96)],
    [0, 1, 1, 0],
  );

  const noteOpacity = useTransform(
    progress,
    [at(0.26), at(0.36), at(0.86), at(0.96)],
    [0, 1, 1, 0],
  );

  const contentX = useTransform(
    progress,
    [at(0.08), at(0.32), at(0.87), at(0.98)],
    step.side === "left" ? [-42, 0, 0, -22] : [42, 0, 0, 22],
  );

  const metaY = useTransform(progress, [at(0.08), at(0.2)], [22, 0]);

  const titleY = useTransform(progress, [at(0.14), at(0.26)], [38, 0]);

  const bodyY = useTransform(progress, [at(0.2), at(0.32)], [42, 0]);

  const noteY = useTransform(progress, [at(0.26), at(0.38)], [28, 0]);

  const lineScale = useTransform(progress, [at(0.1), at(0.26)], [0, 1]);

  return (
    <div className={`fuel-overlay fuel-overlay--${step.side}`}>
      <motion.div
        className="fuel-overlay__blur"
        style={{ opacity: veil }}
        aria-hidden="true"
      />

      <motion.div className="fuel-overlay__content" style={{ x: contentX }}>
        <motion.div
          className="fuel-overlay__meta"
          style={{ opacity: metaOpacity, y: metaY }}
        >
          <span>{step.number}</span>

          <motion.i
            style={{
              scaleX: lineScale,
              transformOrigin: step.side === "left" ? "left" : "right",
            }}
          />

          <strong>{step.fuel}</strong>
        </motion.div>

        <motion.h2 style={{ opacity: titleOpacity, y: titleY }}>
          {step.title}
        </motion.h2>

        <motion.p style={{ opacity: bodyOpacity, y: bodyY }}>
          {step.body}
        </motion.p>

        <motion.div
          className="fuel-overlay__note"
          style={{ opacity: noteOpacity, y: noteY }}
        >
          {step.note}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* MOBILE — NEW INTRO + CONTENT EXPERIENCE */

const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

const revealItem: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function MobileStationExperience() {
  const introProgressRef = useRef(0);

  return (
    <section
      id="station"
      className="relative w-full overflow-x-clip bg-[#07090c] text-white md:hidden"
    >
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#19202a_0%,#07090c_72%)]"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 pt-24 text-center"
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff4057]">
            JS FUEL / THE STATION
          </p>

          <h2 className="mx-auto max-w-[420px] text-[clamp(28px,8vw,42px)] font-semibold leading-[1.08] tracking-[-0.045em]">
            One destination.
            <br />
            <span className="text-white/45">Every journey.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-[310px] text-[13px] leading-6 text-white/50">
            Four energy choices. One seamless fueling experience.
          </p>
        </motion.div>

        <div className="relative z-0 mt-3 w-full">
          <div className="pointer-events-none relative h-[clamp(230px,64vw,380px)] w-full overflow-hidden">
            <ExperienceCanvas
              progressRef={introProgressRef}
              mode="mobile-intro"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#07090c] to-transparent"
            aria-hidden="true"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="relative z-10 flex flex-col items-center gap-2 pb-12 pt-1"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/40">
            Explore our fuels
          </span>

          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-9 w-5 justify-center rounded-full border border-white/25 pt-1.5"
          >
            <span className="h-2 w-1 rounded-full bg-[#ec1d3b]" />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative px-5 pb-14 pt-3">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealContainer}
          className="mx-auto mb-9 max-w-[520px]"
        >
          <motion.div
            variants={revealItem}
            className="mb-4 flex items-center gap-3"
          >
            <span className="h-px w-7 bg-[#ec1d3b]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#ff5369]">
              Discover the range
            </span>
          </motion.div>

          <motion.h2
            variants={revealItem}
            className="max-w-[310px] text-[32px] font-semibold leading-[1.12] tracking-[-0.045em]"
          >
            The right energy
            <span className="text-white/40"> for every move.</span>
          </motion.h2>
        </motion.div>

        <div className="mx-auto flex max-w-[520px] flex-col gap-4">
          {fuelSteps.map((step, index) => (
            <MobileFuelCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="border-t border-white/10 px-6 py-12 text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#ff5369]">
          JS FUEL
        </p>

        <p className="mt-3 text-xl font-medium tracking-tight text-white/80">
          Fueling every kind of movement.
        </p>
      </motion.div>
    </section>
  );
}

function MobileFuelCard({ step, index }: { step: FuelStep; index: number }) {
  return (
    <motion.article
      id={step.id}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.18,
      }}
      variants={revealContainer}
      className="group relative isolate overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#11151b] px-6 py-7"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-60 w-60 rounded-full bg-[#e51c3b]/[0.09] blur-[75px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.035] via-transparent to-transparent"
        aria-hidden="true"
      />

      <motion.div
        variants={revealItem}
        className="mb-9 flex items-center justify-between"
      >
        <span className="text-[10px] font-medium tracking-[0.24em] text-white/40">
          {step.number}
        </span>

        <span className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.17em] text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ec1d3b]" />
          JS FUEL
        </span>
      </motion.div>

      <motion.div variants={revealItem}>
        <span
          className="pointer-events-none absolute right-2 top-14 -z-10 select-none text-[clamp(90px,25vw,145px)] font-black leading-none tracking-[-0.1em] text-white/[0.025]"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="text-[clamp(43px,13vw,65px)] font-bold leading-none tracking-[-0.075em] text-white">
          {step.fuel}
          <span className="text-[#ec1d3b]">.</span>
        </h3>
      </motion.div>

      <motion.div
        variants={revealItem}
        className="my-6 h-px w-full origin-left bg-white/10"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="h-full w-16 origin-left bg-[#ec1d3b]"
        />
      </motion.div>

      <motion.h4
        variants={revealItem}
        className="max-w-[290px] text-[24px] font-semibold leading-[1.2] tracking-[-0.035em]"
      >
        {step.title}
      </motion.h4>

      <motion.p
        variants={revealItem}
        className="mt-4 max-w-[380px] text-[13px] leading-[1.85] text-white/55"
      >
        {step.body}
      </motion.p>

      <motion.div
        variants={revealItem}
        className="mt-9 flex items-center gap-3"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ec1d3b]" />

        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
          {step.note}
        </span>
      </motion.div>
    </motion.article>
  );
}
