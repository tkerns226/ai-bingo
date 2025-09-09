import React, { useState, useEffect, useCallback } from 'react';
import { BINGO_CHOICES } from './constants';
import BingoCard from './components/BingoCard';
import Button from './components/Button';

const CARD_SIZE = 25;
const FREE_SPACE_INDEX = 12;

type GameState = 'welcome' | 'playing';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Modal Component ---
interface NameEntryModalProps {
  isOpen: boolean;
  squareText: string;
  initialName: string | null;
  onSave: (name: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const NameEntryModal: React.FC<NameEntryModalProps> = ({ isOpen, squareText, initialName, onSave, onClear, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    // Reset name when modal opens with new data
    if (isOpen) {
      setName(initialName || '');
    }
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    } else {
      // If user clears input and saves, treat as clearing the square
      onClear();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-gray-900 border-2 border-purple-700 rounded-xl shadow-2xl p-6 w-full max-w-sm text-white"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 id="modal-title" className="text-xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-purple-600 bg-clip-text text-transparent">
          Found a match?
        </h2>
        <p className="text-gray-400 mb-4 text-sm">{squareText}</p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter student's name"
          aria-label="Student's name"
          className="w-full bg-gray-800 border-2 border-purple-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
          autoFocus
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSave} className="w-full">Save</Button>
          <Button onClick={onClear} className="w-full bg-yellow-600 hover:bg-yellow-700">Clear Square</Button>
        </div>
        <button onClick={onClose} className="w-full text-center text-gray-400 hover:text-white mt-4">Cancel</button>
      </div>
    </div>
  );
};


// --- UI Components for Different Game States ---

const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
    <div className="text-center">
        <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-amber-400 to-purple-600 bg-clip-text text-transparent">
                    AI Icebreaker Bingo
                </span>
            </h1>
            <p className="text-gray-400 mt-2 text-base sm:text-lg">Find classmates who have done these things!</p>
        </header>
        <div className="flex justify-center">
            <Button onClick={onStart}>
                Start Game
            </Button>
        </div>
    </div>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  
  const [cardItems, setCardItems] = useState<string[]>([]);
  const [squareNames, setSquareNames] = useState<(string | null)[]>([]);

  const [modalState, setModalState] = useState<{ isOpen: boolean; index: number | null }>({ isOpen: false, index: null });

  const generateCard = useCallback(() => {
    const shuffledChoices = shuffleArray(BINGO_CHOICES);
    const selectedItems = shuffledChoices.slice(0, CARD_SIZE - 1);
    
    const newCardItems = [
        ...selectedItems.slice(0, FREE_SPACE_INDEX),
        'FREE',
        ...selectedItems.slice(FREE_SPACE_INDEX)
    ];

    const newSquareNames = new Array(CARD_SIZE).fill(null);
    newSquareNames[FREE_SPACE_INDEX] = ''; // Mark free space as toggled but with no name

    setCardItems(newCardItems);
    setSquareNames(newSquareNames);
  }, []);

  useEffect(() => {
    // Pre-generate card on first load
    if (cardItems.length === 0) {
      generateCard();
    }
  }, [cardItems.length, generateCard]);

  const handleSquareClick = (index: number) => {
    if (index === FREE_SPACE_INDEX) return;
    setModalState({ isOpen: true, index });
  };

  const handleSaveName = (name: string) => {
    if (modalState.index !== null) {
        const newSquareNames = [...squareNames];
        newSquareNames[modalState.index] = name;
        setSquareNames(newSquareNames);
    }
    setModalState({ isOpen: false, index: null });
  };
  
  const handleClearSquare = () => {
    if (modalState.index !== null) {
      const newSquareNames = [...squareNames];
      newSquareNames[modalState.index] = null;
      setSquareNames(newSquareNames);
    }
    setModalState({ isOpen: false, index: null });
  };

  const handleStartGame = () => {
    generateCard(); // Generate a fresh card when starting
    setGameState('playing');
  };
  
  const goToWelcome = () => setGameState('welcome');

  const renderContent = () => {
    switch (gameState) {
      case 'playing':
        return (
          <>
            <header className="text-center mb-6 sm:mb-8 print:mb-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight print:text-black print:text-4xl">
                <span className="bg-gradient-to-r from-amber-400 to-purple-600 bg-clip-text text-transparent print:bg-none print:text-black">
                  AI Icebreaker Bingo
                </span>
              </h1>
              <p className="text-gray-400 mt-2 text-base sm:text-lg print-hidden">Click a square to enter the name of a person who fits the description.</p>
            </header>
            <main className="flex flex-col items-center w-full">
              {cardItems.length > 0 ? (
                  <BingoCard items={cardItems} squareNames={squareNames} onSquareClick={handleSquareClick} />
              ) : (
                  <div className="w-full max-w-2xl aspect-square bg-gray-900 rounded-xl flex items-center justify-center print-hidden">
                      <p>Loading...</p>
                  </div>
              )}
              <div className="mt-8 flex gap-4 print-hidden">
                  <Button onClick={generateCard}>Generate New Card</Button>
                  <Button onClick={goToWelcome} className="bg-gray-600 hover:bg-gray-700">Back to Menu</Button>
              </div>
            </main>
          </>
        );
      case 'welcome':
      default:
        return <WelcomeScreen onStart={handleStartGame} />;
    }
  };

  const activeSquare = modalState.index !== null ? cardItems[modalState.index] : '';
  const initialName = modalState.index !== null ? squareNames[modalState.index] : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans print:bg-white print:text-black print:justify-start">
      {renderContent()}
      <NameEntryModal 
        isOpen={modalState.isOpen}
        squareText={activeSquare}
        initialName={initialName}
        onSave={handleSaveName}
        onClear={handleClearSquare}
        onClose={() => setModalState({ isOpen: false, index: null })}
      />
      <footer className="text-gray-500 text-sm mt-10 text-center print-hidden">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;