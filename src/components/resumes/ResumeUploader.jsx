import { useRef, useState } from 'react';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import Badge from '../common/Badge';
import { candidateService } from '../../services/candidateService';
import './uploader.css';

export default function ResumeUploader({ jobId, onScreened }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);     // { name, text }
  const [pasteText, setPasteText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, text: String(reader.result || '') });
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleFiles = async (fileList) => {
    setError('');
    const accepted = Array.from(fileList).filter((f) =>
      /\.(txt|md|text)$/i.test(f.name) || f.type.startsWith('text/')
    );
    if (!accepted.length) {
      setError('Please upload plain-text resumes (.txt / .md). PDF support requires a server-side parser.');
      return;
    }
    const parsed = await Promise.all(accepted.map(readFile));
    setFiles((prev) => [...prev, ...parsed]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const runScreening = async () => {
    const payloads = [
      ...files.map((f) => ({ rawText: f.text, sourceName: f.name })),
      ...(pasteText.trim() ? [{ rawText: pasteText, sourceName: 'Pasted resume' }] : []),
    ];

    if (!payloads.length) {
      setError('Add at least one resume file or paste resume text.');
      return;
    }

    setProcessing(true);
    setError('');
    const output = [];

    try {
      for (const p of payloads) {
        // eslint-disable-next-line no-await-in-loop
        const candidate = await candidateService.screenResume({ jobId, ...p });
        output.push(candidate);
        onScreened?.(candidate);
      }
      setResults(output);
      setFiles([]);
      setPasteText('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="uploader">
      <div
        className="uploader__drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className="uploader__icon">📄</div>
        <p className="uploader__title">Drop resumes here or click to browse</p>
        <p className="uploader__hint">Supported: .txt, .md, .text (multiple files allowed)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".txt,.md,.text,text/plain"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="uploader__files">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span>📎 {f.name}</span>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <Textarea
        label="Or paste resume text"
        rows={6}
        value={pasteText}
        onChange={(e) => setPasteText(e.target.value)}
        placeholder="Paste the candidate's resume content here…"
      />

      {error && <div className="alert alert--error">{error}</div>}

      <div className="uploader__actions">
        <Button onClick={runScreening} loading={processing}>
          {processing ? 'Parsing & scoring…' : 'Parse & Score Resumes'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="uploader__results">
          <h4>Screening complete</h4>
          <ul>
            {results.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong>
                <Badge tone={r.score >= 70 ? 'success' : r.score >= 50 ? 'warning' : 'danger'}>
                  {r.score}/100
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}