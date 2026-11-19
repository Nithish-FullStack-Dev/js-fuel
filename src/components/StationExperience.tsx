import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
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
    hold: [0.16, 0.285],
  },
  {
    id: "diesel",
    number: "02 / 04",
    fuel: "DIESEL",
    title: "Built for distance. Ready for duty.",
    body: "A dependable energy choice for vehicles that work harder and travel farther, with a fueling experience designed to stay simple and direct.",
    note: "DIESEL / DISTANCE & DUTY",
    side: "right",
    hold: [0.36, 0.485],
  },
  {
    id: "cng",
    number: "03 / 04",
    fuel: "CNG",
    title: "Efficient energy for city movement.",
    body: "CNG brings a practical lower-emission fueling option for compatible vehicles, supporting frequent everyday movement with confidence.",
    note: "CNG / EFFICIENT MOBILITY",
    side: "left",
    hold: [0.56, 0.685],
  },
  {
    id: "lpg",
    number: "04 / 04",
    fuel: "LPG",
    title: "Flexible energy. Ready when needed.",
    body: "LPG completes the JS Fuel range with another accessible fuel choice for compatible vehicles — all within one recognisable destination.",
    note: "LPG / FLEXIBLE ENERGY",
    side: "left",
    hold: [0.76, 0.965],
  },
];

export function StationExperience() {
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
      <span className="station-anchor" id="petrol" style={{ top: "16%" }} />
      <span className="station-anchor" id="diesel" style={{ top: "36%" }} />
      <span className="station-anchor" id="cng" style={{ top: "56%" }} />
      <span className="station-anchor" id="lpg" style={{ top: "76%" }} />
      <div className="station-chapter__sticky">
        <ExperienceCanvas progressRef={progressRef} />
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

  // Camera arrives first and stays locked. The blur then enters, followed by copy in four beats.
  // Copy fully exits before the next camera move starts.
  const veil = useTransform(
    progress,
    [
      start + span * 0.08,
      start + span * 0.2,
      end - span * 0.22,
      end - span * 0.06,
    ],
    [0, 1, 1, 0],
  );
  const metaOpacity = useTransform(
    progress,
    [
      start + span * 0.2,
      start + span * 0.31,
      end - span * 0.28,
      end - span * 0.16,
    ],
    [0, 1, 1, 0],
  );
  const titleOpacity = useTransform(
    progress,
    [
      start + span * 0.29,
      start + span * 0.42,
      end - span * 0.25,
      end - span * 0.13,
    ],
    [0, 1, 1, 0],
  );
  const bodyOpacity = useTransform(
    progress,
    [
      start + span * 0.39,
      start + span * 0.52,
      end - span * 0.22,
      end - span * 0.1,
    ],
    [0, 1, 1, 0],
  );
  const noteOpacity = useTransform(
    progress,
    [
      start + span * 0.49,
      start + span * 0.61,
      end - span * 0.2,
      end - span * 0.08,
    ],
    [0, 1, 1, 0],
  );

  const contentX = useTransform(
    progress,
    [
      start + span * 0.18,
      start + span * 0.42,
      end - span * 0.18,
      end - span * 0.06,
    ],
    step.side === "left" ? [-54, 0, 0, -30] : [54, 0, 0, 30],
  );
  const metaY = useTransform(
    progress,
    [start + span * 0.18, start + span * 0.35],
    [20, 0],
  );
  const titleY = useTransform(
    progress,
    [start + span * 0.27, start + span * 0.45],
    [42, 0],
  );
  const bodyY = useTransform(
    progress,
    [start + span * 0.37, start + span * 0.55],
    [48, 0],
  );
  const noteY = useTransform(
    progress,
    [start + span * 0.47, start + span * 0.63],
    [34, 0],
  );
  const lineScale = useTransform(
    progress,
    [start + span * 0.21, start + span * 0.42],
    [0, 1],
  );

  return (
    <div
      className={`fuel-overlay fuel-overlay--${step.side} border-2 border-white`}
    >
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
