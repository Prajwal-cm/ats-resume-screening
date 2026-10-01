import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import Select from '../components/common/Select';
import ScoreBreakdown from '../components/candidates/ScoreBreakdown';
import InterviewRequestForm from '../components/interviews/InterviewRequestForm';
import { candidateService } from '../services/candidateService';
import { jobService } from '../services/jobService';
import { interviewService } from '../services/interviewService';
import { useAsync } from '../hooks/useAsync';
import { useChatbot } from '../hooks/useChatbot';
import { CANDIDATE_STATUS, SCORE_THRESHOLD } from '../utils/constants';
import { formatDate, initials } from '../utils/formatters';

export default function CandidateProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── 1. Declare hooks first ──────────────────────
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const { updateContext } = useChatbot();

  const candidate = useAsync(() => candidateService.getById(id), [id]);
  const job = useAsync(
    async () => (candidate.data ? jobService.getById(candidate.data.jobId) : null),
    [candidate.data?.jobId]
  );

  // ── 2. Now it's safe to use `candidate` ─────────
  useEffect(() => {
    if (candidate.data) {
      updateContext({ candidate: candidate.data });
    }
  }, [candidate.data, updateContext]);

  // ── 3. Early returns come AFTER all hooks ───────
  if (candidate.loading) return <Loader label="Loading candidate…" />;
  if (candidate.error) return <div className="alert alert--error">{candidate.error}</div>;

  const c = candidate.data;
  const currentStatus = status || c.status;

  const handleStatusSave = async () => {
    await candidateService.updateStatus(c.id, currentStatus);
    setFeedback(`Status updated to "${currentStatus}"`);
    candidate.reload();
  };

  const handleSendRequest = async (payload) => {
    const interview = await interviewService.sendRequest({
      candidate: c,
      job: job.data,
      ...payload,
    });
    setFeedback(`Interview request sent. Response link: /candidate/respond/${interview.token}`);
    candidate.reload();
  };
  return (
     // ... rest of JSX (unchanged from earlier answer)...Billa Bond
    <>
      <PageHeader
        breadcrumb="Candidates / Profile"
        title={c.name}
        subtitle={`Applied for ${job.data?.title || '—'}`}
        actions={<Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>}
      />

      {feedback && <div className="alert alert--success">{feedback}</div>}

      <div className="grid grid--2-1">
        <div className="stack">
          <Card>
            <div className="profile">
              <div className="profile__avatar">{initials(c.name)}</div>
              <div className="profile__info">
                <h2>{c.name}</h2>
                <p>{c.email} {c.phone && `• ${c.phone}`}</p>
                <div className="profile__badges">
                  <Badge tone="info">{c.education}</Badge>
                  <Badge tone="neutral">{c.experienceYears} yrs experience</Badge>
                  <Badge tone={currentStatus === CANDIDATE_STATUS.REJECTED ? 'danger' : 'purple'}>
                    {currentStatus}
                  </Badge>
                </div>
              </div>
              <div className="profile__score">
                <ScoreBreakdown score={c.score} compact />
              </div>
            </div>
          </Card>

          <Card title="Parsed Summary">
            <p className="muted">{c.summary || 'No summary extracted from the resume.'}</p>
          </Card>

          <Card title="Skills Detected" subtitle={`${c.skills.length} skills found in the resume`}>
            <div className="chips">
              {c.skills.map((s) => (
                <span key={s} className={`chip ${c.matched?.includes(s) ? 'chip--match' : ''}`}>{s}</span>
              ))}
            </div>
          </Card>

          <Card title="ATS Score Breakdown" subtitle="Weighted match against job requirements">
            <ScoreBreakdown
              score={c.score}
              breakdown={c.breakdown}
              matched={c.matched}
              missing={c.missing}
            />
          </Card>
        </div>

        <div className="stack">
          <Card title="Update Status">
            <Select
              label="Candidate status"
              value={currentStatus}
              onChange={(e) => setStatus(e.target.value)}
              options={Object.values(CANDIDATE_STATUS).map((s) => ({ value: s, label: s }))}
            />
            <Button fullWidth onClick={handleStatusSave}>Save Status</Button>

            <div className="quick-actions">
              <Button
                variant="success"
                size="sm"
                onClick={() => { setStatus(CANDIDATE_STATUS.SELECTED); }}
              >
                Mark Selected
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => { setStatus(CANDIDATE_STATUS.REJECTED); }}
              >
                Reject
              </Button>
            </div>
          </Card>

          <Card title="Send Interview Request">
            {c.score < SCORE_THRESHOLD && (
              <p className="warn-note">
                ⚠️ This candidate scored below the shortlist threshold ({SCORE_THRESHOLD}).
              </p>
            )}
            <InterviewRequestForm onSubmit={handleSendRequest} />
          </Card>

          <Card title="Details">
            <dl className="kv">
              <div><dt>Screened on</dt><dd>{formatDate(c.createdAt)}</dd></div>
              <div><dt>Source</dt><dd>{c.sourceName || 'Manual paste'}</dd></div>
              <div><dt>Links</dt><dd>{c.links?.length ? c.links.join(', ') : '—'}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}