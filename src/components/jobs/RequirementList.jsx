import Badge from '../common/Badge';

export default function RequirementList({ requirements }) {
  if (!requirements) return null;
  const { skills = [], minExperience = 0, education = 'Any', keywords = [] } = requirements;

  return (
    <div className="requirements">
      <div className="requirements__row">
        <span className="requirements__label">Experience</span>
        <Badge tone="info">{minExperience ? `${minExperience}+ years` : 'Not specified'}</Badge>
      </div>
      <div className="requirements__row">
        <span className="requirements__label">Education</span>
        <Badge tone="purple">{education}</Badge>
      </div>

      <div className="requirements__block">
        <span className="requirements__label">Required skills ({skills.length})</span>
        {skills.length ? (
          <div className="chips">
            {skills.map((s) => <span key={s} className="chip chip--primary">{s}</span>)}
          </div>
        ) : (
          <p className="muted sm">No known skills detected — add more detail to the description.</p>
        )}
      </div>

      {keywords.length > 0 && (
        <div className="requirements__block">
          <span className="requirements__label">Top keywords</span>
          <div className="chips">
            {keywords.slice(0, 12).map((k) => (
              <span key={k} className="chip chip--sm">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}