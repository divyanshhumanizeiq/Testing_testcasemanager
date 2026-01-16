import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-10 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700/50 px-4 sm:px-6 py-4 flex items-center h-16">
        <button 
            onClick={onMenuClick} 
            className="text-gray-400 hover:text-white lg:hidden mr-4"
            aria-label="Open menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div className="flex-1">
            {/* Future elements like global search or user profile can go here */}
        </div>
    </header>
  );
};

export default Header;
