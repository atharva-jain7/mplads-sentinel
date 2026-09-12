MPLADS Sentinel

AI-Powered MPLADS Monitoring, Risk Detection & Decision Support Platform
Smart India Hackathon — Problem Statement 26102

MPLADS Sentinel is an AI-assisted monitoring and analytics platform designed to help authorities monitor development works under the Members of Parliament Local Area Development Scheme (MPLADS).

The platform analyzes project, financial, execution, geographic, and historical data to identify risk indicators, anomalies, delays, cost irregularities, potential duplicate works, and unusual expenditure patterns. It prioritizes cases for human review and provides evidence-driven decision support.

Important: MPLADS Sentinel is an SIH prototype. Risk scores and anomaly indicators are decision-support signals and do not constitute findings of fraud, corruption, or legal violations.

1. Problem

MPLADS involves a large number of development works, multiple implementing agencies, administrative authorities, financial transactions, project milestones, and asset-creation activities.

Monitoring this volume of information manually makes it difficult to:

identify abnormal expenditure patterns early

detect cost overruns

identify delayed projects

compare current projects with historical or similar projects

identify potential duplicate works

detect mismatches between expenditure and physical progress

prioritize projects requiring field verification

maintain a clear record of actions taken after a risk is detected

MPLADS Sentinel addresses this by combining automated rules, machine learning, analytics, geospatial analysis, and human investigation workflows.

2. Solution

MPLADS Sentinel follows an end-to-end monitoring workflow:

MPLADS DATA
     ↓
DATA VALIDATION
     ↓
RULES + AI/ML ANALYSIS
     ↓
ANOMALY DETECTION
     ↓
RISK SCORING
     ↓
EXPLAINABLE EVIDENCE
     ↓
PRIORITY PROJECT LIST
     ↓
PROJECT INSPECTION
     ↓
DOSSIER / REPORT
     ↓
SEND TO INVESTIGATION DESK
     ↓
HUMAN ACTION & FOLLOW-UP
     ↓
RESOLUTION / AUDIT TRAIL

The core principle is:

AI does not accuse. AI prioritizes. Evidence explains. Authorities investigate. Actions are recorded.

3. Key Features

Executive Dashboard

The dashboard provides a single overview of the user's permitted jurisdiction.

Depending on the role, it can show:

total projects

sanctioned amount

expenditure

completed projects

ongoing projects

delayed projects

critical projects

₹ at risk

early warnings

risk distribution

fund utilization

project-status trends

geographic risk map

critical project preview

last data update timestamp

GIS and analytics are intentionally integrated into the dashboard rather than being separate competing navigation destinations.

Risk-Based Project Prioritization

Projects are ranked by monitoring priority using available risk indicators.

Example:

Priority 01    Project A    CRITICAL    91/100
Priority 02    Project B    CRITICAL    88/100
Priority 03    Project C    HIGH        82/100
Priority 04    Project D    HIGH        76/100

Possible risk indicators include:

schedule delay

progress/expenditure mismatch

cost anomaly

unusual financial pattern

potential duplicate

compliance indicator

historical deviation

Explainable Risk Score

Instead of presenting an unexplained AI score, the system breaks the score into contributing signals.

Example:

Risk Score: 88 / 100 — CRITICAL

Schedule anomaly          +22
Progress mismatch         +25
Cost anomaly              +18
Duplicate probability     +15
Compliance indicator       +8
                           ---
Total                     88

This allows an authority to understand why a project has been prioritized.

Project Inspection

Authorities can inspect an individual project and review:

project information

location

sanctioned amount

expenditure

physical progress

expected progress

delay

risk score

anomaly findings

financial evidence

historical comparison

peer comparison

geographic evidence

investigation status

Historical & Peer Comparison

Where historical data is available, the system compares the current project with previous records.

Possible comparisons include:

previous allocation vs current allocation

previous expenditure vs current expenditure

previous completion duration vs current duration

current project cost vs similar-project median

previous project status vs current status

Example:

Previous Allocation       ₹32 Lakh
Current Allocation       ₹48 Lakh
Historical Duration       9 Months
Current Expected Duration 14 Months

Similar Project Median   ₹31 Lakh
Current Project          ₹48 Lakh

A deviation is treated as a risk indicator requiring verification, not automatic proof of wrongdoing.

Investigation Desk

High-risk projects can be sent to a dedicated human investigation workspace.

The investigation lifecycle is:

Detected
   ↓
Under Review
   ↓
Documents Requested
   ↓
Field Verification
   ↓
Finding Recorded
   ↓
Corrective Action
   ↓
Resolved

Authorities can maintain:

assigned officer

action history

comments

requested documents

inspection status

findings

corrective actions

timestamps

attachments

resolution status

This closes the loop between AI detection and human administrative action.

Dossier / Review Report

A project can be converted into an AI-generated review dossier containing:

project details

financial analysis

progress analysis

risk score

risk factors

supporting evidence

historical comparison

geospatial findings

recommended verification steps

investigation information

action history

The dossier is a decision-support output and is not presented as an official government audit finding.

Data Import & Validation

The prototype supports dataset ingestion through a structured pipeline:

UPLOAD
   ↓
VALIDATE
   ↓
CLEAN
   ↓
ANALYZE
   ↓
RISK SCORE
   ↓
PUBLISH

The validation stage can identify issues such as:

missing fields

invalid dates

duplicate IDs

invalid coordinates

incomplete records

The resulting records are then analyzed and reflected across the dashboard and project-priority views.

4. AI / Analytics Layer

MPLADS Sentinel combines deterministic checks with statistical and predictive analysis.

Rule-Based Compliance Engine

Deterministic rules can identify conditions such as:

expenditure exceeding sanctioned amount

excessive schedule delay

progress below expected milestone

missing or invalid project information

other configured monitoring conditions

Rules are transparent and explainable.

Isolation Forest

An unsupervised anomaly-detection approach can identify projects whose combination of features is unusual compared with the available reference dataset.

It is useful when reliable fraud labels are unavailable.

The output should be interpreted as:

"This project exhibits an unusual pattern."

not:

"This project is fraudulent."

Predictive Risk Model

A predictive model can estimate the likelihood of undesirable project outcomes such as delay or cost-related risk when suitable historical training data is available.

Model outputs should be treated as risk predictions rather than definitive conclusions.

The project should not claim model accuracy unless it has actually been evaluated on appropriate data.

Financial Pattern Analysis

Financial transactions can be analyzed for unusual patterns.

Where Benford's Law is used, it is treated only as a screening signal:

Financial Digit Pattern Anomaly

An unusual digit distribution does not prove invoice fabrication or fraud and should trigger further financial verification.

Geospatial Analysis

Project coordinates can be analyzed using geographic distance calculations.

Potential duplicate detection should consider multiple factors where available:

geographic distance

project-description similarity

project category

asset type

locality

cost similarity

temporal proximity

previous/completed project status

Geographic proximity alone does not establish duplication.

5. User Roles

Ministry Authority

Scope:

All India

Focus:

national project overview

national risk distribution

state comparison

fund utilization

critical projects

early warnings

national trends

project investigation workflow

State Authority

Scope:

Entire State

Focus:

state-level risk

district comparison

project performance

fund utilization

delayed works

critical cases

early warnings

project investigation

District Authority

Scope:

Assigned District

Focus:

district project monitoring

field verification

delayed works

risk cases

project inspection

investigation actions

implementation monitoring

Member of Parliament

Scope:

Own Constituency

Focus:

own works

fund utilization

project progress

lagging works

completed assets

early warnings

projects requiring attention

The MP workflow is intentionally simpler and does not expose the administrative investigation workflow.

6. Application Structure

The primary navigation is intentionally small:

MPLADS Sentinel
│
├── Dashboard
│
├── Projects
│
├── Investigation Desk
│
├── Data / System Status
│
├── Profile
│
└── Logout

Dashboard

Answers:

What is happening?

Contains:

numbers

charts

GIS map

project health

early warnings

critical project preview

last updated information

Projects

Answers:

Which projects need attention first?

Contains the accessible project list ranked by risk/monitoring priority.

Project Inspection

Answers:

Why is this project risky?

Contains evidence, anomaly explanations, financial analysis, progress, and historical comparison.

Investigation Desk

Answers:

What action has been taken and what happens next?

Contains active and past investigations, action history, assignments, evidence, and resolution.

7. Project Risk Indicators

The platform can combine several signals into a composite monitoring score.

Typical indicators include:

Indicator

Purpose

Schedule Delay

Detect projects exceeding expected timelines

Progress/Spend Mismatch

Compare physical progress with expenditure

Cost Anomaly

Compare project cost with sanctioned and peer values

Financial Pattern

Identify unusual payment distributions

Potential Duplicate

Detect similar works using geographic and project features

Historical Deviation

Compare current project against previous records

Compliance Indicator

Detect configured rule violations

Predictive Risk

Estimate potential future project problems

8. Risk Interpretation

Example classification:

Score

Level

0–39

Low

40–59

Moderate

60–79

High

80–100

Critical

Risk scores are intended to prioritize human review.

They are not legal conclusions.

9. Data Quality & Freshness

The platform should expose data-quality information where the underlying dataset supports it.

Example:

Data Quality
94%

Financial Data       98%
Progress Data        91%
GPS Data             96%
Completion Data      87%

Records Analysed     1,250
Last Updated         11 Sep 2026, 21:45 IST

Demonstration values must be clearly identified as prototype data when they are not sourced from a live official system.

10. Security & Jurisdiction

The application is designed around role-based data access.

Conceptually:

Role
  ↓
Jurisdiction
  ↓
Permitted Projects
  ↓
Permitted Actions

Examples:

Ministry → national scope

State → state scope

District → district scope

MP → own constituency

Users should not be able to access restricted projects outside their jurisdiction.

11. Technology

The exact technology stack should match the current implementation.

Typical system layers:

Frontend
   ↓
Backend / API
   ↓
Database
   ↓
Data Processing
   ↓
AI / ML Models
   ↓
Risk Engine
   ↓
Dashboard / Investigation Workflow

Before documenting the repository, replace this section with the actual technologies used by the implementation, for example:

Frontend: [actual framework]

Backend: [actual framework]

Database: [actual database]

ML: Python / [actual libraries]

Maps: [actual mapping library/provider]

Deployment: [actual deployment platform]

Do not claim technologies that are not actually present in the repository.

12. Getting Started

Prerequisites

Install the tools required by the actual project stack.

Typical requirements may include:

Node.js

npm

Python

Git

database/runtime dependencies used by the project

Installation

Clone the repository:

git clone <repository-url>
cd <repository-directory>

Install frontend dependencies:

npm install

If the project contains a Python ML/backend environment:

pip install -r requirements.txt

Configure the environment variables required by the application.

Then run the development server using the project's existing scripts, for example:

npm run dev

Use the commands defined in the repository's package.json and backend configuration rather than assuming the commands above are exact.

13. Demonstration Workflow

A recommended SIH demonstration:

1. Login as Ministry Authority
        ↓
2. View National Dashboard
        ↓
3. Check last data update
        ↓
4. Review national KPIs
        ↓
5. View risk map and charts
        ↓
6. Review early warnings
        ↓
7. Open Projects
        ↓
8. Select highest-risk project
        ↓
9. Inspect project
        ↓
10. Review anomaly evidence
        ↓
11. Compare historical / peer data
        ↓
12. Download dossier
        ↓
13. Send to Investigation Desk
        ↓
14. Assign / update investigation
        ↓
15. Record action
        ↓
16. Track resolution

This demonstrates the complete chain:

Detection → Explanation → Prioritization → Investigation → Action

14. Design Philosophy

MPLADS Sentinel is built around five principles:

1. Proactive Monitoring

Identify risk indicators early instead of relying only on post-completion review.

2. Explainable AI

Every important risk should have an understandable reason and supporting evidence.

3. Human-in-the-Loop

AI prioritizes cases; competent authorities make administrative decisions.

4. Jurisdiction-Aware Monitoring

Each authority sees the information relevant to its administrative scope.

5. Actionable Intelligence

The system should not stop at charts and anomaly scores. It should support investigation, follow-up, and resolution tracking.

15. Limitations

This is an SIH prototype and therefore has important limitations.

Results depend on the quality and completeness of the available dataset.

Anomaly detection identifies unusual patterns, not confirmed fraud.

Benford's Law is only a financial screening technique.

Geographic proximity does not prove duplicate work.

Predictive models require appropriate historical data for reliable training and evaluation.

Demonstration/synthetic data must not be interpreted as live government data.

Final administrative, financial, technical, or legal decisions remain with the competent authority.

Integration with official MPLADS/MoSPI systems would require authorized APIs, data access, authentication, security review, and deployment approval.

16. Future Scope

Potential future integrations include:

authorized MPLADS/e-SAKSHI data APIs

automated scheduled data synchronization

mobile field-inspection workflows

geo-tagged inspection evidence

document OCR

Measurement Book document analysis

satellite/remote-sensing verification where appropriate

stronger historical project matching

model monitoring and drift detection

notification workflows

department-level performance benchmarking

immutable audit logging

integration with authorized government identity and workflow systems

These are future integration possibilities and should not be represented as currently deployed capabilities unless implemented.

17. Project Outcome

MPLADS Sentinel aims to shift MPLADS monitoring from:

Manual Monitoring
       ↓
Periodic Review
       ↓
Late Discovery

toward:

Continuous Data Analysis
       ↓
Early Risk Detection
       ↓
Prioritized Review
       ↓
Evidence-Based Investigation
       ↓
Corrective Action
       ↓
Resolution

The goal is not to replace government authorities with AI.

The goal is to help authorities determine:

Which projects need attention, why they need attention, and what evidence should be reviewed next.

18. Smart India Hackathon

Problem Statement: 26102
Domain: Governance / Public Administration / AI & Data Analytics
Project: MPLADS Sentinel

Built as a Smart India Hackathon prototype for AI-powered monitoring and analytics of MPLADS works.

19. License

Add the project's actual license here if one has been selected.

If no license has been selected yet, do not add a permissive open-source license by assumption.

20. Disclaimer

MPLADS Sentinel is a prototype developed for Smart India Hackathon.

The platform's risk scores, anomaly indicators, predictions, and recommendations are intended to support monitoring and prioritization. They do not independently establish fraud, corruption, misconduct, or legal non-compliance.

Final decisions and actions remain the responsibility of the competent authority.
