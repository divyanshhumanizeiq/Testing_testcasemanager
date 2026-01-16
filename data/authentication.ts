
import { TestCase, Priority, TestCaseStatus } from '../types';

const authenticationTestCases: TestCase[] = [
  {
    "id": "TC1.1",
    "suite": "Authentication",
    "title": "Valid Microsoft login (HumanizeIQ)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies valid Microsoft login for a HumanizeIQ domain user.",
    "preconditions": [
      "Microsoft SSO is configured."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Login with Microsoft → email = user@humanizeiq.ai",
        "expectedResult": "Redirected to HumanizeIQ workspace, cookie set"
      }
    ]
  },
  {
    "id": "TC1.2",
    "suite": "Authentication",
    "title": "Valid Microsoft login (eTeam)",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies valid Microsoft login for an eTeam domain user.",
    "preconditions": [
      "Microsoft SSO is configured."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Login with Microsoft → email = user@eteam.com",
        "expectedResult": "Redirected to eTeam workspace, cookie set"
      }
    ]
  },
  {
    "id": "TC1.3",
    "suite": "Authentication",
    "title": "Invalid Microsoft domain",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Ensures users from non-whitelisted domains cannot log in via Microsoft SSO.",
    "preconditions": [
      "Microsoft SSO is configured."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Login with Microsoft → email = user@gmail.com",
        "expectedResult": "Access Denied"
      }
    ]
  },
  {
    "id": "TC2.1",
    "suite": "Authentication",
    "title": "Valid code, new user",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies the complete registration flow for a new user with a valid code.",
    "preconditions": [
      "A valid, unused registration code is available."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter valid code → Google login → match email → pay → workspace",
        "expectedResult": "Registration success, cookie set"
      }
    ]
  },
  {
    "id": "TC2.2",
    "suite": "Authentication",
    "title": "Valid code, mismatched email",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Ensures registration fails if the Google login email does not match the expected email.",
    "preconditions": [
      "A valid registration code is available."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter valid code → login with wrong Google email",
        "expectedResult": "Access Denied, show error"
      }
    ]
  },
  {
    "id": "TC2.3",
    "suite": "Authentication",
    "title": "Expired or already-used code",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies that used or expired codes are correctly rejected.",
    "preconditions": [],
    "steps": [
      {
        "step": 1,
        "action": "Enter used code",
        "expectedResult": "Show \"Code already registered\", redirect to login"
      }
    ]
  },
  {
    "id": "TC2.4",
    "suite": "Authentication",
    "title": "Interrupt before payment",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies that users who interrupt the registration flow before payment are prompted to complete it on next login.",
    "preconditions": [],
    "steps": [
      {
        "step": 1,
        "action": "Register → login → skip payment",
        "expectedResult": "On next login, redirected to payment page"
      }
    ]
  },
  {
    "id": "TC3.1",
    "suite": "Authentication",
    "title": "Corporate user workspace access",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Ensures corporate users only see the corporate workspace after login.",
    "preconditions": [
      "User is a corporate user."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Login",
        "expectedResult": "Workspace = [Corp only]"
      }
    ]
  },
  {
    "id": "TC3.2",
    "suite": "Authentication",
    "title": "Consumer user workspace access",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Ensures consumer users see the correct set of workspaces post-subscription.",
    "preconditions": [
      "User is a subscribed consumer user."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Post-subscription",
        "expectedResult": "Workspace = Personal (default), Professional, Family"
      }
    ]
  },
  {
    "id": "TC4.1",
    "suite": "Authentication",
    "title": "Corporate login cookie check",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies that a valid session cookie is created and can be decrypted for corporate users.",
    "preconditions": [],
    "steps": [
      {
        "step": 1,
        "action": "Login → check cookie",
        "expectedResult": "Cookie present, decrypts to correct values"
      }
    ]
  },
  {
    "id": "TC4.2",
    "suite": "Authentication",
    "title": "Consumer login cookie check",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies that a valid session cookie is created for consumer users.",
    "preconditions": [],
    "steps": [
      {
        "step": 1,
        "action": "Register + login → check cookie",
        "expectedResult": "Cookie valid, contains correct data"
      }
    ]
  },
  {
    "id": "TC4.3",
    "suite": "Authentication",
    "title": "Cookie tampering",
    "priority": Priority.High,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies that tampering with the authentication cookie is handled securely.",
    "preconditions": [
      "User is logged in with an active session cookie."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Modify cookie → validate",
        "expectedResult": "Error: response status is 400"
      }
    ]
  },
  {
    "id": "TC5.1",
    "suite": "Authentication",
    "title": "Register but don't pay",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Verifies user is redirected to subscription if they register but do not complete payment.",
    "preconditions": [],
    "steps": [
      {
        "step": 1,
        "action": "Register → login later",
        "expectedResult": "Redirect to subscription"
      }
    ]
  },
  {
    "id": "TC5.2",
    "suite": "Authentication",
    "title": "Use code again",
    "priority": Priority.Medium,
    "status": TestCaseStatus.Pass,
    "assignee": "Anubha",
    "lastUpdated": "2025-08-21",
    "runs": 1,
    "description": "Ensures the registration flow can be resumed post-login if a user uses the same code again.",
    "preconditions": [
      "User has a pending registration."
    ],
    "steps": [
      {
        "step": 1,
        "action": "Enter same code",
        "expectedResult": "Redirect to login, resume flow post-login"
      }
    ]
  }
];

export default authenticationTestCases;