import React, { useState } from 'react';
import { TestCaseExecution, TestCaseStatus, TestRun, TestCase, GithubStatus } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Modal from './ui/Modal';
import TestCaseDetailModal from './TestCaseDetailModal';

interface TestCaseExecutionProps {
  executions: TestCaseExecution[];
  testRuns: TestRun[];
  onUpdateTestCase: (testCase: TestCase, runId: string) => void;
  projectNames: string[];
  testCaseGroups: { [key: string]: TestCase[] };
  onDeactivateTestCaseGroup: (groupName: string) => void;
  onAddNewBatch: (projectName: string) => string | void;
}

const TestCaseExecutionComponent: React.FC<TestCaseExecutionProps> = ({ 
  executions,
  testRuns,
  onUpdateTestCase,
  projectNames,
  testCaseGroups,
  onDeactivateTestCaseGroup,
  onAddNewBatch
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  
  const [failureModalState, setFailureModalState] = useState<{ execution: TestCaseExecution; testCase: TestCase } | null>(null);
  const [viewingTestCaseState, setViewingTestCaseState] = useState<{ testCase: TestCase; runId: string } | null>(null);
  const [failureDetails, setFailureDetails] = useState<{description: string, issueNumber?: number, githubStatus?: GithubStatus}>({ description: '' });
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  
  const executionsByProject: Record<string, TestCaseExecution[]> = executions.reduce((acc, exec) => {
    if (!acc[exec.project]) {
        acc[exec.project] = [];
    }
    acc[exec.project].push(exec);
    return acc;
  }, {} as Record<string, TestCaseExecution[]>);

  const getTestCaseFromExecution = (execution: TestCaseExecution): TestCase | undefined => {
      const run = testRuns.find(r => r.id === execution.batchNumber);
      return run?.testCases.find(tc => tc.id === execution.testCaseId);
  }

  const handlePassClick = (execution: TestCaseExecution) => {
      const testCase = getTestCaseFromExecution(execution);
      if (testCase) {
          onUpdateTestCase({ ...testCase, status: TestCaseStatus.Pass }, execution.batchNumber);
      } else {
          alert("Could not find test case details to update.");
      }
  };

  const handleFailClick = (execution: TestCaseExecution) => {
      const testCase = getTestCaseFromExecution(execution);
      if (testCase) {
          setFailureModalState({ execution, testCase });
          setFailureDetails({
              description: testCase.description || '',
              issueNumber: testCase.issueNumber,
              githubStatus: testCase.githubStatus
          });
      } else {
          alert("Could not find test case details to update.");
      }
  };

  const handleSaveFailure = () => {
    if (!failureModalState) return;
    const { execution, testCase } = failureModalState;
    const updatedTestCase: TestCase = {
        ...testCase,
        status: TestCaseStatus.Fail,
        description: failureDetails.description,
        issueNumber: failureDetails.issueNumber,
        githubStatus: failureDetails.githubStatus
    };
    onUpdateTestCase(updatedTestCase, execution.batchNumber);
    setFailureModalState(null);
  };
  
  const handleConfirmAddNewBatch = () => {
    if (selectedProject) {
        const newBatchId = onAddNewBatch(selectedProject);
        if (newBatchId) {
            setSelectedBatch(newBatchId as string);
        }
    }
    setIsAddBatchModalOpen(false);
  };

   const handleDeactivateGroupClick = (e: React.MouseEvent, groupName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to deactivate the "${groupName}" project and its associated executions? This action cannot be undone.`)) {
        onDeactivateTestCaseGroup(groupName);
    }
  };

  const handleUpdateAndCloseModal = (updatedTestCase: TestCase) => {
    if (viewingTestCaseState) {
      onUpdateTestCase(updatedTestCase, viewingTestCaseState.runId);
    }
    setViewingTestCaseState(null);
  };


  const renderDetails = () => {
    if (!selectedProject) return null;
    let projectExecutions = executions.filter(exec => exec.project === selectedProject);

    if (selectedBatch) {
        projectExecutions = projectExecutions.filter(exec => exec.batchNumber === selectedBatch);
    }
    
    return (
        <Card>
            {(projectExecutions.length === 0) ? (
                <div className="text-center py-16 text-gray-400">
                    <h3 className="text-xl font-semibold text-white mb-2">No Executions Found</h3>
                    <p>No execution records found for this project or batch.</p>
                </div>
            ) : (
                <div className="overflow-x-auto -m-6">
                    <table className="w-full text-left table-auto">
                        <thead className="border-b-2 border-gray-700 bg-gray-800/50">
                        <tr>
                            <th className="p-4 pl-6 text-sm font-semibold text-gray-400">Test Case ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                            <th className="p-4 pr-6 text-sm font-semibold text-gray-400 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {projectExecutions.map(exec => (
                            <tr 
                                key={exec.id} 
                                className="border-b border-gray-700 last:border-none hover:bg-gray-700/30 transition-colors cursor-pointer"
                                onClick={() => {
                                    const testCase = getTestCaseFromExecution(exec);
                                    if (testCase) {
                                        setViewingTestCaseState({ testCase, runId: exec.batchNumber });
                                    }
                                }}
                            >
                            <td className="p-4 pl-6 font-mono text-sm text-indigo-400">
                                {exec.testCaseId}
                            </td>
                            <td className="p-4 font-medium text-white">
                                {exec.title}
                            </td>
                            <td className="p-4">
                                <Badge type={exec.status} />
                            </td>
                            <td className="p-4 pr-6 text-center">
                                {exec.status === TestCaseStatus.NotRun || exec.status === TestCaseStatus.Blocked ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={(e) => { e.stopPropagation(); handlePassClick(exec); }} className="px-3 py-1 text-xs font-semibold rounded-md bg-green-500/20 text-green-300 hover:bg-green-500/40 transition-colors">Pass</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleFailClick(exec); }} className="px-3 py-1 text-xs font-semibold rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-colors">Fail</button>
                                    </div>
                                ) : null}
                            </td>
                            </tr>
                        ))}
                        </tbody>
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
                            <th className="p-4 text-sm font-semibold text-gray-400 w-52">Batch Filter</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Total Test Cases</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Pass Rate</th>
                            <th className="p-4 pr-6 text-sm font-semibold text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectNames.map(projectName => {
                            const allProjectExecutions = executionsByProject[projectName] || [];
                            const batchNumbers = [...new Set(allProjectExecutions.map(e => e.batchNumber))].sort().reverse();
                            
                            const totalTestCases = testCaseGroups[projectName]?.length || 0;
                            const passedCount = allProjectExecutions.filter(e => e.status === TestCaseStatus.Pass).length;
                            const totalExecutionsInRuns = allProjectExecutions.length;
                            const passRate = totalExecutionsInRuns > 0 ? ((passedCount / totalExecutionsInRuns) * 100).toFixed(0) : '–';

                            return (
                                <tr 
                                    key={projectName}
                                    className="border-b border-gray-700 last:border-none transition-colors hover:bg-gray-700/50 cursor-pointer"
                                    onClick={() => {
                                      setSelectedProject(projectName);
                                      setSelectedBatch('');
                                    }}
                                >
                                    <td className="p-4 pl-6 font-medium text-white flex items-center space-x-3">
                                        <Icon name="folder" className="w-6 h-6 text-indigo-400" />
                                        <span>{projectName}</span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            defaultValue=""
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                e.stopPropagation();

                                                if (value === '__ADD_NEW__') {
                                                    setSelectedProject(projectName);
                                                    setIsAddBatchModalOpen(true);
                                                    e.target.value = ""; // Reset dropdown
                                                } else {
                                                    setSelectedProject(projectName);
                                                    setSelectedBatch(value);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            aria-label={`Select batch number for ${projectName}`}
                                        >
                                            <option value="">All Batches</option>
                                            {batchNumbers.map(batch => (
                                                <option key={batch} value={batch}>
                                                    {batch}
                                                </option>
                                            ))}
                                            <option value="__ADD_NEW__" className="font-semibold text-indigo-400 bg-gray-800 mt-1 pt-2 border-t border-gray-600">
                                                + Add new...
                                            </option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-gray-300">{totalTestCases > 0 ? totalTestCases : '–'}</td>
                                    <td className="p-4 text-gray-300">{passRate + (passRate !== '–' ? '%' : '')}</td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={(e) => handleDeactivateGroupClick(e, projectName)} className="p-2 text-red-500 hover:text-red-400 rounded-md hover:bg-gray-700" aria-label={`Deactivate ${projectName} project`}><Icon name="ban" className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
      )
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          {selectedProject && (
            <button 
              onClick={() => {
                setSelectedProject(null);
                setSelectedBatch('');
              }} 
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-gray-700/50"
              aria-label="Back to Hub"
            >
                <Icon name="arrow-left" className="w-5 h-5"/>
            </button>
          )}
          <h2 className="text-3xl font-bold text-white">
            {selectedProject ? `${selectedProject}` : 'Test Case Execution Hub'}
          </h2>
          {selectedProject && selectedBatch && <span className="text-lg text-gray-400 font-mono bg-gray-700/50 px-3 py-1 rounded-md">{selectedBatch}</span>}
        </div>
      </div>

      <div>
        {selectedProject ? renderDetails() : renderHub()}
      </div>

      {selectedProject && (
        <Modal
          isOpen={isAddBatchModalOpen}
          onClose={() => setIsAddBatchModalOpen(false)}
          title="Confirm New Batch Creation"
        >
          <div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to create a new test batch for the project "{selectedProject}"?
              <br/><br/>
              This will generate a new test run containing all associated test cases, with their statuses set to "Not Run".
            </p>
            <div className="flex justify-end items-center space-x-4">
              <Button variant="secondary" onClick={() => setIsAddBatchModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAddNewBatch} iconName="plus">
                Confirm & Create
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {viewingTestCaseState && (
        <TestCaseDetailModal
            testCase={viewingTestCaseState.testCase}
            onClose={() => setViewingTestCaseState(null)}
            onUpdateTestCase={handleUpdateAndCloseModal}
        />
      )}

      {failureModalState && (
        <Modal
            isOpen={!!failureModalState}
            onClose={() => setFailureModalState(null)}
            title={`Log Failure: ${failureModalState.testCase.id}`}
        >
            <div className="space-y-4">
                <p className="text-gray-300 bg-gray-700/50 p-3 rounded-md">{failureModalState.testCase.title}</p>
                
                <div className="space-y-4 pt-4 border-t border-gray-600">
                    <h4 className="font-semibold text-lg text-red-400">Log Issue Details</h4>
                    <div>
                        <label htmlFor="issue-description" className="block text-sm font-medium text-gray-300 mb-1">Failure Description</label>
                        <textarea
                            id="issue-description"
                            rows={3}
                            value={failureDetails.description}
                            onChange={(e) => setFailureDetails({...failureDetails, description: e.target.value})}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Describe the failure, expected vs. actual results..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="issue-number" className="block text-sm font-medium text-gray-300 mb-1">Issue #</label>
                            <input
                                type="number"
                                id="issue-number"
                                value={failureDetails.issueNumber || ''}
                                onChange={(e) => setFailureDetails({...failureDetails, issueNumber: e.target.value ? parseInt(e.target.value, 10) : undefined})}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm"
                                placeholder="e.g., 201"
                            />
                        </div>
                        <div>
                            <label htmlFor="github-status" className="block text-sm font-medium text-gray-300 mb-1">GitHub Status</label>
                            <select
                                id="github-status"
                                value={failureDetails.githubStatus || ''}
                                onChange={(e) => setFailureDetails({...failureDetails, githubStatus: e.target.value as GithubStatus})}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">None</option>
                                {Object.values(GithubStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <Button variant="secondary" onClick={() => setFailureModalState(null)}>Cancel</Button>
                    <Button onClick={handleSaveFailure} iconName="check">Save Failure</Button>
                </div>
            </div>
        </Modal>
      )}

    </div>
  );
};

export default TestCaseExecutionComponent;