import Badge from '../common/Badge';
import { scoreLabel } from '../../utils/atsEngine';
import './score-badge.css';

export default function ScoreBadge({ score = 0, size = 'md' }) {
  const { label, tone } = scoreLabel(score);
  return (
    <div className="score-badge" title={label}>
      <Badge tone={tone} size={size}>{score}%</Badge>
      {size !== 'sm' && <span className="score-badge__label">{label}</span>}
    </div>
  );
}