import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatbotProvider>
          <AppRoutes />
        </ChatbotProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}