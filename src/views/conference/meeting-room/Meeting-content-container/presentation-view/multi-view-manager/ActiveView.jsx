import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveView({ activeView, name, content, description }) {
  return (
    <motion.div
      key="single-view"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',

          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 50%, white 0%, transparent 70%)',
          }}
        />

        <h2
          style={{
            color: 'white',
            fontWeight: 700,

            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            margin: 0,
          }}
        >
          {name}
        </h2>

        <div
          style={{
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            marginBottom: '16px',
          }}
        >
          {content}
        </div>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            // fontSize: window.innerWidth < 640 ? '1rem' : '1.5rem',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
