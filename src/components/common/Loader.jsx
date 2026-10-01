import './loader.css';

export default function Loader({ label = 'Loading…', inline = false }) {
  if (inline) return <span className="loader__dot" aria-label={label} />;
  return (
    <div className="loader">
      <span className="loader__ring" />
      <p>{label}</p>
    </div>
  );
}