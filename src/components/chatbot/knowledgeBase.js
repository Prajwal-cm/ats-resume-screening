export const QUICK_REPLIES = [
  'How do I upload resumes?',
  'How is the ATS score calculated?',
  'Why is my score low?',
  'How do I add a job post?',
  'How do I shortlist a candidate?',
  'How do I send an interview request?',
  'What is a "missing skill"?',
  'How do I navigate the app?',
];

/**
 * Each entry has:
 *  - id: unique key
 *  - patterns: array of regex or keywords (lowercased input matched against)
 *  - answer: string OR function(context) => string
 *  - followUps: suggested next questions
 *  - pages: (optional) only show this entry when on these routes
 */
export const KNOWLEDGE_BASE = [
  // -----------------------------
  // UPLOAD RESUME
  // -----------------------------
  {
    id: 'upload-resume',
    patterns: [
      /upload.*resume/i,
      /add.*resume/i,
      /how.*upload/i,
      /screen.*resume/i,
      /resume.*upload/i,
    ],
    answer: () => `
**Uploading Resumes**

1. Log in as **HR**.
2. Open **Job Posts** in the sidebar.
3. Click any job card to open its detail page.
4. Scroll to the **Upload Resumes** card (below "Extracted Requirements").
5. Either:
   - Drag a **.txt / .md** file onto the drop zone, **or**
   - Paste resume text into the textarea.
6. Click **Parse & Score Resumes**.

⚠️ The uploader only accepts **plain text** files. For PDFs, open the PDF, copy the text, and paste it into the textarea.
    `.trim(),
    followUps: ['How is the ATS score calculated?', 'Where do I see results?'],
  },

  // -----------------------------
  // ADD JOB POST
  // -----------------------------
  {
    id: 'add-job',
    patterns: [
      /add.*job/i,
      /create.*job/i,
      /new.*job/i,
      /post.*job/i,
      /job.*description/i,
      /jd/i,
    ],
    answer: () => `
**Creating a Job Post**

1. From any dashboard, click **Job Posts** in the sidebar.
2. Click **+ Create Job Post** (top right).
3. Fill in:
   - **Title** (required) — e.g. "Senior Frontend Engineer"
   - Department, Location, Employment type
   - **Description** (required, min 40 chars)
4. Click **Analyze JD** to preview extracted requirements.
5. Click **Create Job Post** to save.

💡 **Tip:** Mention specific skills, years of experience, and education in the description. The ATS engine reads them automatically.
    `.trim(),
    followUps: ['How do I upload resumes?', 'What does the ATS engine extract?'],
  },

  // -----------------------------
  // ATS SCORE
  // -----------------------------
  {
    id: 'ats-score',
    patterns: [
      /ats.*score/i,
      /how.*score/i,
      /score.*calculat/i,
      /matching.*score/i,
      /how.*match/i,
      /scoring/i,
    ],
    answer: () => `
**How ATS Score Is Calculated**

The ATS engine uses a **weighted 100-point model**:

| Component | Weight | Rule |
|---|---|---|
| **Skills match** | 60 pts | (matched required skills ÷ total required skills) × 60 |
| **Experience** | 25 pts | min(candidate years ÷ required years, 1) × 25 |
| **Education** | 15 pts | Full points if candidate's degree ≥ required, else reduced |

**Interpretation:**

| Score | Label | Action |
|---|---|---|
| 85–100 | Excellent Match | Auto-shortlisted |
| 70–84 | High Match | Auto-shortlisted |
| 50–69 | Moderate Match | Manual review |
| 0–49 | Low Match | Likely reject |

**Example:** A candidate with 8/10 required skills, 6 yrs vs 5 required, Bachelor's degree
→ 48 + 25 + 15 = **88/100** (Excellent).
    `.trim(),
    followUps: ['Why is my score low?', 'What is a missing skill?'],
  },

  // -----------------------------
  // LOW SCORE
  // -----------------------------
  {
    id: 'low-score',
    patterns: [
      /low.*score/i,
      /score.*low/i,
      /why.*low/i,
      /bad.*score/i,
      /poor.*match/i,
    ],
    answer: (ctx) => {
      const c = ctx?.candidate;
      if (c) {
        return `
**Why "${c.name}" Scored Low**

This candidate scored **${c.score}/100**. Breakdown:

- Skills: ${c.breakdown?.skills ?? 0}/60
- Experience: ${c.breakdown?.experience ?? 0}/25
- Education: ${c.breakdown?.education ?? 0}/15

**Missing skills (${c.missing?.length ?? 0}):**
${(c.missing || []).map((s) => `• ${s}`).join('\n') || '• None'}

**Common reasons for low scores:**
1. Resume doesn't list required skills explicitly
2. Experience below the JD requirement
3. Education level lower than required
4. Resume text is too short to parse

💡 **Tip:** Ask candidates to list skills exactly as they appear in the job description.
        `.trim();
      }
      return `
**Why a Score Might Be Low**

The ATS score is 100% based on the resume text. Common causes:

1. **Missing keywords** — the resume doesn't mention required skills
2. **Lower experience** — candidate has fewer years than the JD asks
3. **Education mismatch** — degree level below requirement
4. **Thin resume** — too little text for the parser to detect skills

**Check the "Missing" chips** on the candidate profile to see exactly what's absent.
      `.trim();
    },
    followUps: ['What is a missing skill?', 'How can I improve match results?'],
  },

  // -----------------------------
  // MISSING SKILLS
  // -----------------------------
  {
    id: 'missing-skills',
    patterns: [
      /missing.*skill/i,
      /skill.*missing/i,
      /gap/i,
      /what.*missing/i,
    ],
    answer: (ctx) => {
      const c = ctx?.candidate;
      if (c?.missing?.length) {
        return `
**Missing Skills for "${c.name}"**

The ATS engine detected these required skills that were **not found** in the resume:

${c.missing.map((s) => `• \`${s}\``).join('\n')}

**What to do:**
1. Open the candidate profile
2. Review the "Missing (N)" section
3. Decide whether the gap is critical for this role
4. If borderline → move to "Review" status instead of rejecting
        `.trim();
      }
      return `
**What "Missing Skills" Means**

The ATS engine extracts required skills from the job description, then scans the resume for each one. Any required skill not found is flagged as **missing**.

You'll see them:
- As red chips labeled "Missing (N)" on the **Candidate Profile** page
- In the **ATS Score Breakdown** card

**Use it to:**
- Spot training opportunities
- Decide whether to shortlist a borderline candidate
- Improve the job description if too many candidates are missing the same skill
      `.trim();
    },
    followUps: ['How is the ATS score calculated?', 'How do I shortlist a candidate?'],
  },

  // -----------------------------
  // SHORTLIST CANDIDATE
  // -----------------------------
  {
    id: 'shortlist',
    patterns: [
      /shortlist/i,
      /short.*list/i,
      /select.*candidate/i,
      /approve/i,
    ],
    answer: () => `
**Shortlisting a Candidate**

**Automatic shortlist:** Any candidate scoring **≥ 70** is automatically marked **Shortlisted** when their resume is parsed.

**Manual shortlist:**

1. Go to **Candidates** in the sidebar
2. Find the candidate row
3. Click **Shortlist** in the Actions column, **or**
4. Open the candidate profile → change **Status** dropdown → Save

**Statuses available:**
- New, Shortlisted, Review, Rejected, Interview, Selected
    `.trim(),
    followUps: ['How do I send an interview request?', 'How do I reject a candidate?'],
  },

  // -----------------------------
  // INTERVIEW REQUEST
  // -----------------------------
  {
    id: 'interview',
    patterns: [
      /interview/i,
      /send.*request/i,
      /schedule/i,
      /invite.*candidate/i,
    ],
    answer: () => `
**Sending an Interview Request**

1. Open a **shortlisted** candidate's profile
2. Scroll to the **Send Interview Request** card (right column)
3. Fill in:
   - Date
   - Time
   - Mode (Video Call / Phone / On-site)
   - Message (pre-filled — edit if you like)
4. Click **Send Interview Request**

✅ The candidate's status automatically changes to **Interview**.

**The candidate then:**
- Receives a link like \`/candidate/respond/<token>\`
- Opens it, sees the invitation, clicks **Accept** or **Decline**

**You can track responses** on the **Interviews** page (sidebar).
    `.trim(),
    followUps: ['How do I check interview responses?', 'How do I update candidate status?'],
  },

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  {
    id: 'navigate',
    patterns: [
      /navigate/i,
      /how.*use.*app/i,
      /where.*is/i,
      /find.*page/i,
      /help.*navigate/i,
      /getting.*started/i,
    ],
    answer: () => `
**Navigating the ATS App**

**Sidebar (left):**
- 🏠 **Dashboard** — stats and recent activity
- 💼 **Job Posts** — create, edit, delete job openings
- 👥 **Candidates** — all screened candidates
- 📅 **Interviews** — interview requests and responses

**Top bar:**
- User info + **Logout**

**Typical HR workflow:**
1. Job Posts → + Create Job Post
2. Open the job → Upload Resumes
3. View parsed candidates in Screening Results
4. Shortlist / Reject from Candidates page
5. Open a shortlisted profile → Send Interview Request
6. Track responses in Interviews

**Admin only:**
- Admin Dashboard → Create HR Accounts
    `.trim(),
    followUps: ['How do I upload resumes?', 'How do I add a job post?'],
  },

  // -----------------------------
  // ADMIN CREATES HR
  // -----------------------------
  {
    id: 'create-hr',
    patterns: [
      /create.*hr/i,
      /add.*hr/i,
      /new.*hr/i,
      /hr.*account/i,
      /admin.*create/i,
    ],
    answer: () => `
**Creating an HR Account (Admin only)**

1. Log in as **Admin** (\`admin@ats.com\` / \`admin123\`)
2. You'll land on the **Admin Dashboard**
3. Click **+ Create HR Account** (top right)
4. Fill in:
   - Full name
   - Email address
   - Temporary password (min 6 characters)
5. Click **Create Account**

The HR user can now log in with those credentials and access the HR dashboard.
    `.trim(),
    followUps: ['What can HR do?', 'How do I log in as Admin?'],
  },

  // -----------------------------
  // UPDATE STATUS
  // -----------------------------
  {
    id: 'update-status',
    patterns: [
      /update.*status/i,
      /change.*status/i,
      /mark.*selected/i,
      /reject.*candidate/i,
    ],
    answer: () => `
**Updating a Candidate's Status**

1. Open the candidate's profile
2. In the **Update Status** card (right column):
   - Choose a status: New, Shortlisted, Review, Rejected, Interview, Selected
   - Click **Save Status**
3. Or use quick actions:
   - **Mark Selected** → moves to final stage
   - **Reject** → removes from pipeline

**Tip:** You can also change status directly from the **Candidates** table.
    `.trim(),
    followUps: ['How do I shortlist a candidate?', 'How do I send an interview request?'],
  },

  // -----------------------------
  // HELP / FALLBACK
  // -----------------------------
  {
    id: 'help',
    patterns: [
      /help/i,
      /what.*can.*do/i,
      /hi|hello|hey/i,
      /guide/i,
    ],
    answer: () => `
**Hi! 👋 I'm your ATS Assistant.**

I can help you with:

- 📤 **Uploading resumes**
- 💼 **Creating job posts**
- 🎯 **Understanding ATS scores**
- 🔍 **Identifying missing skills**
- ⭐ **Shortlisting candidates**
- 📅 **Sending interview requests**
- 🧭 **Navigating the app**
- 👤 **Admin tasks (HR account creation)**

**Try asking:**
- "How do I upload resumes?"
- "Why is my score low?"
- "What is a missing skill?"

Or click one of the quick replies below. 👇
    `.trim(),
    followUps: QUICK_REPLIES.slice(0, 4),
  },
];