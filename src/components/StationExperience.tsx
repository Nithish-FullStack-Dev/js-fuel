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

export function StationExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    progressRef.current = scrollYProgress.get();

    const unsubscribe = scrollYProgress.on("change", (value) => {
      progressRef.current = value;
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="station-chapter" id="station">
      {fuelSteps.map((step) => (
        <span
          key={step.id}
          className="station-anchor"
          id={step.id}
          style={{
            top: `${step.hold[0] * 100}%`,
          }}
        />
      ))}

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
          style={{
            opacity: metaOpacity,
            y: metaY,
          }}
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

        <motion.h2
          style={{
            opacity: titleOpacity,
            y: titleY,
          }}
        >
          {step.title}
        </motion.h2>

        <motion.p
          style={{
            opacity: bodyOpacity,
            y: bodyY,
          }}
        >
          {step.body}
        </motion.p>

        <motion.div
          className="fuel-overlay__note"
          style={{
            opacity: noteOpacity,
            y: noteY,
          }}
        >
          {step.note}
        </motion.div>
      </motion.div>
    </div>
  );
}
