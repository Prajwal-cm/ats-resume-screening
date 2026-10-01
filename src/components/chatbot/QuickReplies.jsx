import './chatbot.css';

export default function QuickReplies({ replies = [], onSelect }) {
  if (!replies.length) return null;
  return (
    <div className="chat-quick">
      {replies.map((r) => (
        <button
          key={r}
          type="button"
          className="chat-quick__btn"
          onClick={() => onSelect(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}