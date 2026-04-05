import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VIEWS = [
  {
    id: 1,
    name: 'Dashboard',
    color: '#667eea',
    content: '📊',
    description: 'Tableau de bord',
  },
  // {
  //   id: 2,
  //   name: 'Projets',
  //   color: '#f093fb',
  //   content: '📁',
  //   description: 'Mes projets',
  // },
  {
    id: 3,
    name: 'Messages',
    color: '#4facfe',
    content: '💬',
    description: 'Messagerie',
  },
  {
    id: 4,
    name: 'Calendrier',
    color: '#43e97b',
    content: '📅',
    description: 'Planning',
  },
  {
    id: 5,
    name: 'Paramètres',
    color: '#fa709a',
    content: '⚙️',
    description: 'Configuration',
  },
  // {
  //   id: 6,
  //   name: 'Analytics',
  //   color: '#feca57',
  //   content: '📈',
  //   description: 'Statistiques',
  // },
];

export default function MultiViewManager() {
  const [activeView, setActiveView] = useState(0);
  const [showAllViews, setShowAllViews] = useState(false);

  const handleViewSelect = (index) => {
    setActiveView(index);
    setShowAllViews(false);
  };

  const toggleViewMode = () => {
    setShowAllViews(!showAllViews);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Titre centré */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: window.innerWidth < 640 ? '1.5rem' : '2rem',
            fontWeight: 700,
            margin: 0,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px',
          }}
        >
          Vues Multi-Fenêtres
        </h1>
      </motion.div> */}

      {/* Bouton de contrôle */}
      <motion.button
        onClick={toggleViewMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        {showAllViews ? '✕' : '⊞'}
      </motion.button>

      <AnimatePresence mode="wait">
        {!showAllViews ? (
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
              // padding:
              //   window.innerWidth < 640 ? '100px 16px 16px' : '120px 32px 32px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${VIEWS[activeView].color} 0%, ${VIEWS[activeView].color}dd 100%)`,
                // borderRadius: window.innerWidth < 640 ? '16px' : '24px',
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
                  // fontSize:
                  //   window.innerWidth < 640
                  //     ? '2rem'
                  //     : window.innerWidth < 768
                  //     ? '3rem'
                  //     : '4rem',
                  //  marginBottom: window.innerWidth < 640 ? '16px' : '32px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  zIndex: 1,
                  margin: 0,
                }}
              >
                {VIEWS[activeView].name}
              </h2>

              <div
                style={{
                  // fontSize:
                  //   window.innerWidth < 640
                  //     ? '6rem'
                  //     : window.innerWidth < 768
                  //     ? '8rem'
                  //     : '12rem',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  zIndex: 1,
                  marginBottom: '16px',
                }}
              >
                {VIEWS[activeView].content}
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
                {VIEWS[activeView].description}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="all-views"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // padding:
              //   window.innerWidth < 640
              //     ? '100px 16px 16px 16px'
              //     : '120px 32px 32px 32px',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  window.innerWidth < 640
                    ? 'repeat(2, 1fr)'
                    : window.innerWidth < 1024
                    ? 'repeat(2, 1fr)'
                    : 'repeat(3, 1fr)',
                gap: window.innerWidth < 640 ? '12px' : '24px',
                maxWidth: '1400px',
                width: '100%',
              }}
            >
              {VIEWS.map((view, index) => (
                <motion.div
                  key={view.id}
                  initial={{
                    opacity: 0,
                    y: 50,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewSelect(index)}
                  style={{
                    cursor: 'pointer',
                    aspectRatio: window.innerWidth < 640 ? '0.85' : '1.4',
                    background: `linear-gradient(135deg, ${view.color} 0%, ${view.color}dd 100%)`,
                    borderRadius: window.innerWidth < 640 ? '12px' : '20px',
                    boxShadow:
                      activeView === index
                        ? '0 12px 40px rgba(0, 0, 0, 0.3)'
                        : '0 8px 24px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    border: activeView === index ? '3px solid white' : 'none',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}
                  />

                  <h3
                    style={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: window.innerWidth < 640 ? '0.9rem' : '1.25rem',
                      marginBottom: window.innerWidth < 640 ? '8px' : '16px',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                      zIndex: 1,
                      margin: '0 0 8px 0',
                    }}
                  >
                    {view.name}
                  </h3>

                  <div
                    style={{
                      color: 'white',
                      fontSize: window.innerWidth < 640 ? '3rem' : '4rem',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                      zIndex: 1,
                    }}
                  >
                    {view.content}
                  </div>

                  {activeView === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '50%',
                        width: window.innerWidth < 640 ? '24px' : '32px',
                        height: window.innerWidth < 640 ? '24px' : '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: window.innerWidth < 640 ? '14px' : '18px',
                        color: view.color,
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
