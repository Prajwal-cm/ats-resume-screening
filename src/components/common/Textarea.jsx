import './field.css';

export default function Textarea({ label, error, hint, id, rows = 6, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="field">
      {label && <label className="field__label" htmlFor={inputId}>{label}</label>}
      <textarea
        id={inputId}
        rows={rows}
        className={`field__control field__control--area ${error ? 'field__control--error' : ''}`}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}
      {!error && hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}