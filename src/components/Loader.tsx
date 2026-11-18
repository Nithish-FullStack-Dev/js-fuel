import { AnimatePresence, motion } from "motion/react";
import { useProgress } from "@react-three/drei";

export function Loader() {
  const { active, progress } = useProgress();
  const visible = active || progress < 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.55 } }}>
          <img src="/images/station-poster.png" alt="" className="loader__poster" />
          <div className="loader__veil" />
          <div className="loader__content">
            <div className="loader__eyebrow">JS FUEL / IMMERSIVE 3D EXPERIENCE</div>
            <div className="loader__percent">{Math.round(progress)}%</div>
            <div className="loader__track"><span style={{ width: `${progress}%` }} /></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
