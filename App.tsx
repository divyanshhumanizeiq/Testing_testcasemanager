import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TestCasesComponent from './components/TestCases';
import TestCaseExecutionComponent from './components/TestCaseExecution';
import Reports from './components/Reports';
import Environments from './components/Environments';
import { View, TestCase, TestRun, TestCaseStatus, AppEnvironment, TestCaseExecution } from './types';
import { MOCK_TEST_CASE_GROUPS, MOCK_TEST_RUNS, MOCK_ENVIRONMENTS } from './constants';
import ReportDetailView from './components/ReportDetailView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [testCaseGroups, setTestCaseGroups] = useState(MOCK_TEST_CASE_GROUPS);
  const [testRuns, setTestRuns] = useState<TestRun[]>(MOCK_TEST_RUNS);
  const [environments, setEnvironments] = useState<AppEnvironment[]>(MOCK_ENVIRONMENTS);
  const [testCaseExecutions, setTestCaseExecutions] = useState<TestCaseExecution[]>([]);
  const [detailedReport, setDetailedReport] = useState<TestRun | null>(null);

  useEffect(() => {
    const newExecutions: TestCaseExecution[] = testRuns.flatMap(run => 
        run.testCases.map(tc => ({
            id: `TCE-${run.id}-${tc.id}`,
            project: run.name,
            batchNumber: run.id,
            testCaseId: tc.id,
            title: tc.title,
            status: tc.status,
        }))
    );
    setTestCaseExecutions(newExecutions);
  }, [testRuns]);

  const recalculateRunStats = (testCases: TestCase[]) => {
      const passed = testCases.filter(tc => tc.status === TestCaseStatus.Pass).length;
      const failed = testCases.filter(tc => tc.status === TestCaseStatus.Fail).length;
      const blocked = testCases.filter(tc => tc.status === TestCaseStatus.Blocked).length;
      const notRun = testCases.filter(tc => tc.status === TestCaseStatus.NotRun).length;
      return { passed, failed, blocked, notRun, totalTests: testCases.length };
  };

  const handleUpdateTestCase = (updatedTestCase: TestCase, runIdToUpdate?: string) => {
    // Update master list in test case groups
    const newTestCaseGroups = { ...testCaseGroups };
    for (const groupKey in newTestCaseGroups) {
      newTestCaseGroups[groupKey] = newTestCaseGroups[groupKey].map(tc =>
        tc.id === updatedTestCase.id ? updatedTestCase : tc
      );
    }
    setTestCaseGroups(newTestCaseGroups);

    // Update in test runs
    const newTestRuns = testRuns.map(run => {
      // If a specific runId is provided, only update that run.
      if (runIdToUpdate) {
        if (run.id === runIdToUpdate) {
          const testCaseExistsInRun = run.testCases.some(tc => tc.id === updatedTestCase.id);
          if (testCaseExistsInRun) {
            const updatedTestCases = run.testCases.map(tc =>
              tc.id === updatedTestCase.id ? updatedTestCase : tc
            );
            const stats = recalculateRunStats(updatedTestCases);
            return { ...run, testCases: updatedTestCases, ...stats };
          }
        }
        return run; // Return other runs unchanged
      }

      // If no runId is provided (global update), update all runs containing the test case.
      const testCaseExistsInRun = run.testCases.some(tc => tc.id === updatedTestCase.id);
      if (testCaseExistsInRun) {
        const updatedTestCases = run.testCases.map(tc =>
          tc.id === updatedTestCase.id ? updatedTestCase : tc
        );
        const stats = recalculateRunStats(updatedTestCases);
        return { ...run, testCases: updatedTestCases, ...stats };
      }
      return run;
    });
    setTestRuns(newTestRuns);

    // Update detailed report view if it's the one being shown
    if (detailedReport && (!runIdToUpdate || detailedReport.id === runIdToUpdate)) {
      const testCaseExistsInDetailedReport = detailedReport.testCases.some(tc => tc.id === updatedTestCase.id);
      if (testCaseExistsInDetailedReport) {
        const updatedTestCases = detailedReport.testCases.map(tc =>
          tc.id === updatedTestCase.id ? updatedTestCase : tc
        );
        const stats = recalculateRunStats(updatedTestCases);
        setDetailedReport({ ...detailedReport, testCases: updatedTestCases, ...stats });
      }
    }
  };

  const handleDeactivateTestCase = (testCaseId: string) => {
    // Deactivate from test case groups
    const newTestCaseGroups = { ...testCaseGroups };
    for (const groupKey in newTestCaseGroups) {
      newTestCaseGroups[groupKey] = newTestCaseGroups[groupKey].filter(tc => tc.id !== testCaseId);
    }
    setTestCaseGroups(newTestCaseGroups);

    // Deactivate from test runs
    const newTestRuns = testRuns.map(run => {
      const testCaseExistsInRun = run.testCases.some(tc => tc.id === testCaseId);
      if (testCaseExistsInRun) {
        const updatedTestCases = run.testCases.filter(tc => tc.id !== testCaseId);
        const stats = recalculateRunStats(updatedTestCases);
        return { ...run, testCases: updatedTestCases, ...stats };
      }
      return run;
    });
    setTestRuns(newTestRuns);

    // Update detailed report view if it's the one being shown
    if (detailedReport) {
        const testCaseExistsInDetailedReport = detailedReport.testCases.some(tc => tc.id === testCaseId);
        if (testCaseExistsInDetailedReport) {
            const updatedTestCases = detailedReport.testCases.filter(tc => tc.id !== testCaseId);
            const stats = recalculateRunStats(updatedTestCases);
            setDetailedReport({ ...detailedReport, testCases: updatedTestCases, ...stats });
        }
    }
  };

  const handleAddNewFile = (groupName: string, testCases: TestCase[]) => {
    setTestCaseGroups(prevGroups => ({
      ...prevGroups,
      [groupName]: testCases,
    }));
  };

  const handleAddNewTestCase = (groupName: string, newTestCase: TestCase) => {
    setTestCaseGroups(prevGroups => {
      const newGroups = { ...prevGroups };
      const groupTestCases = newGroups[groupName] || [];
      newGroups[groupName] = [newTestCase, ...groupTestCases];
      return newGroups;
    });
  };

  const handleDeactivateTestCaseGroup = (groupName: string) => {
    // Deactivate from test case groups
    const newTestCaseGroups = { ...testCaseGroups };
    delete newTestCaseGroups[groupName];
    setTestCaseGroups(newTestCaseGroups);

    // Deactivate associated test runs
    const newTestRuns = testRuns.filter(run => !run.name.toLowerCase().includes(groupName.toLowerCase()));
    setTestRuns(newTestRuns);
  };
  
  const handleAddNewBatch = (projectName: string): string | void => {
    const projectTestCases = testCaseGroups[projectName];
    if (!projectTestCases) {
      console.error(`Project "${projectName}" not found.`);
      return;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const countForToday = testRuns.filter(r => r.name === projectName && r.date === todayStr).length + 1;

    const newBatchId = `${yyyy}${mm}${dd}-${countForToday}`;

    const newTestRun: TestRun = {
        id: newBatchId,
        name: projectName,
        date: todayStr,
        // FIX: Add missing 'executedBy' property required by the TestRun type.
        executedBy: 'System',
        ...recalculateRunStats(projectTestCases.map(tc => ({ ...tc, status: TestCaseStatus.NotRun }))),
        testCases: projectTestCases.map(tc => ({ ...tc, status: TestCaseStatus.NotRun })),
    };

    setTestRuns(prevRuns => [newTestRun, ...prevRuns]);
    return newBatchId;
  };

  const handleSelectReport = (report: TestRun) => {
    setDetailedReport(report);
  };

  const handleBackToReports = () => {
    setDetailedReport(null);
  };
  
  const handleSetActiveView = (view: View) => {
    setActiveView(view);
    setDetailedReport(null);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
                  testCaseGroups={testCaseGroups} 
                  environments={environments} 
                  testRuns={testRuns} 
                  onNavigate={handleSetActiveView}
                />;
      case 'test-cases':
        return <TestCasesComponent 
                  testCaseGroups={testCaseGroups}
                  testRuns={testRuns}
                  onUpdateTestCase={handleUpdateTestCase}
                  onDeactivateTestCase={handleDeactivateTestCase}
                  onAddNewFile={handleAddNewFile}
                  onAddNewTestCase={handleAddNewTestCase}
                  onDeactivateTestCaseGroup={handleDeactivateTestCaseGroup}
                />;
      case 'test-case-execution':
          return <TestCaseExecutionComponent 
                    executions={testCaseExecutions}
                    testRuns={testRuns}
                    onUpdateTestCase={handleUpdateTestCase}
                    projectNames={Object.keys(testCaseGroups)}
                    testCaseGroups={testCaseGroups}
                    onDeactivateTestCaseGroup={handleDeactivateTestCaseGroup}
                    onAddNewBatch={handleAddNewBatch}
                 />;
      case 'reports':
        return detailedReport ? (
          <ReportDetailView 
            report={detailedReport}
            onBack={handleBackToReports}
            onUpdateTestCase={handleUpdateTestCase}
            onDeactivateTestCase={handleDeactivateTestCase}
          />
        ) : (
          <Reports 
            reports={testRuns}
            testCaseGroups={testCaseGroups}
            setReports={setTestRuns}
            onSelectReport={handleSelectReport}
            onDeactivateTestCaseGroup={handleDeactivateTestCaseGroup}
          />
        );
      case 'environments':
        return <Environments environments={environments} setEnvironments={setEnvironments} />;
      default:
        return <Dashboard 
                  testCaseGroups={testCaseGroups} 
                  environments={environments} 
                  testRuns={testRuns} 
                  onNavigate={handleSetActiveView}
                />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 font-sans h-screen flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={handleSetActiveView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 bg-gray-800 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;