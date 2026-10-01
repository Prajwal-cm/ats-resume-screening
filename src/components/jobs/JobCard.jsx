import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';
import './job-card.css';

export default function JobCard({ job, onOpen, onEdit, onDelete, onToggle }) {
  return (
    <article className="job-card">
      <header className="job-card__head">
        <h3 onClick={onOpen}>{job.title}</h3>
        <Badge tone={job.status === 'Open' ? 'success' : 'neutral'}>{job.status}</Badge>
      </header>

      <p className="job-card__meta">
        {job.department || 'General'} • {job.location || 'Remote'} • {job.employmentType}
      </p>

      <p className="job-card__desc">{job.description.slice(0, 130)}…</p>

      <div className="job-card__skills">
        {(job.requirements?.skills || []).slice(0, 5).map((s) => (
          <span key={s} className="chip chip--sm">{s}</span>
        ))}
        {(job.requirements?.skills || []).length > 5 && (
          <span className="chip chip--sm chip--more">+{job.requirements.skills.length - 5}</span>
        )}
      </div>

      <footer className="job-card__foot">
        <span className="muted sm">Posted {formatDate(job.createdAt)}</span>
        <div className="job-card__actions">
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {job.status === 'Open' ? 'Close' : 'Reopen'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </footer>
    </article>
  );
}