import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      className={`button button--${variant} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
