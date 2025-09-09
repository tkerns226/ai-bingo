import React from 'react';

interface BingoSquareProps {
  text: string;
  name: string | null;
  isFreeSpace: boolean;
  onClick: () => void;
}

const BingoSquare: React.FC<BingoSquareProps> = ({ text, name, isFreeSpace, onClick }) => {
  const isToggled = name !== null || isFreeSpace;

  const baseClasses = 'w-full h-full flex flex-col items-center justify-center p-2 text-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out print:rounded-none print:shadow-none print:border print:border-black border-2 border-transparent';
  
  let stateClasses = '';

  if (isFreeSpace) {
    stateClasses = 'bg-amber-500 text-black font-bold';
  } else if (isToggled) {
    stateClasses = 'bg-purple-600 border-amber-500 text-amber-400 transform scale-105';
  } else {
    stateClasses = 'bg-purple-900 text-gray-300 hover:bg-purple-800 hover:border-amber-500';
  }
  
  // For printing, filled squares get a light gray background.
  const printClasses = isToggled ? 'print:bg-gray-200' : 'print:bg-white';

  // Dynamically adjust styles when a name is present
  const hasName = name && !isFreeSpace;
  
  const descriptionClasses = hasName
    ? 'text-[0.55rem] sm:text-[11px] opacity-70' // Smaller text when name is shown
    : 'text-[0.6rem] sm:text-xs lg:text-sm'; // Original size

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${printClasses} print:text-black print:transform-none`}
    >
      <p className={`leading-tight break-words ${descriptionClasses}`}>
        {text}
      </p>
      {hasName && (
        <p className="font-bold text-yellow-300 text-[11px] sm:text-xs mt-1 break-words">
          {name}
        </p>
      )}
    </div>
  );
};

export default BingoSquare;
