import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';
import { useChatbot } from '../../hooks/useChatbot';
import './chatbot.css';

export default function ChatWindow() {
  const { messages, typing, sendMessage, clearChat, setOpen } = useChatbot();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const lastBot = [...messages].reverse().find((m) => m.role === 'bot' && m.followUps?.length);

  return (
    <div className="chat-window" role="dialog" aria-label="ATS Assistant">
      <header className="chat-window__header">
        <div className="chat-window__title">
          <span className="chat-window__avatar">🤖</span>
          <div>
            <strong>ATS Assistant</strong>
            <p>Here to guide you</p>
          </div>
        </div>
        <div className="chat-window__actions">
          <button onClick={clearChat} title="Clear chat">↺</button>
          <button onClick={() => setOpen(false)} title="Close">×</button>
        </div>
      </header>

      <div className="chat-window__body">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {typing && (
          <div className="chat-msg chat-msg--bot">
            <div className="chat-msg__bubble chat-msg__typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {lastBot && !typing && (
        <QuickReplies replies={lastBot.followUps} onSelect={sendMessage} />
      )}

      <ChatInput onSend={sendMessage} disabled={typing} />
    </div>
  );
}