import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PumpCanvas } from "./PumpCanvas";

export function PumpExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useEffect(() => {
    progressRef.current = scrollYProgress.get();
    return scrollYProgress.on("change", (value) => { progressRef.current = value; });
  }, [scrollYProgress]);

  const giantOpacity = useTransform(scrollYProgress, [0, 0.16, 0.46, 0.62], [0.86, 1, 1, 0.12]);
  const lineOneX = useTransform(scrollYProgress, [0, 0.55], [-40, 34]);
  const lineTwoX = useTransform(scrollYProgress, [0, 0.55], [44, -28]);
  const kickerOpacity = useTransform(scrollYProgress, [0.04, 0.17, 0.36, 0.5], [0, 1, 1, 0]);
  const detailOpacity = useTransform(scrollYProgress, [0.48, 0.64, 0.92], [0, 1, 1]);
  const detailX = useTransform(scrollYProgress, [0.48, 0.68], [-70, 0]);
  const titleY = useTransform(scrollYProgress, [0.48, 0.69], [48, 0]);
  const copyY = useTransform(scrollYProgress, [0.55, 0.76], [50, 0]);

  return (
    <section ref={sectionRef} className="pump-chapter" id="dispenser">
      <div className="pump-chapter__sticky">
        <div className="pump-chapter__paper" />

        <motion.div className="pump-chapter__giant" style={{ opacity: giantOpacity }} aria-hidden="true">
          <motion.div style={{ x: lineOneX }}>FUEL EVERY.</motion.div>
          <motion.div style={{ x: lineTwoX }}>MOVE FURTHER.</motion.div>
        </motion.div>

        <PumpCanvas progressRef={progressRef} />

        <motion.div className="pump-chapter__kicker" style={{ opacity: kickerOpacity }}>
          <span>JS FUEL DISPENSER</span>
          <p>The point where every onward journey begins again.</p>
        </motion.div>

        <motion.div className="pump-chapter__detail" style={{ opacity: detailOpacity, x: detailX }}>
          <div className="pump-chapter__eyebrow">THE DISPENSER / UP CLOSE</div>
          <motion.h2 style={{ y: titleY }}>Clear at a glance.<br /><em>Ready for the next move.</em></motion.h2>
          <motion.p style={{ y: copyY }}>
            A strong brand face, readable interface and accessible nozzle layout bring clarity to the moment that matters most —
            a quick, confident refuel before the next journey.
          </motion.p>
          <motion.div className="pump-chapter__points" style={{ y: copyY }}>
            <span>Readable display</span>
            <span>Accessible nozzle</span>
            <span>Strong JS Fuel identity</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
