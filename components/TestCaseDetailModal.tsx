import React, { useState, useCallback } from 'react';
import { TestCase, TestCaseStep, TestCaseStatus, Priority, GithubStatus } from '../types';
import Button from './ui/Button';
import Icon from './ui/Icon';
import { generateTestCaseSteps } from '../services/geminiService';

interface TestCaseDetailModalProps {
  testCase: TestCase;
  onClose: () => void;
  onUpdateTestCase: (testCase: TestCase) => void;
  showAIGenerator?: boolean;
}

const TestCaseDetailModal: React.FC<TestCaseDetailModalProps> = ({ testCase, onClose, onUpdateTestCase, showAIGenerator = true }) => {
  const [editedTestCase, setEditedTestCase] = useState<TestCase>(testCase);
  const [featureDescription, setFeatureDescription] = useState('');
  const [generatedSteps, setGeneratedSteps] = useState<TestCaseStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateSteps = useCallback(async () => {
    if (!featureDescription.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedSteps([]);
    try {
      const steps = await generateTestCaseSteps(featureDescription);
      setGeneratedSteps(steps);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [featureDescription]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue: any = value;
    if (name === 'runs' || name === 'issueNumber') {
      finalValue = value ? parseInt(value, 10) : undefined;
      if (isNaN(finalValue)) finalValue = undefined;
    }
    setEditedTestCase(prev => ({...prev, [name]: finalValue}));
  };

  const handleStepChange = (index: number, field: 'action' | 'expectedResult', value: string) => {
    const newSteps = [...editedTestCase.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    // Re-number steps
    const renumberedSteps = newSteps.map((step, idx) => ({ ...step, step: idx + 1 }));
    setEditedTestCase(prev => ({ ...prev, steps: renumberedSteps }));
  };

  const handleAddStep = () => {
    const newStep: TestCaseStep = {
      step: editedTestCase.steps.length + 1,
      action: '',
      expectedResult: ''
    };
    setEditedTestCase(prev => ({...prev, steps: [...prev.steps, newStep]}));
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = editedTestCase.steps.filter((_, i) => i !== index);
    // Re-number steps
    const renumberedSteps = newSteps.map((step, idx) => ({ ...step, step: idx + 1 }));
    setEditedTestCase(prev => ({ ...prev, steps: renumberedSteps }));
  };

  const handlePreconditionChange = (index: number, value: string) => {
    const newPreconditions = [...editedTestCase.preconditions];
    newPreconditions[index] = value;
    setEditedTestCase(prev => ({ ...prev, preconditions: newPreconditions }));
  };

  const handleAddPrecondition = () => {
    setEditedTestCase(prev => ({ ...prev, preconditions: [...prev.preconditions, ''] }));
  };

  const handleRemovePrecondition = (index: number) => {
    const newPreconditions = editedTestCase.preconditions.filter((_, i) => i !== index);
    setEditedTestCase(prev => ({ ...prev, preconditions: newPreconditions }));
  };

  const handleSave = () => {
    onUpdateTestCase(editedTestCase);
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex-grow">
             <input 
                type="text" 
                name="title" 
                value={editedTestCase.title} 
                onChange={handleFieldChange}
                className="text-2xl font-bold text-white bg-transparent border-0 focus:ring-0 focus:outline-none w-full p-0"
             />
            <span className="font-mono text-sm text-indigo-400">{editedTestCase.id}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50">
            <Icon name="x-circle" className="w-6 h-6"/>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
           <div className="overflow-x-auto border border-gray-700 rounded-lg">
              <table className="min-w-full text-sm">
                  <thead className="bg-gray-700/50">
                      <tr>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Priority</th>
                          <th className="p-3 text-left">Created By</th>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-center">No of Runs</th>
                          <th className="p-3 text-center">Issue #</th>
                          <th className="p-3 text-left">GitHub Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                      <tr>
                          <td className="p-2">
                              <select name="status" value={editedTestCase.status} onChange={handleFieldChange} className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm">
                                {Object.values(TestCaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                          </td>
                          <td className="p-2">
                             <select name="priority" value={editedTestCase.priority} onChange={handleFieldChange} className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm">
                                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                          </td>
                          <td className="p-2"><input type="text" name="assignee" value={editedTestCase.assignee} onChange={handleFieldChange} className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm" /></td>
                          <td className="p-2"><input type="date" name="lastUpdated" value={editedTestCase.lastUpdated} onChange={handleFieldChange} className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm" /></td>
                          <td className="p-2"><input type="number" name="runs" value={editedTestCase.runs || ''} onChange={handleFieldChange} className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm text-center" /></td>
                          <td className="p-2"><input type="number" name="issueNumber" value={editedTestCase.issueNumber || ''} onChange={handleFieldChange} placeholder="#" className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm text-center" /></td>
                          <td className="p-2">
                            <select name="githubStatus" value={editedTestCase.githubStatus || ''} onChange={handleFieldChange} className="bg-gray-900 border border-gray-600 rounded w-full px-2 py-1 text-sm">
                              <option value="">None</option>
                              {Object.values(GithubStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-200">Description</h3>
            <textarea name="description" value={editedTestCase.description} onChange={handleFieldChange} rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-200">Preconditions</h3>
            <div className="space-y-2">
              {editedTestCase.preconditions.map((p, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="text" value={p} onChange={(e) => handlePreconditionChange(i, e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-1 text-sm"/>
                  <button onClick={() => handleRemovePrecondition(i)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-gray-700/50"><Icon name="trash" className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
            <Button onClick={handleAddPrecondition} variant="secondary" className="mt-2 text-xs py-1 px-3">Add Precondition</Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-200">Steps</h3>
            <div className="overflow-x-auto border border-gray-700 rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-3 text-left w-16">Step</th>
                            <th className="p-3 text-left">Action</th>
                            <th className="p-3 text-left">Expected Result</th>
                            <th className="p-3 text-left w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {editedTestCase.steps.map((s, i) => (
                            <tr key={i}>
                                <td className="p-3 font-semibold text-center align-top pt-5">{s.step}</td>
                                <td className="p-2"><textarea value={s.action} onChange={(e) => handleStepChange(i, 'action', e.target.value)} rows={2} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-1 text-sm"/></td>
                                <td className="p-2"><textarea value={s.expectedResult} onChange={(e) => handleStepChange(i, 'expectedResult', e.target.value)} rows={2} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-1 text-sm"/></td>
                                <td className="p-2 text-center align-top pt-5"><button onClick={() => handleRemoveStep(i)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-gray-700/50"><Icon name="trash" className="w-4 h-4"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Button onClick={handleAddStep} variant="secondary" className="mt-2 text-xs py-1 px-3">Add Step</Button>
          </div>

          {showAIGenerator && (
            <div className="space-y-4 pt-4 border-t border-gray-700/50">
              <h3 className="text-lg font-semibold text-indigo-400 flex items-center"><Icon name="sparkles" className="w-5 h-5 mr-2"/>AI Test Case Generator</h3>
              <textarea
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows={3}
                placeholder="Describe a user story or feature to generate test steps..."
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
              />
              <button
                onClick={handleGenerateSteps}
                disabled={isLoading || !featureDescription}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
              >
                <span>{isLoading ? 'Generating...' : 'Generate Steps'}</span>
              </button>
              {error && <p className="text-red-400 mt-2">{error}</p>}
              {generatedSteps.length > 0 && (
                  <div className="overflow-x-auto border border-gray-700 rounded-lg mt-4">
                  <table className="min-w-full text-sm">
                      <thead className="bg-gray-700/50">
                          <tr>
                              <th className="p-3 text-left w-16">Step</th>
                              <th className="p-3 text-left">Action</th>
                              <th className="p-3 text-left">Expected Result</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                          {generatedSteps.map(s => (
                              <tr key={s.step}>
                                  <td className="p-3 font-semibold text-center">{s.step}</td>
                                  <td className="p-3 text-gray-300">{s.action}</td>
                                  <td className="p-3 text-gray-300">{s.expectedResult}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center space-x-4 p-4 border-t border-gray-700 bg-gray-800/50">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} iconName="check">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default TestCaseDetailModal;