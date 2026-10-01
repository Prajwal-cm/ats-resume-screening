import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './sidebar.css';

const hrNav = [
  { to: '/hr', label: 'Dashboard', icon: '▤', end: true },
  { to: '/jobs', label: 'Job Posts', icon: '💼' },
  { to: '/candidates', label: 'Candidates', icon: '👥' },
  { to: '/interviews', label: 'Interviews', icon: '📅' },
];

const adminNav = [
  { to: '/admin', label: 'Admin Dashboard', icon: '⚙️', end: true },
  { to: '/jobs', label: 'Job Posts', icon: '💼' },
  { to: '/candidates', label: 'Candidates', icon: '👥' },
  { to: '/interviews', label: 'Interviews', icon: '📅' },
];

export default function Sidebar({ open, onNavigate }) {
  const { isAdmin } = useAuth();
  const items = isAdmin ? adminNav : hrNav;

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <p>ATS v1.0</p>
        <span>Resume Screening Engine</span>
      </div>
    </aside>
  );
}