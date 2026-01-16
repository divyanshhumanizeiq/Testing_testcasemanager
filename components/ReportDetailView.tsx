import React, { useState, useCallback } from 'react';
import { TestRun, TestCase, TestCaseStatus } from '../types';
import Card from './ui/Card';
import Icon from './ui/Icon';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { summarizeTestReport } from '../services/geminiService';
import TestCaseDetailModal from './TestCaseDetailModal';

interface ReportDetailViewProps {
  report: TestRun;
  onBack: () => void;
  onUpdateTestCase: (testCase: TestCase, runId: string) => void;
  onDeactivateTestCase: (testCaseId: string) => void;
}

interface StatCardProps {
    label: string;
    value: number;
    color: string;
    onClick: () => void;
    isActive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`w-full p-4 text-center transition-all duration-200 bg-gray-700/50 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isActive ? 'ring-2 ring-indigo-500' : 'ring-1 ring-transparent'}`}
        aria-pressed={isActive}
    >
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </button>
);

const ReportDetailView: React.FC<ReportDetailViewProps> = ({ report, onBack, onUpdateTestCase, onDeactivateTestCase }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TestCaseStatus | 'all'>('all');
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null);

  const handleGenerateSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await summarizeTestReport(report);
      setSummary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [report]);
  
  const handleUpdateAndCloseModal = (updatedTestCase: TestCase) => {
    onUpdateTestCase(updatedTestCase, report.id);
    setEditingTestCase(null);
  };

  const handleDeactivateTestCase = (e: React.MouseEvent, testCaseId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to deactivate this test case? This will remove it from all reports and the main test case list.')) {
        onDeactivateTestCase(testCaseId);
    }
  };

  const filteredTestCases = statusFilter === 'all'
    ? report.testCases
    : report.testCases.filter(tc => tc.status === statusFilter);

  const renderTestCaseTable = (testCasesToShow: TestCase[]) => {
    if (testCasesToShow.length === 0) {
      return (
          <div className="text-center py-16 text-gray-400 border border-dashed border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-1">No Test Cases Found</h3>
              <p>There are no test cases that match the "{statusFilter}" status.</p>
          </div>
      );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700 max-h-[60vh] overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-700/50 sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                        <th className="p-3 font-semibold text-gray-400 w-32">ID</th>
                        <th className="p-3 font-semibold text-gray-400">Title</th>
                        <th className="p-3 font-semibold text-gray-400 w-32">Status</th>
                        <th className="p-3 font-semibold text-gray-400 w-40">Run By</th>
                        <th className="p-3 font-semibold text-gray-400 w-32">Date</th>
                        <th className="p-3 font-semibold text-gray-400 w-28">No. of Runs</th>
                        <th className="p-3 font-semibold text-gray-400 w-24 text-center">Issue #</th>
                        <th className="p-3 font-semibold text-gray-400 w-32">GitHub Status</th>
                        <th className="p-3 font-semibold text-gray-400 w-28 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {testCasesToShow.map(tc => (
                      <tr 
                        key={tc.id} 
                        className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                        onClick={() => setEditingTestCase(tc)}
                      >
                          <td className="p-3 font-mono text-indigo-400">{tc.id}</td>
                          <td className="p-3 text-white">{tc.title}</td>
                          <td className="p-3"><Badge type={tc.status} /></td>
                          <td className="p-3 text-gray-300">{report.executedBy}</td>
                          <td className="p-3 text-gray-300">{tc.lastUpdated}</td>
                          <td className="p-3 text-gray-300 text-center">{tc.runs ?? '–'}</td>
                          <td className="p-3 text-gray-300 text-center">
                              {tc.issueNumber ? (
                                  <a href={tc.githubIssueLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-indigo-400 hover:underline">
                                      #{tc.issueNumber}
                                  </a>
                              ) : ( <span className="text-gray-500"> – </span> )}
                          </td>
                          <td className="p-3">
                              {tc.githubStatus ? <Badge type={tc.githubStatus} /> : <span className="flex justify-start text-gray-500"> – </span>}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                                <button onClick={(e) => { e.stopPropagation(); setEditingTestCase(tc); }} className="p-1.5 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-gray-600" aria-label="Edit"><Icon name="edit" className="w-4 h-4"/></button>
                                <button onClick={(e) => handleDeactivateTestCase(e, tc.id)} className="p-1.5 text-red-500 hover:text-red-400 rounded-full hover:bg-gray-600" aria-label="Deactivate"><Icon name="ban" className="w-4 h-4"/></button>
                            </div>
                          </td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
            onClick={onBack} 
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-gray-700/50"
            aria-label="Back to Reports"
        >
          <Icon name="arrow-left" className="w-5 h-5"/>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white">{report.name}</h2>
          <p className="text-gray-400">Report from {report.date}</p>
        </div>
      </div>
      
      <Card className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard 
                label="Total Tests" 
                value={report.totalTests} 
                color="text-white"
                onClick={() => setStatusFilter('all')}
                isActive={statusFilter === 'all'}
            />
            <StatCard 
                label="Passed" 
                value={report.passed} 
                color="text-green-400"
                onClick={() => setStatusFilter(TestCaseStatus.Pass)}
                isActive={statusFilter === TestCaseStatus.Pass}
            />
            <StatCard 
                label="Failed" 
                value={report.failed} 
                color="text-red-400"
                onClick={() => setStatusFilter(TestCaseStatus.Fail)}
                isActive={statusFilter === TestCaseStatus.Fail}
            />
            <StatCard 
                label="Blocked" 
                value={report.blocked} 
                color="text-yellow-400"
                onClick={() => setStatusFilter(TestCaseStatus.Blocked)}
                isActive={statusFilter === TestCaseStatus.Blocked}
            />
            <StatCard 
                label="Not Run" 
                value={report.notRun} 
                color="text-gray-400"
                onClick={() => setStatusFilter(TestCaseStatus.NotRun)}
                isActive={statusFilter === TestCaseStatus.NotRun}
            />
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-200">AI Summary</h3>
                <Button onClick={handleGenerateSummary} disabled={loading} iconName="sparkles">
                    {loading ? 'Generating...' : 'Generate Summary'}
                </Button>
            </div>
            {loading && <p className="text-gray-300 animate-pulse text-sm">AI is thinking...</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {summary && <p className="text-gray-300 whitespace-pre-wrap text-sm">{summary}</p>}
        </div>

        <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Test Cases</h3>
            {renderTestCaseTable(filteredTestCases)}
        </div>

      </Card>
      
      {editingTestCase && (
        <TestCaseDetailModal 
            testCase={editingTestCase}
            onClose={() => setEditingTestCase(null)}
            onUpdateTestCase={handleUpdateAndCloseModal}
            showAIGenerator={false}
        />
      )}
    </div>
  );
};

export default ReportDetailView;