import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const today = () => new Date().toISOString().split('T')[0];

export default function InterviewRequestForm({ onSubmit, disabled }) {
  const [form, setForm] = useState({
    date: today(),
    time: '10:00',
    mode: 'Video Call',
    message: 'We were impressed by your profile and would like to invite you for an interview.',
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.date) errs.date = 'Select a date';
    if (!form.time) errs.time = 'Select a time';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    try {
      await onSubmit(form);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Interview date"
        name="date"
        type="date"
        value={form.date}
        onChange={set('date')}
        error={errors.date}
      />
      <Input
        label="Time"
        name="time"
        type="time"
        value={form.time}
        onChange={set('time')}
        error={errors.time}
      />
      <Select
        label="Mode"
        name="mode"
        value={form.mode}
        onChange={set('mode')}
        options={[
          { value: 'Video Call', label: 'Video Call' },
          { value: 'Phone', label: 'Phone' },
          { value: 'On-site', label: 'On-site' },
        ]}
      />
      <Textarea
        label="Message"
        name="message"
        rows={4}
        value={form.message}
        onChange={set('message')}
      />
      <Button type="submit" fullWidth loading={sending} disabled={disabled}>
        Send Interview Request
      </Button>
    </form>
  );
}