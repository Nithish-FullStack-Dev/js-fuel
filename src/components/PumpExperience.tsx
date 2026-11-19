import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { PumpCanvas } from "./PumpCanvas";

export function PumpExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    mass: 0.35,
  });

  useEffect(() => {
    progressRef.current = smoothProgress.get();

    return smoothProgress.on("change", (value) => {
      progressRef.current = value;
    });
  }, [smoothProgress]);

  const pumpX = useTransform(
    smoothProgress,
    [0, 0.34, 0.48, 0.68, 1],
    ["-24vw", "-24vw", "-17vw", "23vw", "23vw"],
  );

  const pumpY = useTransform(
    smoothProgress,
    [0, 0.35, 0.5, 0.7, 1],
    [0, 0, 30, 90, 90],
  );

  const pumpScale = useTransform(
    smoothProgress,
    [0, 0.38, 0.55, 0.72, 1],
    [1, 1, 0.98, 0.94, 0.94],
  );

  const stageOneOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.42, 0.52],
    [1, 1, 0.7, 0],
  );

  const stageOneX = useTransform(
    smoothProgress,
    [0.34, 0.52],
    [0, 80],
  );

  const stageOneY = useTransform(
    smoothProgress,
    [0.34, 0.52],
    [0, -35],
  );

  const stageTwoOpacity = useTransform(
    smoothProgress,
    [0.49, 0.62, 0.72],
    [0, 0.55, 1],
  );

  const stageTwoX = useTransform(
    smoothProgress,
    [0.5, 0.72],
    [-85, 0],
  );

  const stageTwoY = useTransform(
    smoothProgress,
    [0.5, 0.72],
    [110, 0],
  );

  const secondLabelY = useTransform(
    smoothProgress,
    [0.52, 0.7],
    [35, 0],
  );

  const secondTitleY = useTransform(
    smoothProgress,
    [0.54, 0.73],
    [70, 0],
  );

  const secondCopyY = useTransform(
    smoothProgress,
    [0.57, 0.76],
    [90, 0],
  );

  const secondFeaturesY = useTransform(
    smoothProgress,
    [0.6, 0.79],
    [105, 0],
  );

  const backgroundOneOpacity = useTransform(
    smoothProgress,
    [0.35, 0.65],
    [1, 0],
  );

  const backgroundTwoOpacity = useTransform(
    smoothProgress,
    [0.4, 0.72],
    [0, 1],
  );

  const firstFeatures = [
    "Readable display",
    "Accessible nozzle",
    "Strong JS Fuel identity",
  ];

  const secondFeatures = [
    "Built for movement",
    "Efficient operation",
    "Distinctive presence",
  ];

  return (
    <section
      ref={sectionRef}
      id="dispenser"
      className="relative z-[2] h-[210vh] bg-[var(--paper)] text-[var(--brown)]"
    >
      <div className="sticky top-0 h-screen min-h-[680px] overflow-hidden">
        <motion.div
          style={{ opacity: backgroundOneOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_48%,rgba(255,255,255,0.92),transparent_35%),linear-gradient(135deg,#f3efea_0%,#ebe5de_100%)]"
        />

        <motion.div
          style={{ opacity: backgroundTwoOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_52%,rgba(255,255,255,0.92),transparent_34%),linear-gradient(145deg,#ece6df_0%,#f5f1ec_55%,#ebe4dc_100%)]"
        />

        <motion.div
          style={{
            x: pumpX,
            y: pumpY,
            scale: pumpScale,
          }}
          className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center"
        >
          <div className="relative h-[86vh] min-h-[650px] max-h-[840px] w-[48vw] min-w-[560px] max-w-[760px]">
            <PumpCanvas progressRef={progressRef} />
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: stageOneOpacity,
            x: stageOneX,
            y: stageOneY,
          }}
          className="absolute top-1/2 right-[5.5vw] z-[5] w-[min(680px,43vw)] -translate-y-1/2"
        >
          <span className="font-['DM_Mono',monospace] text-[10px] font-medium tracking-[0.25em] text-[#2b1d16]/50 uppercase">
            JS FUEL DISPENSER
          </span>

          <h2 className="mt-6 font-['Manrope',sans-serif] text-[clamp(52px,5.2vw,92px)] leading-[0.91] font-[650] tracking-[-0.068em] text-[#2c1d16]">
            Built for the
            <br />
            <span className="text-[var(--red)]">open road.</span>
          </h2>

          <p className="mt-8 max-w-[640px] font-['Inter',sans-serif] text-[clamp(15px,1.08vw,18px)] leading-[1.8] text-[#2b1d16]/65">
            A strong brand face, readable interface and accessible nozzle layout
            bring clarity to every refuel. Designed to make each stop simple,
            confident and ready for the next journey.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            {firstFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-[#2b1d16]/14 bg-white/20 px-5 py-3.5 font-['DM_Mono',monospace] text-[9px] font-medium tracking-[0.12em] text-[#2b1d16]/65 uppercase backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-12 max-w-[650px] border-t border-[#2b1d16]/10 pt-8">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                  Fast
                </div>
                <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                  Refuelling
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                  Clear
                </div>
                <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                  Interface
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                  Ready
                </div>
                <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                  To Move
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: stageTwoOpacity,
            x: stageTwoX,
            y: stageTwoY,
          }}
          className="absolute top-1/2 left-[6vw] z-[5] w-[min(650px,42vw)] -translate-y-1/2"
        >
          <motion.span
            style={{ y: secondLabelY }}
            className="block font-['DM_Mono',monospace] text-[10px] font-medium tracking-[0.25em] text-[#2b1d16]/50 uppercase"
          >
            ENGINEERED TO PERFORM
          </motion.span>

          <motion.h2
            style={{ y: secondTitleY }}
            className="mt-6 font-['Manrope',sans-serif] text-[clamp(52px,5.2vw,90px)] leading-[0.91] font-[650] tracking-[-0.068em] text-[#2c1d16]"
          >
            Designed from
            <br />
            <span className="text-[var(--red)]">every angle.</span>
          </motion.h2>

          <motion.p
            style={{ y: secondCopyY }}
            className="mt-8 max-w-[590px] font-['Inter',sans-serif] text-[clamp(15px,1.08vw,18px)] leading-[1.8] text-[#2b1d16]/65"
          >
            Every surface is designed around everyday usability. A purposeful
            structure, accessible controls and a confident stance make the
            dispenser feel dependable from every direction.
          </motion.p>

          <motion.div
            style={{ y: secondFeaturesY }}
            className="mt-9 flex flex-wrap gap-3"
          >
            {secondFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-[#2b1d16]/14 bg-white/25 px-5 py-3.5 font-['DM_Mono',monospace] text-[9px] font-medium tracking-[0.12em] text-[#2b1d16]/65 uppercase backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          <motion.div
            style={{ y: secondFeaturesY }}
            className="mt-12 max-w-[590px] border-t border-[#2b1d16]/10 pt-8"
          >
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                  Strong
                </div>
                <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                  Structure
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                  Smart
                </div>
                <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                  Layout
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                  Built
                </div>
                <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                  To Last
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-7 left-1/2 z-[6] -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <span className="font-['DM_Mono',monospace] text-[8px] tracking-[0.2em] text-[#2b1d16]/35 uppercase">
              Scroll to explore
            </span>

            <div className="relative h-10 w-px overflow-hidden bg-[#2b1d16]/15">
              <motion.div
                style={{ scaleY: smoothProgress }}
                className="absolute inset-0 origin-top bg-[#2b1d16]/55"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}