import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <motion.div className={`panel ${className}`} {...rest}>
      {children}
    </motion.div>
  );
}
