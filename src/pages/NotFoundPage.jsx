import { Link } from 'react-router-dom';
import './not-found.css';

export default function NotFoundPage() {
  return (
    <div className="nf">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/login" className="nf__link">← Back to login</Link>
    </div>
  );
}