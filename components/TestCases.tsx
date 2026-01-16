import React, { useState, useEffect } from 'react';
import { TestCase, Priority, TestCaseStatus, TestRun, GithubStatus } from '../types';
import Badge from './ui/Badge';
import Card from './ui/Card';
import TestCaseDetailModal from './TestCaseDetailModal';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface TestCasesProps {
    testCaseGroups: { [key: string]: TestCase[] };
    testRuns: TestRun[];
    onUpdateTestCase: (testCase: TestCase, runId?: string) => void;
    onDeactivateTestCase: (testCaseId: string) => void;
    onAddNewFile: (groupName: string, testCases: TestCase[]) => void;
    onAddNewTestCase: (groupName: string, newTestCase: TestCase) => void;
    onDeactivateTestCaseGroup: (groupName: string) => void;
}

const TestCases: React.FC<TestCasesProps> = ({ 
    testCaseGroups, 
    testRuns, 
    onUpdateTestCase, 
    onDeactivateTestCase, 
    onAddNewFile, 
    onAddNewTestCase, 
    onDeactivateTestCaseGroup,
}) => {
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const [isAddTestCaseModalOpen, setIsAddTestCaseModalOpen] = useState(false);
  const initialNewTestCaseState = {
      title: '',
      priority: Priority.Medium,
      description: '',
  };
  const [newTestCaseData, setNewTestCaseData] = useState<{title: string; priority: Priority; description: string}>(initialNewTestCaseState);

  const [selectedRunIdsInHub, setSelectedRunIdsInHub] = useState<Record<string, string>>({});
  const [activeRunIdForSelectedGroup, setActiveRunIdForSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    const initialSelectedRuns: Record<string, string> = {};
    if (Object.keys(testCaseGroups).length > 0) {
        for (const groupName in testCaseGroups) {
            const projectRuns = testRuns
                .filter(run => run.name.toLowerCase().includes(groupName.toLowerCase()))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            if (projectRuns.length > 0) {
                initialSelectedRuns[groupName] = projectRuns[0].id;
            }
        }
        setSelectedRunIdsInHub(initialSelectedRuns);
    }
  }, [testCaseGroups, testRuns]);


  const handleRowClick = (testCase: TestCase) => {
    setSelectedTestCase(testCase);
  };

  const handleCloseModal = () => {
    setSelectedTestCase(null);
  };

  const handleUpdateAndCloseModal = (updatedTestCase: TestCase) => {
    onUpdateTestCase(updatedTestCase);
    handleCloseModal();
  };
  
  const handleDeactivateClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to deactivate this test case? This will remove it from all associated reports.')) {
        onDeactivateTestCase(id);
    }
  };

  const handleOpenAddNewTestCaseModal = () => {
    setNewTestCaseData(initialNewTestCaseState);
    setIsAddTestCaseModalOpen(true);
  };

  const handleSaveNewTestCase = () => {
      if (!selectedGroup || !newTestCaseData.title.trim()) {
          alert('Title is required to create a new test case.');
          return;
      }

      const prefix = selectedGroup.split(' ').map(s => s[0]).join('').toUpperCase();
      const newId = `TC-${prefix}-${Math.floor(100 + Math.random() * 900)}`;

      const newTestCase: TestCase = {
          id: newId,
          suite: selectedGroup,
          title: newTestCaseData.title,
          priority: newTestCaseData.priority,
          status: TestCaseStatus.NotRun,
          assignee: 'Anubha', // Default assignee
          lastUpdated: new Date().toISOString().split('T')[0],
          description: newTestCaseData.description,
          preconditions: ['Precondition to be defined.'],
          steps: [{ step: 1, action: 'Action to be defined.', expectedResult: 'Expected result to be defined.' }],
          runs: 0,
      };

      onAddNewTestCase(selectedGroup, newTestCase);
      setIsAddTestCaseModalOpen(false);
  };
  
  const handleAddNewProject = () => {
    if (!newProjectName.trim()) {
      alert('Project name cannot be empty.');
      return;
    }
    onAddNewFile(newProjectName.trim(), []);
    setIsAddProjectModalOpen(false);
    setNewProjectName('');
  };

   const handleDeactivateGroupClick = (e: React.MouseEvent, groupName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to deactivate the "${groupName}" project and its associated reports?`)) {
        onDeactivateTestCaseGroup(groupName);
    }
  };

  const renderGroupDetails = () => {
    if (!selectedGroup) return null;

    // Get the master list of test cases for the selected project.
    const masterTestCases = testCaseGroups[selectedGroup] || [];
    
    // Find the run that is currently selected.
    const selectedRun = testRuns.find(run => run.id === activeRunIdForSelectedGroup);
    
    let activeTestCases: TestCase[];

    if (selectedRun) {
        // If a run is selected, use the master list as the source of truth
        // and enrich it with statuses from that specific run.
        const runTestCasesMap = new Map(selectedRun.testCases.map(tc => [tc.id, tc]));
        
        activeTestCases = masterTestCases.map(masterTC => {
            const runTC = runTestCasesMap.get(masterTC.id);
            // If the master TC is in the run, merge them (run status takes precedence).
            // If not (e.g., new TC), use the master TC as-is (status will be 'Not Run').
            return runTC ? { ...masterTC, ...runTC } : masterTC;
        });
    } else {
        // If no run is selected, just show the master list.
        activeTestCases = masterTestCases;
    }

    const filteredTestCases = searchQuery
      ? activeTestCases.filter(tc =>
          tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tc.lastUpdated.includes(searchQuery)
        )
      : activeTestCases;

    if (activeTestCases.length === 0) {
        return (
            <Card>
                <div className="text-center py-16 text-gray-400">
                    <h3 className="text-xl font-semibold text-white mb-2">No Test Cases Yet</h3>
                    <p className="mb-4">Get started by adding the first test case to this project.</p>
                    <Button onClick={handleOpenAddNewTestCaseModal} iconName="plus">
                        Add New
                    </Button>
                </div>
            </Card>
        );
    }
    
    return (
        <Card>
            {filteredTestCases.length === 0 && searchQuery ? (
                <div className="text-center py-16 text-gray-400">
                    <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                    <p>Your search for "{searchQuery}" did not match any test cases.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -m-6">
                    <table className="w-full text-left table-auto">
                        <thead className="border-b-2 border-gray-700 bg-gray-800/50">
                            <tr>
                                <th className="p-4 pl-6 text-sm font-semibold text-gray-400 w-32">ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Title</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-28">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-28">Priority</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-32">Created By</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-32">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Batch Number</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-28">No. of Runs</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-24 text-center">Issue #</th>
                                <th className="p-4 text-sm font-semibold text-gray-400 w-32">GitHub Status</th>
                                <th className="p-4 pr-6 text-sm font-semibold text-gray-400 w-28 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestCases.map((tc) => {
                                const batchNumber = testRuns
                                        .filter(run => run.testCases.some(runTc => runTc.id === tc.id))
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.id;

                                return (
                                  <tr 
                                    key={tc.id} 
                                    className="border-b border-gray-700 last:border-none transition-colors hover:bg-gray-700/50 cursor-pointer"
                                    onClick={() => handleRowClick(tc)}
                                  >
                                    <td className="p-4 pl-6 font-mono text-sm text-indigo-400">{tc.id}</td>
                                    <td className="p-2 font-medium text-white">{tc.title}</td>
                                    <td className="p-2"><Badge type={tc.status} /></td>
                                    <td className="p-2"><Badge type={tc.priority} /></td>
                                    <td className="p-2 text-gray-300">{tc.assignee}</td>
                                    <td className="p-2 text-gray-300">{tc.lastUpdated}</td>
                                    <td className="p-2 font-mono text-xs text-gray-400">
                                        {batchNumber || <span className="text-gray-500">N/A</span>}
                                    </td>
                                    <td className="p-2 text-gray-300 text-center">{tc.runs ?? '–'}</td>
                                    <td className="p-2 text-gray-300 text-center">
                                      {tc.issueNumber ? (
                                          <a href={tc.githubIssueLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-indigo-400 hover:underline">
                                              #{tc.issueNumber}
                                          </a>
                                      ) : ( <span className="text-gray-500"> – </span> )}
                                    </td>
                                    <td className="p-2">
                                      {tc.githubStatus ? <Badge type={tc.githubStatus} /> : <span className="flex justify-start text-gray-500"> – </span>}
                                    </td>
                                    <td className="p-2 pr-6 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                          <button onClick={(e) => handleDeactivateClick(e, tc.id)} className="p-1.5 text-red-500 hover:text-red-400 rounded-full hover:bg-gray-700" aria-label="Deactivate"><Icon name="ban" className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                  </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-gray-700">
                                <td colSpan={11} className="p-4 pl-6">
                                    <Button
                                        onClick={handleOpenAddNewTestCaseModal}
                                        iconName="plus"
                                    >
                                        Add New
                                    </Button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </Card>
    );
  };

  const renderHub = () => {
    return (
        <Card>
            <div className="overflow-x-auto -m-6">
                <table className="w-full text-left table-auto">
                    <thead className="border-b-2 border-gray-700 bg-gray-800/50">
                        <tr>
                            <th className="p-4 pl-6 text-sm font-semibold text-gray-400">Project</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Execution Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Test Cases</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Issues Open</th>
                            <th className="p-4 pr-6 text-sm font-semibold text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(testCaseGroups).map(([groupName, testCases]) => {
                            const projectRuns = testRuns
                                .filter(run => run.name.toLowerCase().includes(groupName.toLowerCase()))
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                            const selectedRunForGroup = projectRuns.find(r => r.id === selectedRunIdsInHub[groupName]);
                            
                            const testCasesForStats = selectedRunForGroup ? selectedRunForGroup.testCases : testCases;
                            const openIssuesCount = testCasesForStats.filter(tc => tc.githubStatus === GithubStatus.Open).length;

                            return (
                                <tr 
                                    key={groupName}
                                    className="border-b border-gray-700 last:border-none transition-colors hover:bg-gray-700/50 cursor-pointer"
                                    onClick={() => {
                                        setSelectedGroup(groupName);
                                        setActiveRunIdForSelectedGroup(selectedRunIdsInHub[groupName] || null);
                                    }}
                                >
                                    <td className="p-4 pl-6 font-medium text-white flex items-center space-x-3">
                                        <Icon name="folder" className="w-6 h-6 text-indigo-400" />
                                        <span>{groupName}</span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={selectedRunIdsInHub[groupName] || ''}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setSelectedRunIdsInHub(prev => ({ ...prev, [groupName]: e.target.value }));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-gray-700/50 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={`Select execution date for ${groupName}`}
                                            disabled={projectRuns.length === 0}
                                        >
                                            {projectRuns.length === 0 ? (
                                                <option value="">No executions yet</option>
                                            ) : (
                                                projectRuns.map(run => (
                                                    <option key={run.id} value={run.id}>
                                                        {run.date}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </td>
                                    <td className="p-4 text-gray-300">{testCases.length > 0 ? testCases.length : '–'}</td>
                                    <td className="p-4 text-gray-300">
                                        {(openIssuesCount > 0 ? (
                                            <span className="flex items-center space-x-2">
                                                <Icon name="github" className="w-4 h-4 text-gray-400" />
                                                <span>{openIssuesCount}</span>
                                            </span>
                                        ) : ( '–' ))}
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={(e) => handleDeactivateGroupClick(e, groupName)} className="p-2 text-red-500 hover:text-red-400 rounded-md hover:bg-gray-700" aria-label={`Deactivate ${groupName} project`}><Icon name="ban" className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-gray-700">
                            <td colSpan={5} className="p-4 pl-6">
                                <Button 
                                  onClick={() => setIsAddProjectModalOpen(true)}
                                  iconName="plus"
                                >
                                    Add New
                                </Button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Card>
      )
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          {selectedGroup && (
            <button 
              onClick={() => {
                setSelectedGroup(null);
                setActiveRunIdForSelectedGroup(null);
                setSearchQuery('');
              }} 
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-gray-700/50"
              aria-label="Back to Hub"
            >
                <Icon name="arrow-left" className="w-5 h-5"/>
            </button>
          )}
          <h2 className="text-3xl font-bold text-white">
            {selectedGroup ? selectedGroup : 'Test Cases Hub'}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
            {selectedGroup && (
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    placeholder="Search by title or YYYY-MM-DD..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-64"
                    aria-label="Search test cases"
                    />
                </div>
            )}
        </div>
      </div>

      <div>
        {selectedGroup ? renderGroupDetails() : renderHub()}
      </div>

      {selectedTestCase && (
        <TestCaseDetailModal
          testCase={selectedTestCase}
          onClose={handleCloseModal}
          onUpdateTestCase={handleUpdateAndCloseModal}
        />
      )}

      <Modal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        title="Add New Project"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="new-project-name" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
            <input
              type="text"
              id="new-project-name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g., New Feature"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleAddNewProject} iconName="plus">
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {selectedGroup && (
        <Modal
          isOpen={isAddTestCaseModalOpen}
          onClose={() => setIsAddTestCaseModalOpen(false)}
          title={`Add New Test Case to "${selectedGroup}"`}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="new-tc-title" className="block text-sm font-medium text-gray-300 mb-1">Test Case Title</label>
              <input
                type="text"
                id="new-tc-title"
                value={newTestCaseData.title}
                onChange={(e) => setNewTestCaseData({...newTestCaseData, title: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g., Verify user can reset password"
              />
            </div>
            <div>
                <label htmlFor="new-tc-priority" className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                <select
                    id="new-tc-priority"
                    value={newTestCaseData.priority}
                    onChange={(e) => setNewTestCaseData({...newTestCaseData, priority: e.target.value as Priority})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="new-tc-description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                id="new-tc-description"
                rows={3}
                value={newTestCaseData.description}
                onChange={(e) => setNewTestCaseData({...newTestCaseData, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="A brief summary of what this test case covers."
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveNewTestCase} iconName="plus">
                Create Test Case
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default TestCases;