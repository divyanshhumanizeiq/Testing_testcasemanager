import React from 'react';
import { View } from '../types';
import Icon from './ui/Icon';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: View; name: string }[] = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'test-cases', name: 'Test Cases' },
  { id: 'test-case-execution', name: 'Test Case Execution' },
  { id: 'reports', name: 'Reports' },
  { id: 'environments', name: 'Environments' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop for mobile/tablet */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-700/50 w-64 flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex-shrink-0 px-4 flex items-center space-x-3 border-b border-gray-700/50">
          <img src="https://www.humanizeiq.ai/home/images/HumanizeIQ_Logo_updated.png" alt="HumanizeIQ Logo" className="w-8 h-8" />
          <h1 className="text-lg font-semibold text-gray-100">Test Case Manager</h1>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <Icon name={item.id} className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700/50 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} HumanizeIQ</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
