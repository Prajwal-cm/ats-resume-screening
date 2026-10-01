import './badge.css';

export default function Badge({ children, tone = 'neutral', size = 'md' }) {
  return <span className={`badge badge--${tone} badge--${size}`}>{children}</span>;
}