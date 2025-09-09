import React from 'react';
import BingoSquare from './BingoSquare';

interface BingoCardProps {
  items: string[];
  squareNames: (string | null)[]; // Changed from toggledStates
  onSquareClick: (index: number) => void; // Changed from onToggle
}

const BingoCard: React.FC<BingoCardProps> = ({ items, squareNames, onSquareClick }) => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-2 sm:gap-3 p-4 bg-black border-2 border-purple-800 rounded-xl shadow-2xl w-full max-w-2xl aspect-square print:shadow-none print:bg-white print:p-0 print:gap-0 print:border print:border-black print:aspect-auto">
      {items.map((item, index) => (
        <BingoSquare
          key={index}
          text={item}
          name={squareNames[index]} // Pass name
          isFreeSpace={index === 12 && item === 'FREE'}
          onClick={() => onSquareClick(index)} // Use new handler
        />
      ))}
    </div>
  );
};

export default BingoCard;