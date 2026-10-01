import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import CandidateTable from '../components/candidates/CandidateTable';
import { candidateService } from '../services/candidateService';
import { jobService } from '../services/jobService';
import { useAsync } from '../hooks/useAsync';
import { CANDIDATE_STATUS, SCORE_THRESHOLD } from '../utils/constants';

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [matchFilter, setMatchFilter] = useState('all');

  const candidates = useAsync(() => candidateService.list(), []);
  const jobs = useAsync(() => jobService.list(), []);

  const jobMap = useMemo(() => {
    const map = {};
    (jobs.data || []).forEach((j) => { map[j.id] = j.title; });
    return map;
  }, [jobs.data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (candidates.data || []).filter((c) => {
      if (term && !`${c.name} ${c.email} ${c.skills.join(' ')}`.toLowerCase().includes(term)) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (jobFilter !== 'all' && c.jobId !== jobFilter) return false;
      if (matchFilter === 'high' && c.score < SCORE_THRESHOLD) return false;
      if (matchFilter === 'low' && c.score >= SCORE_THRESHOLD) return false;
      return true;
    });
  }, [candidates.data, search, statusFilter, jobFilter, matchFilter]);

  const handleStatusChange = async (id, status) => {
    await candidateService.updateStatus(id, status);
    candidates.reload();
  };

  return (
    <>
      <PageHeader title="Candidates" subtitle="All parsed and scored candidates across job posts" />

      <Card className="mb-22">
        <div className="filters">
          <Input
            placeholder="Search by name, email or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All jobs' },
              ...(jobs.data || []).map((j) => ({ value: j.id, label: j.title })),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              ...Object.values(CANDIDATE_STATUS).map((s) => ({ value: s, label: s })),
            ]}
          />
          <Select
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All matches' },
              { value: 'high', label: `High match (≥ ${SCORE_THRESHOLD})` },
              { value: 'low', label: `Low match (< ${SCORE_THRESHOLD})` },
            ]}
          />
        </div>
      </Card>

      <Card title={`Results (${filtered.length})`}>
        {candidates.loading ? (
          <Loader />
        ) : filtered.length ? (
          <CandidateTable
            candidates={filtered}
            jobMap={jobMap}
            onOpen={(id) => navigate(`/candidates/${id}`)}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <EmptyState icon="🔍" title="No candidates found" description="Try adjusting your filters or screen more resumes." />
        )}
      </Card>
    </>
  );
}