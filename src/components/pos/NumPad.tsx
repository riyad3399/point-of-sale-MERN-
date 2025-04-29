import React from 'react';
import { motion } from 'framer-motion';
import { Delete, RefreshCw } from 'lucide-react';

const NumPad: React.FC = () => {
  const handleButtonClick = (value: string) => {
    console.log('Button clicked:', value);
    // Handle number pad input here
  };

  const numpadButtons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '0', '.', 'Backspace'
  ];

  return (
    <div className="numpad">
      {/* <div className="grid grid-cols-3 gap-2">
        {numpadButtons.map((btn) => (
          <motion.button
            key={btn}
            className="numpad-btn"
            onClick={() => handleButtonClick(btn)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {btn === 'Backspace' ? <Delete className="h-5 w-5" /> : btn}
          </motion.button>
        ))}
      </div> */}
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <motion.button
          className="numpad-btn bg-gray-100 col-span-1"
          onClick={() => handleButtonClick('Clear')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Clear
        </motion.button>
        
        <motion.button
          className="numpad-btn bg-primary-600 text-white col-span-1"
          onClick={() => handleButtonClick('Enter')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </div>
    </div>
  );
};

export default NumPad;