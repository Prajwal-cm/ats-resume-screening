import './chatbot.css';

/**
 * Renders a lightweight markdown subset:
 *  - **bold**
 *  - `code`
 *  - bullet lists with • or -
 *  - tables rendered as preformatted text
 *  - line breaks
 */
const renderText = (text) => {
  const lines = text.split('\n');
  const elements = [];
  let listBuffer = [];

  const flushList = (key) => {
    if (listBuffer.length) {
      elements.push(
        <ul key={`ul-${key}`} className="chat-msg__list">
          {listBuffer.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(item) }} />
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const inline = (str) =>
    str
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>');

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^[•\-*]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[•\-*]\s+/, ''));
      return;
    }
    flushList(idx);
    if (!trimmed) {
      elements.push(<div key={`sp-${idx}`} className="chat-msg__spacer" />);
      return;
    }
    elements.push(
      <p
        key={idx}
        className="chat-msg__paragraph"
        dangerouslySetInnerHTML={{ __html: inline(trimmed) }}
      />
    );
  });

  flushList('end');
  return elements;
};

export default function ChatMessage({ message }) {
  return (
    <div className={`chat-msg chat-msg--${message.role}`}>
      <div className="chat-msg__bubble">{renderText(message.text)}</div>
    </div>
  );
}