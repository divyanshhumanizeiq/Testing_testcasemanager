import React from 'react';
import { TestCaseStatus, AppEnvironment, TestCase, TestRun, View } from '../types';
import Card from './ui/Card';
import StatusPieChart from './charts/StatusPieChart';
import Badge from './ui/Badge';
import Icon from './ui/Icon';

interface DashboardProps {
  testCaseGroups: { [key: string]: TestCase[] };
  environments: AppEnvironment[];
  testRuns: TestRun[];
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ testCaseGroups, environments, testRuns, onNavigate }) => {
  // The dashboard should reflect the status from the latest test runs.
  // For projects that have never been run, all their test cases are considered 'Not Run'.

  const latestRunByProject = new Map<string, TestRun>();
  // Find the latest run for each project
  for (const run of testRuns) {
    const existingRun = latestRunByProject.get(run.name);
    if (!existingRun || new Date(run.date) > new Date(existingRun.date)) {
      latestRunByProject.set(run.name, run);
    }
  }

  const allTestCases = Object.entries(testCaseGroups).flatMap(([projectName, testCases]) => {
    const latestRun = latestRunByProject.get(projectName);
    if (latestRun) {
      // If there's a run, use the test cases and their statuses from that run.
      return latestRun.testCases;
    } else {
      // If there are no runs for this project, all its test cases are 'Not Run'.
      return testCases.map(tc => ({ ...tc, status: TestCaseStatus.NotRun }));
    }
  });
  
  const statusCounts = allTestCases.reduce((acc, testCase) => {
    acc[testCase.status] = (acc[testCase.status] || 0) + 1;
    return acc;
  }, {} as Record<TestCaseStatus, number>);

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name as TestCaseStatus,
    value,
  })).filter(item => item.value > 0);

  const totalProjects = Object.keys(testCaseGroups).length;
  const totalTestCases = Object.values(testCaseGroups).flat().length;

  const totalExecutionsHistory = testRuns.reduce((acc, run) => acc + run.totalTests, 0);

  let lastExecutionDate: string | null = null;
  if (testRuns.length > 0) {
      const sortedRuns = [...testRuns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      lastExecutionDate = sortedRuns[0].date;
  }

  const executionsOnLastDate = lastExecutionDate
      ? testRuns
          .filter(run => run.date === lastExecutionDate)
          .reduce((acc, run) => acc + run.totalTests, 0)
      : 0;

  let lastExecutionDateFormatted = 'N/A';
  if (lastExecutionDate) {
      const [year, month, day] = lastExecutionDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      lastExecutionDateFormatted = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
      });
  }


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
            className="flex items-center space-x-4 cursor-pointer transition-transform hover:scale-105"
            onClick={() => onNavigate('test-cases')}
        >
            <div className="p-3 bg-indigo-500/10 rounded-lg">
                <Icon name="folder" className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-white">{totalProjects}</p>
            </div>
        </Card>
        <Card className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
                <Icon name="test-cases" className="w-8 h-8 text-green-400" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Total Test Cases</p>
                <p className="text-2xl font-bold text-white">{totalTestCases}</p>
            </div>
        </Card>
        <Card className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Icon name="reports" className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Total Executions (History)</p>
                <p className="text-2xl font-bold text-white">{totalExecutionsHistory}</p>
            </div>
        </Card>
        <Card className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
                <Icon name="test-case-execution" className="w-8 h-8 text-purple-400" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Executions on {lastExecutionDateFormatted}</p>
                <p className="text-2xl font-bold text-white">{executionsOnLastDate}</p>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Case Summary */}
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Test Case Status Overview</h3>
          <StatusPieChart data={chartData} />
        </Card>

        {/* Environment Status */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Environment Status</h3>
          <div className="space-y-4">
            {environments.filter(env => env.name !== 'Staging' && env.name !== 'QA').map(env => (
              <div key={env.name} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-white">{env.name}</p>
                  <a href={`https://${env.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline">{env.url}</a>
                </div>
                <Badge type={env.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;