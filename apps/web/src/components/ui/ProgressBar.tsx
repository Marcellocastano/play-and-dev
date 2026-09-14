import { motion } from 'motion/react';

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuemin={0}
      aria-valuenow={Math.round(ratio * max)}
      aria-valuemax={max}
      aria-label={label}
    >
      <motion.div
        className="progress-fill"
        initial={false}
        animate={{ scaleX: ratio }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
