import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { interviewService } from '../services/interviewService';
import { INTERVIEW_STATUS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import './candidate-response.css';

export default function CandidateResponsePage() {
  const { token } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    interviewService
      .getByToken(token)
      .then((data) => {
        setInterview(data);
        if (data.status !== INTERVIEW_STATUS.PENDING) setDone(true);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const respond = async (status) => {
    const updated = await interviewService.respond(token, status);
    setInterview(updated);
    setDone(true);
  };

  if (loading) return <div className="response-page"><Loader /></div>;
  if (error) return <div className="response-page"><Card><p className="alert alert--error">{error}</p></Card></div>;

  return (
    <div className="response-page">
      <Card className="response-card">
        <div className="response-card__head">
          <span className="response-card__logo">◈</span>
          <h1>Interview Invitation</h1>
          <p>You have been invited to interview for <strong>{interview.jobTitle}</strong></p>
        </div>

        <dl className="kv">
          <div><dt>Candidate</dt><dd>{interview.candidateName}</dd></div>
          <div><dt>Date</dt><dd>{formatDate(interview.date)}</dd></div>
          <div><dt>Time</dt><dd>{interview.time}</dd></div>
          <div><dt>Mode</dt><dd>{interview.mode}</dd></div>
          <div><dt>Status</dt><dd><Badge tone={interview.status === INTERVIEW_STATUS.ACCEPTED ? 'success' : interview.status === INTERVIEW_STATUS.DECLINED ? 'danger' : 'warning'}>{interview.status}</Badge></dd></div>
        </dl>

        {interview.message && (
          <div className="response-card__message">
            <h4>Message from recruiter</h4>
            <p>{interview.message}</p>
          </div>
        )}

        {!done ? (
          <div className="response-card__actions">
            <Button variant="success" onClick={() => respond(INTERVIEW_STATUS.ACCEPTED)}>
              ✓ Accept Interview
            </Button>
            <Button variant="danger" onClick={() => respond(INTERVIEW_STATUS.DECLINED)}>
              ✕ Decline
            </Button>
          </div>
        ) : (
          <div className="alert alert--success">
            Your response has been recorded. Thank you!
          </div>
        )}
      </Card>
    </div>
  );
}