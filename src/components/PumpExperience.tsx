import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { PumpCanvas } from "./PumpCanvas";

function useMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");

    const update = () => setMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return mobile;
}

export function PumpExperience() {
  const mobile = useMobile();

  return mobile ? <MobilePumpExperience /> : <DesktopPumpExperience />;
}

function MobilePumpExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const firstSlotRef = useRef<HTMLDivElement>(null);
  const secondSlotRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);

  const [slotPositions, setSlotPositions] = useState({
    first: 0,
    second: 0,
  });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.4,
  });

  useEffect(() => {
    progressRef.current = smoothProgress.get();

    return smoothProgress.on("change", (value) => {
      progressRef.current = value;
    });
  }, [smoothProgress]);

  useEffect(() => {
    const measure = () => {
      if (
        !wrapperRef.current ||
        !firstSlotRef.current ||
        !secondSlotRef.current
      ) {
        return;
      }

      const wrapper = wrapperRef.current.getBoundingClientRect();
      const first = firstSlotRef.current.getBoundingClientRect();
      const second = secondSlotRef.current.getBoundingClientRect();

      setSlotPositions({
        first: first.top - wrapper.top,
        second: second.top - wrapper.top,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    if (firstSlotRef.current) observer.observe(firstSlotRef.current);
    if (secondSlotRef.current) observer.observe(secondSlotRef.current);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const pumpY = useTransform(
    smoothProgress,
    [0, 0.2, 0.34, 0.58, 0.68, 1],
    [
      slotPositions.first,
      slotPositions.first,
      slotPositions.first,
      slotPositions.second,
      slotPositions.second,
      slotPositions.second,
    ],
  );

  const pumpScale = useTransform(
    smoothProgress,
    [0, 0.3, 0.48, 0.64, 1],
    [1, 1, 0.92, 1, 1],
  );

  const pumpX = useTransform(
    smoothProgress,
    [0, 0.3, 0.48, 0.64, 1],
    [0, 0, 12, 0, 0],
  );

  const firstContentOpacity = useTransform(
    smoothProgress,
    [0, 0.16, 0.33, 0.4],
    [1, 1, 0.4, 0],
  );

  const firstContentY = useTransform(smoothProgress, [0.14, 0.4], [0, -70]);

  const firstContentScale = useTransform(
    smoothProgress,
    [0.16, 0.4],
    [1, 0.97],
  );

  const secondContentOpacity = useTransform(
    smoothProgress,
    [0.5, 0.63, 0.76],
    [0, 0.45, 1],
  );

  const secondContentY = useTransform(smoothProgress, [0.5, 0.76], [80, 0]);

  const secondTitleY = useTransform(smoothProgress, [0.55, 0.78], [45, 0]);

  const secondCopyY = useTransform(smoothProgress, [0.58, 0.8], [60, 0]);

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
    <div
      ref={wrapperRef}
      className="relative overflow-hidden bg-[var(--paper)] text-[var(--brown)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-full">
        <motion.div
          style={{
            y: pumpY,
            x: pumpX,
            scale: pumpScale,
          }}
          className="absolute left-1/2 w-[min(88vw,430px)] -translate-x-1/2"
        >
          <div className="aspect-[4/5] w-full">
            <PumpCanvas progressRef={progressRef} mode="mobile" />
          </div>
        </motion.div>
      </div>

      <section className="relative z-[2] bg-[radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.94),transparent_38%),linear-gradient(180deg,#f3efea_0%,#ebe5de_100%)] px-5 pt-16 pb-8 sm:px-8 sm:pt-20">
        <motion.div
          style={{
            opacity: firstContentOpacity,
            y: firstContentY,
            scale: firstContentScale,
          }}
          className="relative z-[5] mx-auto max-w-[520px] text-center"
        >
          <span className="font-['DM_Mono',monospace] text-[9px] font-medium tracking-[0.23em] text-[#2b1d16]/50 uppercase">
            JS FUEL DISPENSER
          </span>

          <h2 className="mt-4 font-['Manrope',sans-serif] text-[clamp(42px,12vw,64px)] leading-[0.91] font-[650] tracking-[-0.065em] text-[#2c1d16]">
            Built for the
            <br />
            <span className="text-[var(--red)]">open road.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[440px] font-['Inter',sans-serif] text-[14px] leading-[1.7] text-[#2b1d16]/65 sm:text-[15px]">
            A strong brand face, readable interface and accessible nozzle layout
            bring clarity to every refuel. Designed to make each stop simple,
            confident and ready for the next journey.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {firstFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-[#2b1d16]/14 bg-white/25 px-3.5 py-2.5 font-['DM_Mono',monospace] text-[7px] font-medium tracking-[0.1em] text-[#2b1d16]/65 uppercase backdrop-blur-sm sm:text-[8px]"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-7 max-w-[430px] border-t border-[#2b1d16]/10 pt-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="font-['Manrope',sans-serif] text-[21px] font-medium tracking-[-0.05em]">
                  Fast
                </div>

                <div className="mt-1 font-['DM_Mono',monospace] text-[7px] tracking-[0.12em] text-[#2b1d16]/40 uppercase">
                  Refuelling
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[21px] font-medium tracking-[-0.05em]">
                  Clear
                </div>

                <div className="mt-1 font-['DM_Mono',monospace] text-[7px] tracking-[0.12em] text-[#2b1d16]/40 uppercase">
                  Interface
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[21px] font-medium tracking-[-0.05em]">
                  Ready
                </div>

                <div className="mt-1 font-['DM_Mono',monospace] text-[7px] tracking-[0.12em] text-[#2b1d16]/40 uppercase">
                  To Move
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div
          ref={firstSlotRef}
          className="mx-auto mt-8 aspect-[4/5] w-[min(88vw,430px)]"
        />
      </section>

      <section className="relative z-[2] bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.94),transparent_36%),linear-gradient(180deg,#ebe5de_0%,#f5f1ec_45%,#ece5dd_100%)] px-5 pt-8 pb-20 sm:px-8">
        <div
          ref={secondSlotRef}
          className="mx-auto aspect-[4/5] w-[min(88vw,430px)]"
        />

        <motion.div
          style={{
            opacity: secondContentOpacity,
            y: secondContentY,
          }}
          className="relative z-[5] mx-auto mt-8 max-w-[520px] text-center"
        >
          <motion.span
            style={{ y: secondTitleY }}
            className="block font-['DM_Mono',monospace] text-[9px] font-medium tracking-[0.23em] text-[#2b1d16]/50 uppercase"
          >
            ENGINEERED TO PERFORM
          </motion.span>

          <motion.h2
            style={{ y: secondTitleY }}
            className="mt-4 font-['Manrope',sans-serif] text-[clamp(40px,11vw,62px)] leading-[0.91] font-[650] tracking-[-0.065em] text-[#2c1d16]"
          >
            Designed from
            <br />
            <span className="text-[var(--red)]">every angle.</span>
          </motion.h2>

          <motion.p
            style={{ y: secondCopyY }}
            className="mx-auto mt-5 max-w-[440px] font-['Inter',sans-serif] text-[14px] leading-[1.7] text-[#2b1d16]/65 sm:text-[15px]"
          >
            Every surface is designed around everyday usability. A purposeful
            structure, accessible controls and a confident stance make the
            dispenser feel dependable from every direction.
          </motion.p>

          <motion.div
            style={{ y: secondCopyY }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {secondFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-[#2b1d16]/14 bg-white/25 px-3.5 py-2.5 font-['DM_Mono',monospace] text-[7px] font-medium tracking-[0.1em] text-[#2b1d16]/65 uppercase backdrop-blur-sm sm:text-[8px]"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          <motion.div
            style={{ y: secondCopyY }}
            className="mx-auto mt-7 max-w-[430px] border-t border-[#2b1d16]/10 pt-5"
          >
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="font-['Manrope',sans-serif] text-[21px] font-medium tracking-[-0.05em]">
                  Strong
                </div>

                <div className="mt-1 font-['DM_Mono',monospace] text-[7px] tracking-[0.12em] text-[#2b1d16]/40 uppercase">
                  Structure
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[21px] font-medium tracking-[-0.05em]">
                  Smart
                </div>

                <div className="mt-1 font-['DM_Mono',monospace] text-[7px] tracking-[0.12em] text-[#2b1d16]/40 uppercase">
                  Layout
                </div>
              </div>

              <div>
                <div className="font-['Manrope',sans-serif] text-[21px] font-medium tracking-[-0.05em]">
                  Built
                </div>

                <div className="mt-1 font-['DM_Mono',monospace] text-[7px] tracking-[0.12em] text-[#2b1d16]/40 uppercase">
                  To Last
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

function DesktopPumpExperience() {
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

  const stageOneX = useTransform(smoothProgress, [0.34, 0.52], [0, 80]);

  const stageOneY = useTransform(smoothProgress, [0.34, 0.52], [0, -35]);

  const stageTwoOpacity = useTransform(
    smoothProgress,
    [0.49, 0.62, 0.72],
    [0, 0.55, 1],
  );

  const stageTwoX = useTransform(smoothProgress, [0.5, 0.72], [-85, 0]);

  const stageTwoY = useTransform(smoothProgress, [0.5, 0.72], [110, 0]);

  const secondLabelY = useTransform(smoothProgress, [0.52, 0.7], [35, 0]);

  const secondTitleY = useTransform(smoothProgress, [0.54, 0.73], [70, 0]);

  const secondCopyY = useTransform(smoothProgress, [0.57, 0.76], [90, 0]);

  const secondFeaturesY = useTransform(smoothProgress, [0.6, 0.79], [105, 0]);

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
            <PumpCanvas progressRef={progressRef} mode="desktop" />
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
              {[
                ["Fast", "Refuelling"],
                ["Clear", "Interface"],
                ["Ready", "To Move"],
              ].map(([title, label]) => (
                <div key={title}>
                  <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                    {title}
                  </div>

                  <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                    {label}
                  </div>
                </div>
              ))}
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
              {[
                ["Strong", "Structure"],
                ["Smart", "Layout"],
                ["Built", "To Last"],
              ].map(([title, label]) => (
                <div key={title}>
                  <div className="font-['Manrope',sans-serif] text-[30px] font-medium tracking-[-0.055em]">
                    {title}
                  </div>

                  <div className="mt-2 font-['DM_Mono',monospace] text-[9px] tracking-[0.14em] text-[#2b1d16]/40 uppercase">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
