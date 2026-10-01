import './field.css';

export default function Select({ label, error, options = [], id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <select id={inputId} className="field__control" {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}