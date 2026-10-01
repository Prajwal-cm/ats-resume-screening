import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { validateLogin } from '../utils/validators';
import './login.css';

const DEMO = [
  { label: 'Admin', email: 'admin@ats.com', password: 'admin123' },
  { label: 'HR', email: 'hr@ats.com', password: 'hr12345' },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    try {
      const session = await login(form);
      const redirectTo =
        location.state?.from?.pathname || (session.role === 'admin' ? '/admin' : '/hr');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    }
  };

  const fillDemo = (cred) => {
    setForm({ email: cred.email, password: cred.password });
    setErrors({});
    setServerError('');
  };

  return (
    <Card className="login-card">
      <div className="login-card__head">
        <h1>Sign in</h1>
        <p>Access your recruitment workspace</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {serverError && <div className="login-card__error">{serverError}</div>}

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="login-card__demo">
        <span>Demo accounts</span>
        <div className="login-card__demo-btns">
          {DEMO.map((d) => (
            <Button key={d.label} variant="secondary" size="sm" onClick={() => fillDemo(d)}>
              {d.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}