
import React from 'react';
import { TestCaseStatus, Priority, EnvironmentStatus, GithubStatus } from '../../types';

interface BadgeProps {
  type: TestCaseStatus | Priority | EnvironmentStatus | GithubStatus;
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const baseClasses = 'inline-block px-2.5 py-1 text-xs font-semibold rounded-full';
  
  const typeStyles: Record<string, string> = {
    // TestCaseStatus
    'Pass': 'bg-green-500/20 text-green-300',
    'Fail': 'bg-red-500/20 text-red-300',
    'Blocked': 'bg-yellow-500/20 text-yellow-300',
    'Not Run': 'bg-gray-500/20 text-gray-300',
    // Priority
    'High': 'bg-red-600/30 text-red-200',
    'Medium': 'bg-orange-500/30 text-orange-200',
    'Low': 'bg-blue-500/30 text-blue-200',
    // EnvironmentStatus
    'Up': 'bg-green-500/20 text-green-300',
    'Down': 'bg-red-500/20 text-red-300',
    'Maintenance': 'bg-purple-500/20 text-purple-300',
    // GithubStatus
    'Open': 'bg-green-500/20 text-green-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Closed': 'bg-purple-500/20 text-purple-300',
  };

  const className = `${baseClasses} ${typeStyles[type] || 'bg-gray-600 text-gray-100'}`;

  return <span className={className}>{type}</span>;
};

export default Badge;
