import Badge from '../common/Badge';
import Button from '../common/Button';
import ScoreBadge from './ScoreBadge';
import { CANDIDATE_STATUS } from '../../utils/constants';

const statusTone = (status) => {
  switch (status) {
    case CANDIDATE_STATUS.SHORTLISTED: return 'success';
    case CANDIDATE_STATUS.INTERVIEW: return 'info';
    case CANDIDATE_STATUS.SELECTED: return 'purple';
    case CANDIDATE_STATUS.REJECTED: return 'danger';
    case CANDIDATE_STATUS.REVIEW: return 'warning';
    default: return 'neutral';
  }
};

export default function CandidateTable({ candidates = [], jobMap = {}, onOpen, onStatusChange }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Candidate</th>
            {Object.keys(jobMap).length > 0 && <th>Applied For</th>}
            <th>Skills</th>
            <th>Exp.</th>
            <th>ATS Score</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td>
                <button className="table__link" onClick={() => onOpen?.(c.id)}>{c.name}</button>
                <div className="muted sm">{c.email}</div>
              </td>
              {Object.keys(jobMap).length > 0 && <td className="sm">{jobMap[c.jobId] || '—'}</td>}
              <td>
                <div className="chips chips--tight">
                  {c.skills.slice(0, 3).map((s) => <span key={s} className="chip chip--sm">{s}</span>)}
                  {c.skills.length > 3 && <span className="chip chip--sm chip--more">+{c.skills.length - 3}</span>}
                </div>
              </td>
              <td className="sm">{c.experienceYears} yrs</td>
              <td><ScoreBadge score={c.score} size="sm" /></td>
              <td><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
              <td style={{ textAlign: 'right' }}>
                <div className="table__actions">
                  <Button variant="ghost" size="sm" onClick={() => onOpen?.(c.id)}>View</Button>
                  {onStatusChange && c.status !== CANDIDATE_STATUS.SHORTLISTED && c.score >= 70 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onStatusChange(c.id, CANDIDATE_STATUS.SHORTLISTED)}
                    >
                      Shortlist
                    </Button>
                  )}
                  {onStatusChange && c.status !== CANDIDATE_STATUS.REJECTED && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onStatusChange(c.id, CANDIDATE_STATUS.REJECTED)}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}