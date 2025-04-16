import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, faShare, faDownload, faQrcode,
  faSun, faMoon, faLocationDot, faChargingStation,
  faThumbsUp, faMedal, faChartLine, faXmark,
  faChevronRight, faGauge, faMessage, faSeedling
} from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import './App.css';

// Enhanced mock data
const fetchEVStations = () => [
  { 
    id: 1, 
    name: "EcoCharge Point", 
    distance: "1.2 km", 
    available: 3,
    speed: "Fast (50kW)",
    price: "₹15/kWh"
  },
  { 
    id: 2, 
    name: "GreenVolt Hub", 
    distance: "2.5 km", 
    available: 1,
    speed: "Ultra-fast (150kW)",
    price: "₹18/kWh"
  }
];

const getTestimonials = () => [
  { 
    id: 1, 
    text: "Reduced my carbon footprint by 40% in just 3 months!", 
    author: "Priya K.", 
    rating: 5,
    avatar: "👩🏽‍💼"
  },
  { 
    id: 2, 
    text: "The emissions calculator completely changed my commute habits", 
    author: "Rahul M.", 
    rating: 4,
    avatar: "👨🏽‍💻"
  }
];

const App = () => {
  // State management
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [km, setKm] = useState(5);
  const [userPoints, setUserPoints] = useState(150);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [stations, setStations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Calculate saved CO2
  const savedCO2 = (km * 0.12).toFixed(2);
  const treesEquivalent = (savedCO2 / 21.77).toFixed(1); // kgCO2/tree/year

  // Fetch data on mount
  useEffect(() => {
    setStations(fetchEVStations());
    setTestimonials(getTestimonials());
    
    // System theme listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  // Engagement features
  const addPoints = (points) => {
    setUserPoints(prev => {
      const newTotal = prev + points;
      if (Math.floor(newTotal / 100) > Math.floor(prev / 100)) {
        // Enhanced level up animation
        document.documentElement.classList.add('animate-level-up');
        setTimeout(() => {
          document.documentElement.classList.remove('animate-level-up');
        }, 1000);
      }
      return newTotal;
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Green Commute',
          text: `I saved ${savedCO2}kg CO₂ with GreenRide - that's like ${treesEquivalent} trees saved! 🌱`,
          url: 'https://greenride.org'
        });
      } else {
        await navigator.clipboard.writeText(
          `I saved ${savedCO2}kg CO₂ with GreenRide! ${window.location.href}`
        );
      }
      addPoints(25);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const submitFeedback = () => {
    addPoints(15);
    setFeedback('');
    setShowFeedback(false);
    // Show toast notification
    document.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message: 'Thanks for your feedback! +15 points' }
    }));
  };

  const updateRangeProgress = (value) => {
    const progress = (value - 1) / (50 - 1) * 100;
    document.documentElement.style.setProperty('--range-progress', `${progress}%`);
  };

  // Modern UI Components
  const PollutionVisualization = () => (
    <div className="relative h-40 w-full my-4 overflow-hidden rounded-xl">
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`} />
      
      {/* Animated pollution particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0.3,
            scale: 0.5
          }}
          animate={{
            y: [0, 100, 0],
            opacity: [0.3, 0.8, 0.3],
            transition: {
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className={`absolute rounded-full ${km > 30 ? 'bg-red-400' : km > 15 ? 'bg-yellow-400' : 'bg-green-400'}`}
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            filter: 'blur(1px)'
          }}
        />
      ))}
      
      <div className="relative z-10 p-4 h-full flex flex-col justify-center items-center">
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Your {km}km commute</p>
        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {savedCO2}kg <span className="text-sm">CO₂ saved</span>
        </p>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Equivalent to {treesEquivalent} trees 🌳
        </p>
      </div>
    </div>
  );

  const TabContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <>
            <PollutionVisualization />
            
            <div className="commute-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Adjust Your Commute
                </h2>
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                  {km} km
                </span>
              </div>
              
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={km}
                  onChange={(e) => {
                    setKm(e.target.value);
                    updateRangeProgress(e.target.value);
                  }}
                  className="modern-range"
                  onMount={() => updateRangeProgress(km)}
                />
              </div>
              
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="share-button"
              >
                <motion.span
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <FontAwesomeIcon icon={faShare} />
                </motion.span>
                <span>Share Your Impact</span>
                <span className="share-points-badge">
                  +25 pts
                </span>
              </motion.button>

              <div className="action-grid">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addPoints(5)}
                  className="action-button group"
                >
                  <div className={`p-4 rounded-xl mb-3 bg-gradient-to-br ${darkMode ? 'from-gray-800 to-gray-700' : 'from-emerald-50 to-cyan-50'} group-hover:scale-105 transition-transform`}>
                    <FontAwesomeIcon icon={faDownload} className={`text-xl ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span className="text-sm font-medium">Resources</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('stations')}
                  className="action-button group"
                >
                  <div className={`p-4 rounded-xl mb-3 bg-gradient-to-br ${darkMode ? 'from-gray-800 to-gray-700' : 'from-blue-50 to-cyan-50'} group-hover:scale-105 transition-transform`}>
                    <FontAwesomeIcon icon={faQrcode} className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <span className="text-sm font-medium">EV Stations</span>
                </motion.button>
              </div>
            </div>
          </>
        );
        
      case 'stations':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Nearby Charging</h2>
            <div className="space-y-3">
              {stations.map(station => (
                <motion.div
                  key={station.id}
                  whileHover={{ y: -3 }}
                  className={`p-4 rounded-xl flex items-start gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <FontAwesomeIcon icon={faChargingStation} className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{station.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${station.available > 0 ? (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800')}`}>
                        {station.available > 0 ? `${station.available} available` : 'Full'}
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mt-1 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faLocationDot} className="opacity-60" /> {station.distance}
                    </p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span>{station.speed}</span>
                      <span className="font-medium">{station.price}</span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="mt-1.5 opacity-50" />
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 'testimonials':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Community Stories</h2>
            <div className="space-y-4">
              {testimonials.map(testimonial => (
                <motion.div 
                  key={testimonial.id}
                  whileHover={{ y: -2 }}
                  className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="flex mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon 
                            key={i} 
                            icon={faStar} 
                            className={`${i < testimonial.rating ? (darkMode ? 'text-yellow-400' : 'text-yellow-500') : (darkMode ? 'text-gray-600' : 'text-gray-300')} mr-1`} 
                            size="sm"
                          />
                        ))}
                      </div>
                      <p className="italic">"{testimonial.text}"</p>
                      <p className="text-sm opacity-80 mt-2">— {testimonial.author}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="modern-card relative">
        {/* Theme Toggle Button - Moved inside card */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
        >
          <motion.div
            initial={false}
            animate={{ rotate: darkMode ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {darkMode ? (
              <FontAwesomeIcon icon={faSun} className="text-yellow-400" />
            ) : (
              <FontAwesomeIcon icon={faMoon} className="text-gray-600" />
            )}
          </motion.div>
        </motion.button>

        <div className="modern-card-content">
          {/* Centered Badge */}
          <div className="modern-badge">
            <FontAwesomeIcon icon={faMedal} className="text-yellow-500" />
            <span>{userPoints} pts • Lvl {Math.floor(userPoints/100)}</span>
          </div>

          {/* Centered Content */}
          <div className="centered-section">
            {/* Logo and Title */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-2xl">
                <FontAwesomeIcon icon={faLeaf} className="text-3xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                GreenRide
              </h1>
            </div>

            {/* Centered Navigation */}
            <div className="nav-container">
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  { 
                    id: 'home', 
                    label: 'Impact', 
                    icon: <FontAwesomeIcon icon={faChartLine} size="sm" />,
                    color: 'from-emerald-400 to-green-500'
                  },
                  { 
                    id: 'stations', 
                    label: 'Stations', 
                    icon: <FontAwesomeIcon icon={faQrcode} size="sm" />,
                    color: 'from-cyan-400 to-blue-500'
                  },
                  { 
                    id: 'testimonials', 
                    label: 'Stories', 
                    icon: <FontAwesomeIcon icon={faThumbsUp} size="sm" />,
                    color: 'from-purple-400 to-pink-500'
                  }
                ].map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-button flex-1 flex items-center justify-center gap-2 ${
                      activeTab === tab.id ? 'active' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{tab.icon}</span>
                    <span className="relative z-10 font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Centered Main Content */}
            <main className="w-full space-y-6">
              <TabContent />
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className={`w-full mt-8 py-4 text-center text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-500'
        } border-t border-gray-100 dark:border-gray-700`}>
          © 2024 Deepwoods Green Initiative
        </footer>
      </div>

      {/* Feedback FAB */}
      <button 
        onClick={() => setShowFeedback(true)}
        className="floating-button"
      >
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
    </div>
  );
};

export default App;