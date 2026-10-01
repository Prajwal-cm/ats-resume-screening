import { Outlet } from 'react-router-dom';
import './auth-layout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <div className="auth-layout__brand">
          <span className="auth-layout__logo">◈</span>
          <div>
            <h2>ATS Resume Screening</h2>
            <p>Smart hiring powered by automated resume matching</p>
          </div>
        </div>
        <ul className="auth-layout__features">
          <li>✅ AI-powered JD requirement extraction</li>
          <li>✅ Instant resume parsing & scoring</li>
          <li>✅ Shortlist, interview & track candidates</li>
        </ul>
      </div>
      <div className="auth-layout__content">
        <Outlet />
      </div>
    </div>
  );
}