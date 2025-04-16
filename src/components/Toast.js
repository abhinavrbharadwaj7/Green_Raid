import { motion } from 'framer-motion';

const Toast = ({ message, darkMode }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className={`p-3 mb-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <p className="text-sm">{message}</p>
    </motion.div>
  );
};

export default Toast;
