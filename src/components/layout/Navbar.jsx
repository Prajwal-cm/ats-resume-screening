import { useAuth } from '../../hooks/useAuth';
import { initials } from '../../utils/formatters';
import Button from '../common/Button';
import './navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__burger" onClick={onToggleSidebar} aria-label="Toggle menu">☰</button>
        <div className="navbar__brand">
          <span className="navbar__logo">◈</span>
          <span>ATS Resume Screening</span>
        </div>
      </div>

      <div className="navbar__right">
        {user && (
          <div className="navbar__user">
            <div className="navbar__avatar">{initials(user.name)}</div>
            <div className="navbar__meta">
              <span className="navbar__name">{user.name}</span>
              <span className="navbar__role">{user.role === 'admin' ? 'Administrator' : 'HR Recruiter'}</span>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}