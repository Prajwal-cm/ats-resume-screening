import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { interviewService } from '../services/interviewService';
import { useAsync } from '../hooks/useAsync';
import { INTERVIEW_STATUS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const toneFor = (status) =>
  status === INTERVIEW_STATUS.ACCEPTED ? 'success'
    : status === INTERVIEW_STATUS.DECLINED ? 'danger'
    : 'warning';

export default function InterviewsPage() {
  const [copied, setCopied] = useState('');
  const interviews = useAsync(() => interviewService.list(), []);

  const copyLink = (token) => {
    const link = `${window.location.origin}/candidate/respond/${token}`;
    navigator.clipboard?.writeText(link);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <>
      <PageHeader
        title="Interview Requests"
        subtitle="Track interview invitations and candidate responses"
      />

      <Card title={`Requests (${interviews.data?.length ?? 0})`}>
        {interviews.loading ? (
          <Loader />
        ) : interviews.data?.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Schedule</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {interviews.data.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <strong>{i.candidateName}</strong>
                      <div className="muted sm">{i.candidateEmail}</div>
                    </td>
                    <td>{i.jobTitle}</td>
                    <td>{formatDate(i.date)}<div className="muted sm">{i.time}</div></td>
                    <td>{i.mode}</td>
                    <td><Badge tone={toneFor(i.status)}>{i.status}</Badge></td>
                    <td style={{ textAlign: 'right' }}>
                      <Button variant="ghost" size="sm" onClick={() => copyLink(i.token)}>
                        {copied === i.token ? 'Copied!' : 'Copy link'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📅"
            title="No interview requests yet"
            description="Open a shortlisted candidate profile and send an interview request."
          />
        )}
      </Card>
    </>
  );
}