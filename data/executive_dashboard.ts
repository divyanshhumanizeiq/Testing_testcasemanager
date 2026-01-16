
import { TestCase, Priority, TestCaseStatus, GithubStatus } from '../types';

const executiveDashboardTestCases: TestCase[] = [
  {
    "id": "TC-ED-001",
    "suite": "Basic Dashboard Load & Filters",
    "title": "Load Executive Dashboard",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-31",
    "runs": 1,
    "description": "Verifies that the executive dashboard loads with the correct recruiter summary data upon login.",
    "preconditions": [
      "User is logged in as an executive."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Login as an executive user.",
        "expectedResult": "User is successfully authenticated."
      },
      {
        "step": 2,
        "action": "Navigate to the main dashboard.",
        "expectedResult": "The dashboard loads completely with the recruiter summary data visible."
      }
    ]
  },
  {
    "id": "TC-ED-002",
    "suite": "Basic Dashboard Load & Filters",
    "title": "Filter by Recruiter Name",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-31",
    "runs": 1,
    "description": "Ensures that filtering by a specific recruiter name updates the dashboard data accordingly.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Use the Recruiter dropdown to select a specific recruiter's name.",
        "expectedResult": "All dashboard widgets and charts update to show data only for the selected recruiter."
      }
    ]
  },
  {
    "id": "TC-ED-003",
    "suite": "Basic Dashboard Load & Filters",
    "title": "Filter by Date",
    "priority": Priority.High,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-31",
    "runs": 1,
    "description": "Verifies that the date picker correctly filters the dashboard metrics.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Select a specific date from the date picker.",
        "expectedResult": "The dashboard updates to reflect metrics for the selected date."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/201",
    "issueNumber": 201,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-004",
    "suite": "Basic Dashboard Load & Filters",
    "title": "Use Time Range Filter",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-29",
    "runs": 1,
    "description": "Checks if selecting a custom time range updates all widgets and charts correctly.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Select a custom time range (e.g., 1st-31st July).",
        "expectedResult": "All widgets and charts update to display data for the specified time range."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/202",
    "issueNumber": 202,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-005",
    "suite": "Basic Dashboard Load & Filters",
    "title": "No data for selected range",
    "priority": Priority.Low,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-29",
    "runs": 1,
    "description": "Ensures a \"No data available\" message is shown for date ranges with no activity.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Choose a future date range where no data exists.",
        "expectedResult": "The dashboard displays a \"No data available\" message or an empty state for all widgets."
      }
    ]
  },
  {
    "id": "TC-ED-006",
    "suite": "Call Distribution Widget",
    "title": "View Value Calls count",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-29",
    "runs": 1,
    "description": "Verifies the accuracy of the \"Value Calls\" count.",
    "preconditions": [
      "A recruiter with call activity is selected."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Load the dashboard for a recruiter with known call activity.",
        "expectedResult": "The widget shows the correct number of value calls."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/203",
    "issueNumber": 203,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-007",
    "suite": "Call Distribution Widget",
    "title": "View Non-Value Calls count",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-29",
    "runs": 1,
    "description": "Verifies the accuracy of the \"Non-Value Calls\" count.",
    "preconditions": [
      "A recruiter with call activity is selected."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Load the dashboard for a recruiter with known call activity.",
        "expectedResult": "The widget shows the accurate count of non-value calls."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/204",
    "issueNumber": 204,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-008",
    "suite": "Call Distribution Widget",
    "title": "Check Value Call Errors",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-07-29",
    "runs": 1,
    "description": "Ensures the error count within the widget is displayed clearly and correctly.",
    "preconditions": [
      "Data with call errors exists."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Navigate to the call distribution widget.",
        "expectedResult": "The error count is displayed clearly and accurately."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/205",
    "issueNumber": 205,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-010",
    "suite": "Call Distribution Widget",
    "title": "View Dial Pad Errors",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that the dial pad error count is displayed correctly.",
    "preconditions": [
      "User is on the dashboard with the call distribution widget visible."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Verify call control stats",
        "expectedResult": "Dial pad error count is displayed correctly."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/206",
    "issueNumber": 206,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-011",
    "suite": "Recruiter Score Chart",
    "title": "View recruiter score chart for all",
    "priority": Priority.High,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Checks if the score chart loads correctly with data for each recruiter.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Scroll to the recruiter score section.",
        "expectedResult": "The score chart loads with each recruiter's data."
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/207",
    "issueNumber": 207,
    "githubStatus": GithubStatus.Open
  },
  {
    "id": "TC-ED-012",
    "suite": "Recruiter Score Chart",
    "title": "Sort scores by highest/lowest",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that the sorting functionality on the recruiter score chart works as expected.",
    "preconditions": [
      "Recruiter score chart is visible."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Apply sorting option (if available).",
        "expectedResult": "Recruiters are sorted correctly according to their scores."
      }
    ]
  },
  {
    "id": "TC-ED-013",
    "suite": "Recruiter Score Chart",
    "title": "Hover to see tooltip/details",
    "priority": Priority.Low,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Ensures that tooltips with detailed information appear on hover.",
    "preconditions": [
      "Recruiter score chart is visible."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Hover over any score bar/line.",
        "expectedResult": "A tooltip appears showing the score %, date, and recruiter name."
      }
    ]
  },
  {
    "id": "TC-ED-014",
    "suite": "Recruiter Leader Board",
    "title": "Display top recruiters",
    "priority": Priority.High,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that the leaderboard widget correctly displays the top-performing recruiters.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "View the leaderboard widget.",
        "expectedResult": "Top performers are shown by score or metrics."
      }
    ]
  },
  {
    "id": "TC-ED-015",
    "suite": "Recruiter Leader Board",
    "title": "Leaderboard reflects date filter",
    "priority": Priority.High,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Ensures the leaderboard updates when a date filter is applied.",
    "preconditions": [
      "User is on the dashboard with the leaderboard visible."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Change the time range.",
        "expectedResult": "Leaderboard rankings update based on the filtered data."
      }
    ]
  },
  {
    "id": "TC-ED-016",
    "suite": "Recruiter Leader Board",
    "title": "Tie in performance scores",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Checks how the leaderboard handles ties in scores between recruiters.",
    "preconditions": [
      "Data exists where two recruiters have the same score."
    ],
    "steps": [
      {
        "step": 1,
        "action": "View the leaderboard.",
        "expectedResult": "Both recruiters are ranked equally or follow a consistent tie-breaking rule."
      }
    ]
  },
  {
    "id": "TC-ED-017",
    "suite": "Call Processing Funnel Chart",
    "title": "Funnel steps shown correctly",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that all steps of the call funnel are displayed correctly.",
    "preconditions": [
      "User is viewing the funnel chart."
    ],
    "steps": [
      {
        "step": 1,
        "action": "View the call funnel chart.",
        "expectedResult": "All steps (e.g., Connected -> Engaged -> Qualified) are visible."
      }
    ]
  },
  {
    "id": "TC-ED-018",
    "suite": "Call Processing Funnel Chart",
    "title": "Check conversion rates between steps",
    "priority": Priority.High,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Ensures the conversion percentage between funnel steps is calculated and displayed accurately.",
    "preconditions": [
      "User is viewing the funnel chart."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Check the transition % from step A to step B.",
        "expectedResult": "The conversion percentage is shown accurately."
      }
    ]
  },
  {
    "id": "TC-ED-019",
    "suite": "Call Processing Funnel Chart",
    "title": "Funnel reflects time filter",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that the funnel chart data updates when a new time range is applied.",
    "preconditions": [
      "User is viewing the funnel chart."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Apply a new time range.",
        "expectedResult": "The chart updates with the new data."
      }
    ]
  },
  {
    "id": "TC-ED-020",
    "suite": "Call Performance Timeline",
    "title": "View timeline of call performance",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Checks if the call performance timeline graph displays call volume/activity over time.",
    "preconditions": [
      "User is on the dashboard."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Scroll to the timeline chart.",
        "expectedResult": "The graph shows call volume/activity over time."
      }
    ]
  },
  {
    "id": "TC-ED-021",
    "suite": "Call Performance Timeline",
    "title": "Hover over graph to see details",
    "priority": Priority.Low,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Ensures that hovering over the timeline graph reveals a tooltip with specific data points.",
    "preconditions": [
      "Timeline chart is visible."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Hover on a timeline plot point.",
        "expectedResult": "A tooltip appears showing the date, count, and duration info."
      }
    ]
  },
  {
    "id": "TC-ED-022",
    "suite": "Call Performance Timeline",
    "title": "Zoom/scroll timeline",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that zoom and scroll controls on the timeline function correctly.",
    "preconditions": [
      "Timeline chart is visible."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Use zoom or scroll controls (if supported).",
        "expectedResult": "The chart adjusts its view accordingly."
      }
    ]
  },
  {
    "id": "TC-ED-023",
    "suite": "Recruiter Analysis Score Breakdown",
    "title": "View detailed recruiter score",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Ensures that a detailed breakdown of a recruiter's score can be viewed.",
    "preconditions": [
      "User is on the analysis page."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Click or view the breakdown table/chart for a recruiter.",
        "expectedResult": "A breakdown by components (e.g., call quality, quantity) is shown."
      }
    ]
  },
  {
    "id": "TC-ED-024",
    "suite": "Recruiter Analysis Score Breakdown",
    "title": "Export recruiter analysis",
    "priority": Priority.Low,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that the recruiter analysis data can be exported.",
    "preconditions": [
      "User is on the analysis page."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Click the export button (CSV/PDF).",
        "expectedResult": "A file is downloaded with all breakdown data."
      }
    ]
  },
  {
    "id": "TC-ED-025",
    "suite": "Recruiter Analysis Score Breakdown",
    "title": "Compare recruiter analysis over time",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Checks the ability to compare recruiter performance over different time periods.",
    "preconditions": [
      "User is on the analysis page for a specific recruiter."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Select a recruiter and change the date range.",
        "expectedResult": "The score breakdown updates as per the new range."
      }
    ]
  },
  {
    "id": "TC-ED-026",
    "suite": "Security & Access Control",
    "title": "Dashboard access by executive only",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Ensures that only users with executive roles can access the dashboard.",
    "preconditions": [
      "Different user roles (executive and non-executive) exist."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Log in as a non-executive role.",
        "expectedResult": "Access to the executive dashboard is denied or the user is redirected."
      }
    ]
  },
  {
    "id": "TC-ED-027",
    "suite": "Security & Access Control",
    "title": "Recruiter data privacy",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-04",
    "runs": 1,
    "description": "Verifies that one recruiter cannot see the private stats of another.",
    "preconditions": [
      "User is logged in as a standard recruiter."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Try to view another recruiter's private stats.",
        "expectedResult": "Access is restricted or the data is anonymized."
      }
    ]
  }
];

export default executiveDashboardTestCases;
