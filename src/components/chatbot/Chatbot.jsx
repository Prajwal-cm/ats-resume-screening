import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import ChatWindow from './ChatWindow';
import './chatbot.css';

export default function Chatbot() {
  const { open, toggle } = useChatbot();
  const { updateContext } = useChatbot();
  const { pathname } = useLocation();

  // Let the bot know which page the user is on
  useEffect(() => {
    updateContext({ path: pathname });
  }, [pathname, updateContext]);

  return (
    <>
      {open && <ChatWindow />}

      <button
        className={`chat-fab ${open ? 'chat-fab--open' : ''}`}
        onClick={toggle}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        {open ? '×' : '💬'}
        {!open && <span className="chat-fab__dot" />}
      </button>
    </>
  );
}