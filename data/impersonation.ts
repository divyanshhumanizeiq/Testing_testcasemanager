
import { TestCase, Priority, TestCaseStatus, GithubStatus } from '../types';

const impersonationTestCases: TestCase[] = [
  {
    "id": "UI1.1",
    "suite": "Impersonation",
    "title": "Valid User ID (Corporate)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using a valid corporate user ID from Directus.",
    "preconditions": [
      "User has impersonation privileges.",
      "A valid corporate target user exists."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Go to HumanizeIQ Users in Directus → Inspect Users window → Hover to the ID → Copy ID from Element → Paste into Target User ID field → Start impersonation",
        "expectedResult": "Redirected to target corporate user's workspace"
      }
    ]
  },
  {
    "id": "UI1.2",
    "suite": "Impersonation",
    "title": "Valid User ID (Consumer)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using a valid consumer user ID from Directus.",
    "preconditions": [
      "User has impersonation privileges.",
      "A valid consumer target user exists."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Go to HumanizeIQ Users in Directus → Inspect Users window → Hover to the ID → Copy ID from Element → Paste into Target User ID field → Start impersonation",
        "expectedResult": "Redirected to target consumer user's workspace"
      }
    ]
  },
  {
    "id": "UI1.3",
    "suite": "Impersonation",
    "title": "Invalid User ID",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Ensures a proper error is shown when trying to impersonate a non-existent user ID.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter random/non-existent User ID in field",
        "expectedResult": "Show error: \"User not found\""
      }
    ]
  },
  {
    "id": "UI2.1",
    "suite": "Impersonation",
    "title": "Valid Firebase UID (Corporate)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using a valid corporate Firebase UID.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Go to HumanizeIQ Users in Directus → Select the user → Copy Auth User ID → Paste into Target Firebase UID field → Start impersonation",
        "expectedResult": "Redirected to target corporate user's workspace"
      }
    ]
  },
  {
    "id": "UI2.2",
    "suite": "Impersonation",
    "title": "Valid Firebase UID (Consumer)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using a valid consumer Firebase UID.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Go to HumanizeIQ Users in Directus → Select the user → Copy Auth User ID → Paste into Target Firebase UID field → Start impersonation",
        "expectedResult": "Redirected to target consumer user's workspace"
      }
    ]
  },
  {
    "id": "UI2.3",
    "suite": "Impersonation",
    "title": "Invalid Firebase UID",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Ensures a proper error is shown for an invalid Firebase UID.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter random UID in field",
        "expectedResult": "Show error: \"Invalid Firebase UID\""
      }
    ]
  },
  {
    "id": "UI3.1",
    "suite": "Impersonation",
    "title": "Corporate Email (HumanizeIQ)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using a HumanizeIQ corporate email.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter user@humanizeiq.ai in Target Email field → Start impersonation",
        "expectedResult": "Redirected to HumanizeIQ workspace"
      }
    ]
  },
  {
    "id": "UI3.2",
    "suite": "Impersonation",
    "title": "Corporate Email (eTeam)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using an eTeam corporate email.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter user@eteam.com in Target Email field",
        "expectedResult": "Redirected to eTeam workspace"
      }
    ]
  },
  {
    "id": "UI3.3",
    "suite": "Impersonation",
    "title": "Consumer Email (Gmail/Yahoo)",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Fail,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-20",
    "runs": 1,
    "description": "Verifies impersonation using a consumer email address.",
    "preconditions": [
      "User has impersonation privileges."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter user@gmail.com in Target Email field",
        "expectedResult": "Redirected to Consumer workspace"
      }
    ],
    "githubIssueLink": "https://github.com/humanizeiq/issues/208",
    "issueNumber": 208,
    "githubStatus": GithubStatus.Open
  }
];

export default impersonationTestCases;