import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import StatCard from '../components/common/StatCard';
import { authService } from '../services/authService';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import { useAsync } from '../hooks/useAsync';
import { isEmail, isRequired } from '../utils/validators';
import { formatDate } from '../utils/formatters';

export default function AdminDashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const hrUsers = useAsync(() => authService.listHRUsers(), []);
  const jobs = useAsync(() => jobService.list(), []);
  const candidates = useAsync(() => candidateService.list(), []);

  const validate = () => {
    const e = {};
    if (!isRequired(form.name)) e.name = 'Name is required';
    if (!isRequired(form.email)) e.email = 'Email is required';
    else if (!isEmail(form.email)) e.email = 'Enter a valid email';
    if (!isRequired(form.password)) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      await authService.createHRAccount(form);
      setFeedback(`HR account created for ${form.email}`);
      setForm({ name: '', email: '', password: '' });
      setModalOpen(false);
      hrUsers.reload();
    } catch (err) {
      setErrors({ email: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this HR account?')) return;
    await authService.deleteHRUser(id);
    hrUsers.reload();
  };

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage HR accounts and monitor platform activity"
        actions={<Button onClick={() => setModalOpen(true)}>+ Create HR Account</Button>}
      />

      {feedback && <div className="alert alert--success">{feedback}</div>}

      <div className="grid grid--4" style={{ marginBottom: 22 }}>
        <StatCard label="HR Accounts" value={hrUsers.data?.length ?? '—'} icon="👤" />
        <StatCard label="Job Posts" value={jobs.data?.length ?? '—'} tone="green" icon="💼" />
        <StatCard label="Candidates" value={candidates.data?.length ?? '—'} tone="amber" icon="👥" />
        <StatCard
          label="Shortlisted"
          value={candidates.data?.filter((c) => c.score >= 70).length ?? '—'}
          tone="purple"
          icon="⭐"
        />
      </div>

      <Card title="HR Accounts" subtitle="Users with recruiter access">
        {hrUsers.loading ? (
          <Loader />
        ) : hrUsers.data?.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hrUsers.data.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="👤" title="No HR accounts yet" description="Create the first HR account to get started." />
        )}
      </Card>

      <Modal
        open={modalOpen}
        title="Create HR Account"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={submitting}>Create Account</Button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <Input
            label="Full name"
            name="name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@company.com"
          />
          <Input
            label="Temporary password"
            name="password"
            type="text"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="min. 6 characters"
          />
        </form>
      </Modal>
    </>
  );
}