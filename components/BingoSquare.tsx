import React from 'react';

interface BingoSquareProps {
  text: string;
  name: string | null;
  isFreeSpace: boolean;
  onClick: () => void;
}

// Helper function to determine font and padding based on text length
const getDynamicStyles = (textLength: number, hasName: boolean) => {
    let paddingClass = 'p-1.5';
    let fontClass = '';

    if (hasName) {
        // Less vertical space, text needs to be smaller
        if (textLength > 80) {
            fontClass = 'text-[9px] sm:text-[10px] opacity-70';
            paddingClass = 'p-1';
        } else if (textLength > 60) {
            fontClass = 'text-[10px] sm:text-[11px] opacity-70';
        } else {
            fontClass = 'text-[11px] sm:text-xs opacity-70';
        }
    } else {
        // More vertical space
        if (textLength > 90) {
            fontClass = 'text-[10px] sm:text-[11px]';
            paddingClass = 'p-1';
        } else if (textLength > 70) {
            fontClass = 'text-[11px] sm:text-xs';
        } else if (textLength > 40) {
            fontClass = 'text-xs sm:text-sm';
        } else {
            // For very short text like "FREE"
            fontClass = 'text-sm';
        }
    }
    return { paddingClass, fontClass };
};

const BingoSquare: React.FC<BingoSquareProps> = ({ text, name, isFreeSpace, onClick }) => {
  const isToggled = name !== null || isFreeSpace;
  const hasName = name && !isFreeSpace;
  
  const { paddingClass, fontClass } = getDynamicStyles(text.length, hasName);

  // The base classes now dynamically include padding
  const baseClasses = `w-full h-full flex flex-col items-center justify-center ${paddingClass} text-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out print:rounded-none print:shadow-none print:border print:border-black border-2 border-transparent`;
  
  let stateClasses = '';

  if (isFreeSpace) {
    stateClasses = 'bg-amber-500 text-black font-bold';
  } else if (isToggled) {
    stateClasses = 'bg-purple-600 border-amber-500 text-amber-400 transform scale-105';
  } else {
    stateClasses = 'bg-purple-900 text-gray-300 hover:bg-purple-800 hover:border-amber-500';
  }
  
  const printClasses = isToggled ? 'print:bg-gray-200' : 'print:bg-white';

  // Override font size for the FREE space to make it prominent
  const descriptionClasses = isFreeSpace ? 'text-lg' : fontClass;

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${printClasses} print:text-black print:transform-none`}
    >
      <p className={`leading-tight break-words ${descriptionClasses}`}>
        {text}
      </p>
      {hasName && (
        <p className="font-bold text-yellow-300 text-[10px] sm:text-[11px] mt-0.5 break-words">
          {name}
        </p>
      )}
    </div>
  );
};

export default BingoSquare;
