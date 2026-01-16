import React, { useState } from 'react';
import { TestRun, TestCase } from '../types';
import Card from './ui/Card';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface ReportsProps {
  reports: TestRun[];
  testCaseGroups: { [key: string]: TestCase[] };
  setReports: React.Dispatch<React.SetStateAction<TestRun[]>>;
  onSelectReport: (report: TestRun) => void;
  onDeactivateTestCaseGroup: (groupName: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ 
    reports, 
    testCaseGroups, 
    setReports, 
    onSelectReport,
    onDeactivateTestCaseGroup
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingReport, setEditingReport] = useState<TestRun | null>(null);

  const allProjectNames = Object.keys(testCaseGroups);

  const reportsByProject = reports.reduce((acc, report) => {
    if (!acc[report.name]) acc[report.name] = [];
    acc[report.name].push(report);
    return acc;
  }, {} as Record<string, TestRun[]>);
  
  // Ensure all projects from testCaseGroups exist in reportsByProject
  allProjectNames.forEach(name => {
      if (!reportsByProject[name]) {
          reportsByProject[name] = [];
      }
  });

  const handleUpdateReport = () => {
      if (!editingReport) return;
      setReports(prev => prev.map(r => r.id === editingReport.id ? editingReport : r));
      setEditingReport(null);
  };
  
  const handleDeactivateReportClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to deactivate this test report?')) {
      setReports(prevReports => prevReports.filter(report => report.id !== id));
    }
  };

   const handleDeactivateGroupClick = (e: React.MouseEvent, groupName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to deactivate the "${groupName}" project and its associated reports?`)) {
        onDeactivateTestCaseGroup(groupName);
    }
  };

  const renderHub = () => {
    const filteredProjects = allProjectNames.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <Card>
        {filteredProjects.length > 0 ? (
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
                    {filteredProjects.map(projectName => {
                      const projectReports = (reportsByProject[projectName] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                      const latestReport = projectReports[0];
                      const totalTestCasesInProject = testCaseGroups[projectName]?.length || 0;
                      const passRate = latestReport && latestReport.totalTests > 0 ? ((latestReport.passed / latestReport.totalTests) * 100).toFixed(0) : '–';

                      return (
                        <tr
                          key={projectName}
                          className="border-b border-gray-700 last:border-none transition-colors hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => {
                            if (projectReports.length > 0) {
                              setSelectedProject(projectName)
                            } else {
                              alert(`No reports available for "${projectName}" yet.`);
                            }
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
                                        e.stopPropagation();
                                        const selectedReportId = e.target.value;
                                        if (selectedReportId) {
                                            const reportToView = projectReports.find(r => r.id === selectedReportId);
                                            if (reportToView) {
                                                onSelectReport(reportToView);
                                            }
                                        } else {
                                            // "All Batches" selected, act like row click
                                            if (projectReports.length > 0) {
                                                setSelectedProject(projectName);
                                            }
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label={`Select a report for ${projectName}`}
                                    disabled={projectReports.length === 0}
                                >
                                    {projectReports.length === 0 ? (
                                        <option value="">No reports yet</option>
                                    ) : (
                                        <>
                                            <option value="">All Batches ({projectReports.length})</option>
                                            {projectReports.map(report => (
                                                <option key={report.id} value={report.id}>
                                                    {report.id} ({report.date})
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </td>
                          <td className="p-4 text-gray-300">{totalTestCasesInProject > 0 ? totalTestCasesInProject : '–'}</td>
                          <td className="p-4 text-gray-300">{passRate}{passRate !== '–' ? '%' : ''}</td>
                          <td className="p-4 pr-6">
                              <div className="flex items-center justify-end space-x-2">
                                  <button onClick={(e) => handleDeactivateGroupClick(e, projectName)} className="p-2 text-red-500 hover:text-red-400 rounded-md hover:bg-gray-700" aria-label={`Deactivate ${projectName} project`}><Icon name="ban" className="w-5 h-5"/></button>
                              </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
              </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            {searchQuery ? (
                <p>Your search for "{searchQuery}" did not match any projects.</p>
            ) : (
                <p>There are no projects with reports to display.</p>
            )}
          </div>
        )}
      </Card>
    );
  };

    const renderProjectDetails = () => {
      if (!selectedProject) return null;
      const projectReports = (reportsByProject[selectedProject] || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return (
          <Card>
              <div className="overflow-x-auto -m-6">
                  <table className="w-full text-left table-auto">
                      <thead className="border-b-2 border-gray-700 bg-gray-800/50">
                          <tr>
                              <th className="p-4 pl-6 text-sm font-semibold text-gray-400">Batch Number</th>
                              <th className="p-4 text-sm font-semibold text-gray-400">Execution Date</th>
                              <th className="p-4 text-sm font-semibold text-gray-400">Total</th>
                              <th className="p-4 text-sm font-semibold text-gray-400">Passed</th>
                              <th className="p-4 text-sm font-semibold text-gray-400">Failed</th>
                              <th className="p-4 text-sm font-semibold text-gray-400">Blocked</th>
                              <th className="p-4 text-sm font-semibold text-gray-400">Not Run</th>
                              <th className="p-4 pr-6 text-sm font-semibold text-gray-400 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {projectReports.map(report => (
                              <tr
                                  key={report.id}
                                  className="border-b border-gray-700 last:border-none transition-colors hover:bg-gray-700/50 cursor-pointer"
                                  onClick={() => onSelectReport(report)}
                              >
                                  <td className="p-4 pl-6 font-mono text-xs text-indigo-400">{report.id}</td>
                                  <td className="p-4 text-gray-300">{report.date}</td>
                                  <td className="p-4 text-white font-semibold">{report.totalTests}</td>
                                  <td className="p-4 text-green-400">{report.passed}</td>
                                  <td className="p-4 text-red-400">{report.failed}</td>
                                  <td className="p-4 text-yellow-400">{report.blocked}</td>
                                  <td className="p-4 text-gray-400">{report.notRun}</td>
                                  <td className="p-4 pr-6">
                                      <div className="flex items-center justify-end space-x-2">
                                          <button
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingReport(report);
                                              }}
                                              className="p-2 text-indigo-500 hover:text-indigo-400 rounded-md hover:bg-gray-700"
                                              aria-label={`Edit report ${report.id}`}
                                          >
                                              <Icon name="edit" className="w-5 h-5" />
                                          </button>
                                          <button
                                              onClick={(e) => handleDeactivateReportClick(e, report.id)}
                                              className="p-2 text-red-500 hover:text-red-400 rounded-md hover:bg-gray-700"
                                              aria-label={`Deactivate report ${report.id}`}
                                          >
                                              <Icon name="ban" className="w-5 h-5" />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </Card>
      );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
          {selectedProject && (
            <button 
              onClick={() => setSelectedProject(null)} 
              className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-gray-700/50"
              aria-label="Back to Hub"
            >
                <Icon name="arrow-left" className="w-5 h-5"/>
            </button>
          )}
          <h2 className="text-3xl font-bold text-white">
            {selectedProject ? `${selectedProject} - Test Runs` : 'Test Reports Hub'}
          </h2>
        </div>
        {!selectedProject && (
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-64"
                aria-label="Search reports"
              />
          </div>
        )}
      </div>

      <div>
        {selectedProject ? renderProjectDetails() : renderHub()}
      </div>
      
      {editingReport && (
          <Modal
              isOpen={!!editingReport}
              onClose={() => setEditingReport(null)}
              title={`Edit Report: ${editingReport.id}`}
          >
              <div className="space-y-4">
                  <div>
                      <label htmlFor="report-batch" className="block text-sm font-medium text-gray-300 mb-1">Batch Number</label>
                      <input
                          type="text"
                          id="report-batch"
                          value={editingReport.id}
                          disabled
                          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                      />
                  </div>
                  <div>
                      <label htmlFor="report-date" className="block text-sm font-medium text-gray-300 mb-1">Execution Date</label>
                      <input
                          type="date"
                          id="report-date"
                          value={editingReport.date}
                          onChange={(e) => setEditingReport({...editingReport, date: e.target.value})}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
                      />
                  </div>
                  <div className="flex justify-end pt-2 space-x-3">
                      <Button variant="secondary" onClick={() => setEditingReport(null)}>Cancel</Button>
                      <Button onClick={handleUpdateReport} iconName="check">Save Changes</Button>
                  </div>
              </div>
          </Modal>
      )}
    </div>
  );
};

export default Reports;