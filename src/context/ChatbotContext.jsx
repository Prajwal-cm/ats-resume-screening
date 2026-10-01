import { createContext, useCallback, useMemo, useState } from 'react';
import { matchIntent, buildResponse } from '../utils/chatbotEngine';

export const ChatbotContext = createContext(null);

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'bot',
  text: `Hi! 👋 I'm your ATS Assistant.

I can help you upload resumes, understand ATS scores, find missing skills, send interview requests, and more.

What would you like to know?`,
  followUps: [
    'How do I upload resumes?',
    'How is the ATS score calculated?',
    'How do I add a job post?',
    'How do I navigate the app?',
  ],
  at: Date.now(),
};

export function ChatbotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [typing, setTyping] = useState(false);
  const [context, setContext] = useState({ path: '/', candidate: null });

  /** Update what the bot knows about the current page. */
  const updateContext = useCallback((patch) => {
    setContext((prev) => ({ ...prev, ...patch }));
  }, []);

  /** Send a user message and get a bot reply. */
  const sendMessage = useCallback(
    (text) => {
      const userMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        text,
        at: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setTyping(true);

      // Simulate "thinking" delay for realism
      setTimeout(() => {
        const entry = matchIntent(text, context);
        const response = buildResponse(entry, context);
        const botMessage = {
          id: `b_${Date.now()}`,
          role: 'bot',
          text: response.text,
          followUps: response.followUps,
          at: Date.now(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setTyping(false);
      }, 450);
    },
    [context]
  );

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, at: Date.now() }]);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((v) => !v),
      messages,
      typing,
      sendMessage,
      clearChat,
      context,
      updateContext,
    }),
    [open, messages, typing, sendMessage, clearChat, context, updateContext]
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}