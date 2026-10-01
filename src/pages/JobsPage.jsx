import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import JobCard from '../components/jobs/JobCard';
import { jobService } from '../services/jobService';
import { useAsync } from '../hooks/useAsync';

export default function JobsPage() {
  const navigate = useNavigate();
  const { data: jobs, loading, error, reload } = useAsync(() => jobService.list(), []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job post and its screening context?')) return;
    await jobService.remove(id);
    reload();
  };

  const handleToggle = async (id) => {
    await jobService.toggleStatus(id);
    reload();
  };

  return (
    <>
      <PageHeader
        title="Job Posts"
        subtitle="Create job descriptions and screen resumes against them"
        actions={<Button onClick={() => navigate('/jobs/new')}>+ Create Job Post</Button>}
      />

      {loading && <Loader />}
      {error && <div className="alert alert--error">{error}</div>}

      {!loading && !jobs?.length && (
        <EmptyState
          icon="💼"
          title="No job posts yet"
          description="Start by creating a job post with a detailed description. The ATS engine will extract requirements automatically."
          action={<Button onClick={() => navigate('/jobs/new')}>Create Job Post</Button>}
        />
      )}

      {!loading && jobs?.length > 0 && (
        <div className="grid grid--3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpen={() => navigate(`/jobs/${job.id}`)}
              onEdit={() => navigate(`/jobs/${job.id}/edit`)}
              onDelete={() => handleDelete(job.id)}
              onToggle={() => handleToggle(job.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}