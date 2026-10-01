import { scoreLabel } from '../../utils/atsEngine';
import './score-breakdown.css';

const Row = ({ label, value, max }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="sb__row">
      <div className="sb__row-head">
        <span>{label}</span>
        <span className="sb__value">{value}/{max}</span>
      </div>
      <div className="sb__bar">
        <div className="sb__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default function ScoreBreakdown({ score = 0, breakdown, matched = [], missing = [], compact = false }) {
  const { label, tone } = scoreLabel(score);

  if (compact) {
    return (
      <div className={`sb sb--compact sb--${tone}`}>
        <div className="sb__score">{score}</div>
        <div className="sb__of">/ 100</div>
        <div className="sb__label">{label}</div>
      </div>
    );
  }

  return (
    <div className="sb">
      <div className={`sb__headline sb__headline--${tone}`}>
        <span className="sb__headline-score">{score}</span>
        <div>
          <strong>{label}</strong>
          <p>Overall ATS match score</p>
        </div>
      </div>

      {breakdown && (
        <div className="sb__bars">
          <Row label="Skills match" value={breakdown.skills} max={60} />
          <Row label="Experience" value={breakdown.experience} max={25} />
          <Row label="Education" value={breakdown.education} max={15} />
        </div>
      )}

      {(matched.length > 0 || missing.length > 0) && (
        <div className="sb__skills">
          {matched.length > 0 && (
            <div>
              <span className="sb__skills-label">Matched ({matched.length})</span>
              <div className="chips">
                {matched.map((s) => <span key={s} className="chip chip--match">{s}</span>)}
              </div>
            </div>
          )}
          {missing.length > 0 && (
            <div>
              <span className="sb__skills-label">Missing ({missing.length})</span>
              <div className="chips">
                {missing.map((s) => <span key={s} className="chip chip--missing">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}