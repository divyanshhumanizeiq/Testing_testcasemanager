
export enum TestCaseStatus {
  Pass = 'Pass',
  Fail = 'Fail',
  Blocked = 'Blocked',
  NotRun = 'Not Run',
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum GithubStatus {
  Open = 'Open',
  Closed = 'Closed',
  InProgress = 'In Progress',
}

export interface TestCaseStep {
  step: number;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  id: string;
  suite: string;
  title: string;
  priority: Priority;
  status: TestCaseStatus;
  assignee: string;
  lastUpdated: string;
  description: string;
  preconditions: string[];
  steps: TestCaseStep[];
  documentLink?: string;
  githubIssueLink?: string;
  githubStatus?: GithubStatus;
  issueNumber?: number;
  runs?: number;
}

export interface TestRun {
  id: string;
  name: string;
  date: string;
  executedBy: string;
  totalTests: number;
  passed: number;
  failed: number;
  blocked: number;
  notRun: number;
  testCases: TestCase[];
}

export enum EnvironmentStatus {
  Up = 'Up',
  Down = 'Down',
  Maintenance = 'Maintenance',
}

export interface AppEnvironment {
  name: string;
  status: EnvironmentStatus;
  url: string;
  lastChecked: string;
}

export interface TestCaseExecution {
  id: string;
  project: string;
  batchNumber: string;
  testCaseId: string;
  title: string;
  status: TestCaseStatus;
}

export type View = 'dashboard' | 'test-cases' | 'test-case-execution' | 'reports' | 'environments';