# MPLADS Sentinel - Data Dictionary

Strictly enforced camelCase JSON properties across frontend, Java backend, and Python ML service:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `projectId` | String | Unique project code (e.g., `MPL-10482`) |
| `projectName` | String | Title of MPLADS work |
| `projectType` | String | Sector category |
| `sanctionedAmount` | Double | Amount sanctioned in INR (Rs) |
| `estimatedCost` | Double | Initial estimated cost in INR (Rs) |
| `expenditureAmount` | Double | Cumulative expenditure incurred in INR (Rs) |
| `fundUtilizationPercent` | Double | (expenditureAmount / sanctionedAmount) * 100 |
| `progressPercentage` | Double | Physical progress completion percentage (0.0 to 100.0) |
| `expectedProgressPercentage` | Double | Expected progress based on timeline (0.0 to 100.0) |
| `delayDays` | Integer | Days overdue past expected completion date |
| `riskScore` | Integer | Calculated risk index from 0 to 100 |
| `riskLevel` | String | `LOW` (0-29), `MEDIUM` (30-59), `HIGH` (60-79), `CRITICAL` (80-100) |
| `paymentCount` | Integer | Total number of payment tranches disbursed |
| `latitude` | Double | WGS84 Latitude coordinate |
| `longitude` | Double | WGS84 Longitude coordinate |
| `state` | String | State / UT |
| `district` | String | Nodal District |
| `constituency` | String | Parliamentary Constituency |
| `status` | String | `RECOMMENDED`, `SANCTIONED`, `IN_PROGRESS`, `DELAYED`, `OVERDUE`, `COMPLETED` |
