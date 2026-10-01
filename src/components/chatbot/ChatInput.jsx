import { useState } from 'react';
import './chatbot.css';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  return (
    <form className="chat-input" onSubmit={submit}>
      <input
        className="chat-input__field"
        placeholder="Ask me anything about the app…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="chat-input__send"
        disabled={disabled || !value.trim()}
        aria-label="Send"
      >
        ➤
      </button>
    </form>
  );
}