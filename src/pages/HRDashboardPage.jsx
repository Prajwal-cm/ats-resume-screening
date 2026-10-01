import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import ScoreBadge from '../components/candidates/ScoreBadge';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import { interviewService } from '../services/interviewService';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';
import { SCORE_THRESHOLD } from '../utils/constants';

export default function HRDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const jobs = useAsync(() => jobService.list(), []);
  const candidates = useAsync(() => candidateService.list(), []);
  const interviews = useAsync(() => interviewService.list(), []);

  const list = candidates.data || [];
  const shortlisted = list.filter((c) => c.score >= SCORE_THRESHOLD).length;
  const pending = interviews.data?.filter((i) => i.status === 'Pending').length ?? 0;
  const topCandidates = [...list].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Recruiter'}`}
        subtitle="Your recruitment pipeline at a glance"
        actions={<Button onClick={() => navigate('/jobs/new')}>+ Create Job Post</Button>}
      />

      <div className="grid grid--4" style={{ marginBottom: 22 }}>
        <StatCard label="Open Jobs" value={jobs.data?.filter((j) => j.status === 'Open').length ?? '—'} icon="💼" />
        <StatCard label="Total Candidates" value={list.length || '—'} tone="green" icon="👥" />
        <StatCard label="Shortlisted" value={shortlisted || '—'} tone="purple" icon="⭐" />
        <StatCard label="Pending Interviews" value={pending || '—'} tone="amber" icon="📅" />
      </div>

      <div className="grid grid--2">
        <Card
          title="Recent Job Posts"
          actions={<Link to="/jobs" className="link">View all →</Link>}
        >
          {jobs.loading ? (
            <Loader />
          ) : jobs.data?.length ? (
            <ul className="list">
              {jobs.data.slice(0, 4).map((job) => (
                <li key={job.id} className="list__item">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="list__title">{job.title}</Link>
                    <div className="list__meta">
                      {job.department} • {job.location} • {formatDate(job.createdAt)}
                    </div>
                  </div>
                  <Badge tone={job.status === 'Open' ? 'success' : 'neutral'}>{job.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="💼"
              title="No job posts yet"
              description="Create your first job post to start screening resumes."
              action={<Button onClick={() => navigate('/jobs/new')}>Create Job Post</Button>}
            />
          )}
        </Card>

        <Card
          title="Top Matches"
          actions={<Link to="/candidates" className="link">View all →</Link>}
        >
          {candidates.loading ? (
            <Loader />
          ) : topCandidates.length ? (
            <ul className="list">
              {topCandidates.map((c) => (
                <li key={c.id} className="list__item">
                  <div>
                    <Link to={`/candidates/${c.id}`} className="list__title">{c.name}</Link>
                    <div className="list__meta">
                      {c.experienceYears} yrs • {c.education} • {c.skills.length} skills
                    </div>
                  </div>
                  <ScoreBadge score={c.score} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="👥" title="No candidates yet" description="Upload resumes against a job post to see matches." />
          )}
        </Card>
      </div>
    </>
  );
}