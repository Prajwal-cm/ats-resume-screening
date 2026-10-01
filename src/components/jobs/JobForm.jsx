import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const JD_PLACEHOLDER = `We are looking for a Senior Frontend Engineer with 5+ years of experience.

Required skills: React, JavaScript, TypeScript, Redux, HTML, CSS, Git.
Experience with Next.js and CI/CD is a plus.
Bachelor's degree in Computer Science or equivalent experience.

Responsibilities:
- Build reusable UI components
- Collaborate with designers and backend engineers
- Write unit and integration tests`;

export default function JobForm({ values, errors, saving, onChange, onSubmit, onCancel, submitLabel }) {
  const set = (name) => (e) => onChange(name, e.target.value);

  return (
    <Card title="Job Details" subtitle="Fill in the role information and description">
      <form onSubmit={onSubmit} noValidate>
        <Input
          label="Job title *"
          name="title"
          value={values.title}
          onChange={set('title')}
          error={errors.title}
          placeholder="e.g. Senior Frontend Engineer"
        />

        <div className="grid grid--2">
          <Input
            label="Department"
            name="department"
            value={values.department}
            onChange={set('department')}
            placeholder="Engineering"
          />
          <Input
            label="Location"
            name="location"
            value={values.location}
            onChange={set('location')}
            placeholder="Remote / Bangalore"
          />
        </div>

        <Select
          label="Employment type"
          name="employmentType"
          value={values.employmentType}
          onChange={set('employmentType')}
          options={[
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' },
          ]}
        />

        <Textarea
          label="Job description *"
          name="description"
          rows={14}
          value={values.description}
          onChange={set('description')}
          error={errors.description}
          placeholder={JD_PLACEHOLDER}
          hint="Mention required skills, years of experience and education — the ATS engine extracts them automatically."
        />

        <div className="form-actions">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={saving}>{submitLabel}</Button>
        </div>
      </form>
    </Card>
  );
}