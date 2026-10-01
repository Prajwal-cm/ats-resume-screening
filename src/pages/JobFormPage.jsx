import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import JobForm from '../components/jobs/JobForm';
import RequirementList from '../components/jobs/RequirementList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import { extractRequirements } from '../utils/atsEngine';

const EMPTY = {
  title: '',
  department: '',
  location: '',
  employmentType: 'Full-time',
  description: '',
};

export default function JobFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!id) {
      setValues(EMPTY);
      setPreview(null);
      return;
    }
    jobService.getById(id).then((job) => {
      setValues({
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        description: job.description,
      });
    });
  }, [id]);

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handlePreview = () => {
    setPreview(extractRequirements(values.description || ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.title.trim()) return setErrors({ title: 'Job title is required' });
    if (values.description.trim().length < 40)
      return setErrors({ description: 'Please write at least 40 characters' });

    setSaving(true);
    try {
      if (id) {
        await jobService.update(id, values);
        navigate(`/jobs/${id}`);
      } else {
        const job = await jobService.create(values, user.id);
        navigate(`/jobs/${job.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title={id ? 'Edit Job Post' : 'Create Job Post'}
        subtitle="Enter the job description — requirements are extracted automatically"
        breadcrumb="Jobs / New"
      />

      <div className="grid grid--2-1">
        <JobForm
          values={values}
          errors={errors}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitLabel={id ? 'Update Job Post' : 'Create Job Post'}
        />

        <Card
          title="Extracted Requirements"
          subtitle="Live preview of what the ATS engine will match against"
          actions={<Button variant="secondary" size="sm" onClick={handlePreview}>Analyze JD</Button>}
        >
          {preview ? (
            <RequirementList requirements={preview} />
          ) : (
            <p className="muted">
              Click <strong>Analyze JD</strong> to preview extracted skills, experience and education
              requirements before saving.
            </p>
          )}
        </Card>
      </div>
    </>
  );
}