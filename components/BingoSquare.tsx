import React from 'react';

interface BingoSquareProps {
  text: string;
  name: string | null;
  isFreeSpace: boolean;
  onClick: () => void;
}

// Helper function to determine font and padding based on text length
const getDynamicStyles = (textLength: number, hasName: boolean) => {
  // Base styles for the shortest text
  let paddingClass = 'p-2';
  let fontClass = 'text-sm sm:text-base';
  let leadingClass = 'leading-snug';

  // Having a name below the main text reduces available vertical space,
  // so we apply the "smaller text" styles sooner.
  const verticalSpaceModifier = hasName ? 20 : 0;

  if (textLength > 90 - verticalSpaceModifier) {
    // Very long text -> smallest font, padding, and line height
    fontClass = 'text-[10px] sm:text-[11px]';
    paddingClass = 'p-1';
    leadingClass = 'leading-tight';
  } else if (textLength > 60 - verticalSpaceModifier) {
    // Long text -> small font and padding
    fontClass = 'text-[11px] sm:text-xs';
    paddingClass = 'p-1.5';
    leadingClass = 'leading-tight';
  } else if (textLength > 30 - verticalSpaceModifier) {
    // Medium text
    fontClass = 'text-xs sm:text-sm';
  }
  
  // If a name is present, make the main description slightly transparent
  // to give prominence to the name.
  if (hasName) {
      fontClass += ' opacity-70';
  }

  return { paddingClass, fontClass, leadingClass };
};


const BingoSquare: React.FC<BingoSquareProps> = ({ text, name, isFreeSpace, onClick }) => {
  const isToggled = name !== null || isFreeSpace;
  const hasName = name && !isFreeSpace;
  
  const { paddingClass, fontClass, leadingClass } = getDynamicStyles(text.length, hasName);

  const cursorClass = isFreeSpace ? 'cursor-default' : 'cursor-pointer';
  // Use a consistent border width to prevent layout shift on hover/toggle.
  const baseClasses = `w-full h-full flex flex-col items-center justify-center ${paddingClass} text-center rounded-lg shadow-lg ${cursorClass} transition-all duration-300 ease-in-out print:rounded-none print:shadow-none print:border print:border-black border-4`;
  
  let stateClasses = '';

  if (isFreeSpace) {
    // Make the free space highly distinct with a brighter background, thick border, and glow.
    stateClasses = 'bg-amber-400 text-black border-amber-200 shadow-lg shadow-amber-500/40';
  } else if (isToggled) {
    stateClasses = 'bg-purple-600 border-amber-500 text-amber-400 transform scale-105';
  } else {
    // Start with a transparent border to reserve space.
    stateClasses = 'bg-purple-900 text-gray-300 border-transparent hover:bg-purple-800 hover:border-amber-500';
  }
  
  const printClasses = isToggled ? 'print:bg-gray-200' : 'print:bg-white';

  // Override font style for the FREE space to make it large, bold, and unmissable.
  const descriptionClasses = isFreeSpace 
    ? 'text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider' 
    : `${fontClass} ${leadingClass}`;

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${printClasses} print:text-black print:transform-none`}
    >
      <p className={`break-words ${descriptionClasses}`}>
        {text}
      </p>
      {hasName && (
        <p className="font-bold text-yellow-300 text-[10px] sm:text-[11px] mt-1 break-words">
          {name}
        </p>
      )}
    </div>
  );
};

export default BingoSquare;