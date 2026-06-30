import React from 'react';
import { motion } from 'motion/react';

// For section titles/headers to gracefully slide up & fade in when they enter the viewport
export const AnimatedHeader = ({ children, className = "", id, ...props }: { children: React.ReactNode; className?: string; id?: string; [key: string]: any }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Parent container that staggers its child card animations when scrolled into view
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

// Individual child card variants for the staggered transition
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const AnimatedCardContainer = ({ children, className = "", id, ...props }: { children: React.ReactNode; className?: string; id?: string; [key: string]: any }) => {
  return (
    <motion.div
      id={id}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard = ({ children, className = "", id, ...props }: { children: React.ReactNode; className?: string; id?: string; [key: string]: any }) => {
  return (
    <motion.div
      id={id}
      variants={cardVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
