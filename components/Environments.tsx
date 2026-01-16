import React, { useState } from 'react';
import { AppEnvironment, EnvironmentStatus } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface EnvironmentsProps {
  environments: AppEnvironment[];
  setEnvironments: React.Dispatch<React.SetStateAction<AppEnvironment[]>>;
}

const Environments: React.FC<EnvironmentsProps> = ({ environments, setEnvironments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEnvironmentData, setNewEnvironmentData] = useState({ name: '', url: '' });

  const handleOpenAddNewModal = () => {
    setNewEnvironmentData({ name: '', url: '' });
    setIsAddModalOpen(true);
  };

  const handleSaveNewEnvironment = () => {
    if (!newEnvironmentData.name.trim() || !newEnvironmentData.url.trim()) {
        alert('Environment Name and URL cannot be empty.');
        return;
    }
    if (environments.some(e => e.name === newEnvironmentData.name)) {
        alert(`An environment with the name "${newEnvironmentData.name}" already exists.`);
        return;
    }
    const newEnv: AppEnvironment = {
      name: newEnvironmentData.name,
      status: EnvironmentStatus.Maintenance,
      url: newEnvironmentData.url,
      lastChecked: new Date().toISOString(),
    };
    setEnvironments(prev => [newEnv, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeactivateClick = (name: string) => {
    if (window.confirm(`Are you sure you want to deactivate the "${name}" environment?`)) {
      setEnvironments(prev => prev.filter(env => env.name !== name));
    }
  };

  const filteredEnvironments = environments
    .filter(env => env.name !== 'Staging' && env.name !== 'QA')
    .filter(env => 
        env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        env.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-3xl font-bold text-white">Application Environments</h2>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-64"
              aria-label="Search environments"
            />
        </div>
      </div>
      <Card>
        {filteredEnvironments.length > 0 ? (
          <div className="overflow-x-auto -m-6">
            <table className="w-full text-left table-auto">
              <thead className="border-b-2 border-gray-700 bg-gray-800/50">
                <tr>
                  <th className="p-4 pl-6 text-sm font-semibold text-gray-400">Environment</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">URL</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Last Checked</th>
                  <th className="p-4 pr-6 text-sm font-semibold text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnvironments.map(env => (
                  <tr key={env.name} className="border-b border-gray-700 last:border-none">
                    <td className="p-4 pl-6 font-medium text-white">{env.name}</td>
                    <td className="p-4"><Badge type={env.status} /></td>
                    <td className="p-4"><a href={`https://${env.url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">{env.url}</a></td>
                    <td className="p-4 text-gray-400">{new Date(env.lastChecked).toLocaleString()}</td>
                    <td className="p-4 pr-6 text-right">
                        <button onClick={() => handleDeactivateClick(env.name)} className="p-2 text-red-500 hover:text-red-400 rounded-md hover:bg-gray-700" aria-label="Deactivate"><Icon name="ban" className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-700">
                  <td colSpan={5} className="p-4 pl-6">
                    <Button onClick={handleOpenAddNewModal} iconName="plus">
                      Add New
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <h3 className="text-xl font-semibold text-white mb-2">No Environments Found</h3>
            {searchQuery ? (
                <p>Your search for "{searchQuery}" did not match any environments.</p>
            ) : (
                <>
                  <p className="mb-4">There are no environments to display.</p>
                  <Button onClick={handleOpenAddNewModal} iconName="plus">
                    Add New
                  </Button>
                </>
            )}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Environment"
      >
        <div className="space-y-4">
            <div>
                <label htmlFor="new-env-name" className="block text-sm font-medium text-gray-300 mb-1">Environment Name</label>
                <input
                    type="text"
                    id="new-env-name"
                    value={newEnvironmentData.name}
                    onChange={(e) => setNewEnvironmentData({...newEnvironmentData, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g., Production"
                />
            </div>
            <div>
                <label htmlFor="new-env-url" className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                <input
                    type="text"
                    id="new-env-url"
                    value={newEnvironmentData.url}
                    onChange={(e) => setNewEnvironmentData({...newEnvironmentData, url: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g., app.humanizeiq.com"
                />
            </div>
            <div className="flex justify-end pt-2 space-x-3">
              <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNewEnvironment} iconName="plus">
                Add Environment
              </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default Environments;
