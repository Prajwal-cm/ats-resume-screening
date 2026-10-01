# ATS Resume Screening

A modular React application that implements an Applicant Tracking System workflow:
Admin → HR account → Job post → JD requirement extraction → Resume upload →
ATS scoring → Shortlist/Reject → Interview request → Candidate response.

## ✨ Features

| Module | Description |
|---|---|
| **Admin Login** | Admin authenticates and creates/manages HR accounts |
| **HR Login** | HR recruiters access their own dashboard |
| **Job Description Management** | Create/edit job posts; ATS engine auto-extracts required skills, experience and education |
| **Resume Parser** | Extracts name, email, phone, skills, education, experience years from resume text |
| **ATS Matching Engine** | Weighted scoring: Skills (60) + Experience (25) + Education (15) |
| **Candidate Management** | Search, filter, shortlist, reject, and view detailed candidate profiles |
| **Interview Requests** | Send interview invites; candidate responds via a public token link |

## 🚀 Getting Started

```bash
npm install
npm run dev