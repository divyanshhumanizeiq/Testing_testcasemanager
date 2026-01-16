import { TestCase, TestCaseStatus, TestRun, AppEnvironment, EnvironmentStatus, GithubStatus } from './types';

// Import data from TS module files
import executiveDashboardTestCases from './data/executive_dashboard';
import authenticationTestCases from './data/authentication';
import impersonationTestCases from './data/impersonation';
import anythingLLMTestCases from './data/anything_llm';
import aiAcademyTestCases from './data/ai_academy';


export const MOCK_TEST_CASE_GROUPS = {
  'Executive Dashboard': executiveDashboardTestCases,
  'Authentication': authenticationTestCases,
  'Impersonation': impersonationTestCases,
  'Anything LLM': anythingLLMTestCases,
  'AI Academy': aiAcademyTestCases,
};

// Helper to calculate stats for a run
const calculateRunStats = (testCases: TestCase[]) => {
    const passed = testCases.filter(tc => tc.status === TestCaseStatus.Pass).length;
    const failed = testCases.filter(tc => tc.status === TestCaseStatus.Fail).length;
    const blocked = testCases.filter(tc => tc.status === TestCaseStatus.Blocked).length;
    const notRun = testCases.filter(tc => tc.status === TestCaseStatus.NotRun).length;
    return { passed, failed, blocked, notRun, totalTests: testCases.length };
};

// Test runs for the new "AI Academy" project
const aiAcademyRuns: TestRun[] = [
    {
        id: '20251007-2',
        name: 'AI Academy',
        date: '2025-10-07',
        executedBy: 'Anubha',
        testCases: aiAcademyTestCases.map(tc => ({ ...tc, status: TestCaseStatus.Pass })),
        ...calculateRunStats(aiAcademyTestCases.map(tc => ({ ...tc, status: TestCaseStatus.Pass }))),
    }
];

// Test runs for the "Anything LLM" project
const anythingLLMRuns: TestRun[] = [
    {
        id: '20250905-1',
        name: 'Anything LLM',
        date: '2025-09-05',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 1)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 2)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 3)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 4)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 5)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 6)!, status: TestCaseStatus.Pass },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 1)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 2)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 3)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 4)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 5)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 6)!, status: TestCaseStatus.Pass },
        ])
    },
    {
        id: '20250908-1',
        name: 'Anything LLM',
        date: '2025-09-08',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 7)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 8)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 20, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/20' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 9)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 10)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 27, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/27' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 11)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 12)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 13)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 14)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 15)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 21, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/21' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 16)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 17)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 22, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/22' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 18)!, status: TestCaseStatus.Pass, githubStatus: GithubStatus.Closed },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 19)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 21, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/21' },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 7)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 8)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 9)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 10)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 11)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 12)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 13)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 14)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 15)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 16)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 17)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 18)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 19)!, status: TestCaseStatus.Fail },
        ])
    },
    {
        id: '20250910-2',
        name: 'Anything LLM',
        date: '2025-09-11',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 38)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 39, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/39' },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 38)!, status: TestCaseStatus.Fail },
        ])
    },
    {
        id: '20250915-2',
        name: 'Anything LLM',
        date: '2025-09-15',
        executedBy: 'Anubha',
        testCases: [
             { ...anythingLLMTestCases.find(tc => tc.issueNumber === 42)!, status: TestCaseStatus.Pass },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 42)!, status: TestCaseStatus.Pass },
        ])
    },
    {
        id: '20250922-1',
        name: 'Anything LLM',
        date: '2025-09-15',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 57)!, status: TestCaseStatus.Fail },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 57)!, status: TestCaseStatus.Fail },
        ])
    },
    {
        id: '20250911-2',
        name: 'Anything LLM',
        date: '2025-09-11',
        executedBy: 'Purva',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 1)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 2)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 3)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 4)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 5)!, status: TestCaseStatus.Pass },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 1)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 2)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 3)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 4)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 5)!, status: TestCaseStatus.Pass },
        ])
    },
    {
        id: '20250912-1',
        name: 'Anything LLM',
        date: '2025-09-12',
        executedBy: 'Purva',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 6)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 8)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 20, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/20' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 9)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 10)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 27, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/27' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 11)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 12)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 13)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 14)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 15)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 21, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/21' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 16)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 17)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 22, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/22' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 19)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 21, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/21' },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 38)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 39, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/39' },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 6)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 8)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 9)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 10)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 11)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 12)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 13)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 14)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 15)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 16)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 17)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 19)!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 38)!, status: TestCaseStatus.Fail },
        ])
    },
    {
        id: '20250915-1',
        name: 'Anything LLM',
        date: '2025-09-15',
        executedBy: 'Prathyusha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-001')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-002')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-003')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-004')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-005')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-007')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-008')!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 20, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/20' },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-009')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-010')!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 27, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/27' },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-011')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-012')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-013')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-014')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-015')!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 21, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/21' },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-016')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-017')!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 22, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/22' },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-019')!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 21, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/21' },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-038')!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 39, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/39' },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-001')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-002')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-003')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-004')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-005')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-007')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-008')!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-009')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-010')!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-011')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-012')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-013')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-014')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-015')!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-016')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-017')!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-019')!, status: TestCaseStatus.Fail },
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-038')!, status: TestCaseStatus.Fail },
        ])
    },
    {
        id: '20250924-1',
        name: 'Anything LLM',
        date: '2025-09-24',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-P1')!, status: TestCaseStatus.Pass, githubStatus: GithubStatus.Closed },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 228)!, status: TestCaseStatus.Pass },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.id === 'TC-AL-P1')!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 228)!, status: TestCaseStatus.Pass },
        ])
    },
    {
        id: '20250925-1',
        name: 'Anything LLM',
        date: '2025-09-25',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 227)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 255)!, status: TestCaseStatus.Pass },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 227)!, status: TestCaseStatus.Pass },
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 255)!, status: TestCaseStatus.Pass },
        ])
    },
    {
        id: '20251003-1',
        name: 'Anything LLM',
        date: '2025-10-03',
        executedBy: 'Anubha',
        testCases: [
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 88)!, status: TestCaseStatus.Fail, githubStatus: GithubStatus.Open, issueNumber: 88, githubIssueLink: 'https://github.com/HumanizeIQ-LLC/anything-llm/issues/88' },
        ],
        ...calculateRunStats([
            { ...anythingLLMTestCases.find(tc => tc.issueNumber === 88)!, status: TestCaseStatus.Fail },
        ])
    },
];

export const MOCK_TEST_RUNS: TestRun[] = [
    ...aiAcademyRuns,
    ...anythingLLMRuns,
    {
        id: '20250804-1',
        name: 'Executive Dashboard',
        date: '2025-08-04',
        executedBy: 'Anubha',
        passed: 22,
        failed: 2,
        blocked: 0,
        notRun: 2,
        totalTests: executiveDashboardTestCases.length,
        testCases: executiveDashboardTestCases.map((tc, index) => {
            if (index < 22) return { ...tc, status: TestCaseStatus.Pass };
            if (index < 24) return { ...tc, status: TestCaseStatus.Fail };
            return { ...tc, status: TestCaseStatus.NotRun };
        }),
    },
    // Historical run for Executive Dashboard
    {
        id: '20250731-1',
        name: 'Executive Dashboard',
        date: '2025-07-31',
        executedBy: 'Anubha',
        passed: 20,
        failed: 5,
        blocked: 1,
        notRun: 1,
        totalTests: 27, 
        testCases: executiveDashboardTestCases.map((tc, index) => {
            if (index < 20) return { ...tc, status: TestCaseStatus.Pass };
            if (index < 25) return { ...tc, status: TestCaseStatus.Fail };
            if (index < 26) return { ...tc, status: TestCaseStatus.Blocked };
            return { ...tc, status: TestCaseStatus.NotRun };
        }),
    },
    // Added 2nd historical run for Executive Dashboard
    {
        id: '20250729-2',
        name: 'Executive Dashboard',
        date: '2025-07-29',
        executedBy: 'Anubha',
        passed: 18,
        failed: 8,
        blocked: 1,
        notRun: 0,
        totalTests: 27,
        testCases: executiveDashboardTestCases.map((tc, index) => {
            if (index < 18) return { ...tc, status: TestCaseStatus.Pass };
            if (index < 26) return { ...tc, status: TestCaseStatus.Fail };
            return { ...tc, status: TestCaseStatus.Blocked };
        }),
    },
    {
        id: 'TR-2025-08-21-B',
        name: 'Authentication',
        date: '2025-08-21',
        executedBy: 'Anubha',
        passed: 10,
        failed: 2,
        blocked: 0,
        notRun: 2,
        totalTests: authenticationTestCases.length,
        testCases: authenticationTestCases.map((tc, index) => {
            if (index < 10) return { ...tc, status: TestCaseStatus.Pass };
            if (index < 12) return { ...tc, status: TestCaseStatus.Fail };
            return { ...tc, status: TestCaseStatus.NotRun };
        }),
    },
    // Historical run for Authentication
    {
        id: 'TR-2025-08-14-B-HIST',
        name: 'Authentication',
        date: '2025-08-14',
        executedBy: 'Anubha',
        passed: 10,
        failed: 3,
        blocked: 1,
        notRun: 0,
        totalTests: 14,
        testCases: authenticationTestCases.map((tc, index) => {
            if (index < 10) return { ...tc, status: TestCaseStatus.Pass };
            if (index < 13) return { ...tc, status: TestCaseStatus.Fail };
            return { ...tc, status: TestCaseStatus.Blocked };
        })
    },
     // Added 2nd historical run for Authentication
    {
        id: 'TR-2025-08-07-B-HIST2',
        name: 'Authentication',
        date: '2025-08-07',
        executedBy: 'Anubha',
        passed: 12,
        failed: 2,
        blocked: 0,
        notRun: 0,
        totalTests: 14,
        testCases: authenticationTestCases.map((tc, index) => {
            if (index < 12) return { ...tc, status: TestCaseStatus.Pass };
            return { ...tc, status: TestCaseStatus.Fail };
        }),
    },
    {
        id: 'TR-2025-08-20-C',
        name: 'Impersonation',
        date: '2025-08-20',
        executedBy: 'Anubha',
        passed: 7,
        failed: 1,
        blocked: 0,
        notRun: 1,
        totalTests: impersonationTestCases.length,
        testCases: impersonationTestCases.map((tc, index) => {
            if (index < 7) return { ...tc, status: TestCaseStatus.Pass };
            if (index < 8) return { ...tc, status: TestCaseStatus.Fail };
            return { ...tc, status: TestCaseStatus.NotRun };
        }),
    },
     // Historical runs for Impersonation
    {
        id: 'TR-2025-08-13-C-HIST',
        name: 'Impersonation',
        date: '2025-08-13',
        executedBy: 'Anubha',
        passed: 6,
        failed: 3,
        blocked: 0,
        notRun: 0,
        totalTests: 9,
        testCases: impersonationTestCases.map((tc, index) => {
            if (index < 6) return { ...tc, status: TestCaseStatus.Pass };
            return { ...tc, status: TestCaseStatus.Fail };
        }),
    },
    {
        id: 'TR-2025-08-06-C-HIST',
        name: 'Impersonation',
        date: '2025-08-06',
        executedBy: 'Anubha',
        passed: 8,
        failed: 1,
        blocked: 0,
        notRun: 0,
        totalTests: 9,
        testCases: impersonationTestCases.map((tc, index) => {
            if (index < 8) return { ...tc, status: TestCaseStatus.Pass };
            return { ...tc, status: TestCaseStatus.Fail };
        }),
    },
    // Added 3rd historical run for Impersonation
    {
        id: 'TR-2025-07-30-C-HIST2',
        name: 'Impersonation',
        date: '2025-07-30',
        executedBy: 'Anubha',
        passed: 9,
        failed: 0,
        blocked: 0,
        notRun: 0,
        totalTests: 9,
        testCases: impersonationTestCases.map(tc => ({ ...tc, status: TestCaseStatus.Pass })),
    }
];

export const MOCK_ENVIRONMENTS: AppEnvironment[] = [
    {
        name: 'Production',
        status: EnvironmentStatus.Up,
        url: 'app.humanizeiq.com',
        lastChecked: '2024-07-29 10:00 UTC'
    },
    {
        name: 'Staging',
        status: EnvironmentStatus.Up,
        url: 'staging.humanizeiq.com',
        lastChecked: '2024-07-29 10:01 UTC'
    },
    {
        name: 'Development',
        status: EnvironmentStatus.Maintenance,
        url: 'dev.humanizeiq.com',
        lastChecked: '2024-07-29 09:45 UTC'
    },
    {
        name: 'QA',
        status: EnvironmentStatus.Down,
        url: 'qa.humanizeiq.com',
        lastChecked: '2024-07-29 09:55 UTC'
    }
];