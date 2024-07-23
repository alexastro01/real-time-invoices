import useCountUp from '@/hooks/useCountUp';
import React from 'react';


interface TokenDisplayProps {
  maxValue: number;
  duration: number; // in milliseconds
  tokenSymbol: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ maxValue, duration, tokenSymbol }) => {
  const currentValue = useCountUp(0, maxValue, duration);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="relative">
        {/* Circular background */}
        <div className="w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center">
          {/* Status dots */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
          
          {/* Token icon */}
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold">
            {tokenSymbol}
          </div>
          
          {/* Number display */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 rounded-lg px-4 py-2">
            <div className="font-mono text-2xl text-white">
            {currentValue.toFixed(6).padStart(10, '0')}

            </div>
          </div>
        </div>
        
        {/* Label */}
        <div className="text-center mt-4 text-gray-400">
          Out of {tokenSymbol} {maxValue}
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;