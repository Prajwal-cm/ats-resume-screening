import { useContext } from 'react';
import { ChatbotContext } from '../context/ChatbotContext';

export const useChatbot = () => {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error('useChatbot must be used inside <ChatbotProvider>');
  return ctx;
};