import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Send, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { AsliBogorLogo } from '../ui/asli-bogor-logo';
import { getFallbackAIResponse } from '../../utils/aiChat';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya adalah AI Assistant Asli Bogor. Ada yang bisa saya bantu?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessageText = inputMessage.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));

      let botResponse: string;

      try {
        const response = await fetch(api.chat.send, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessageText,
            userId: user?.id,
            role: user?.role,
            conversationHistory: messages.slice(-10).map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
          }),
        });

        if (!response.ok) {
          // Jika server error, gunakan fallback AI
          console.warn('Server error, using fallback AI');
          botResponse = getFallbackAIResponse(userMessageText, user?.role);
        } else {
          const data = await response.json();
          botResponse = data?.response || getFallbackAIResponse(userMessageText, user?.role);
        }
      } catch (fetchError) {
        // Jika fetch gagal (network error, 404, dll), gunakan fallback AI
        console.warn('Fetch error, using fallback AI:', fetchError);
        botResponse = getFallbackAIResponse(userMessageText, user?.role);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Gunakan fallback AI sebagai last resort
      const fallbackResponse = getFallbackAIResponse(userMessageText, user?.role);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    console.log('LiveChat isOpen changed:', isOpen);
  }, [isOpen]);

  console.log('LiveChat render - isOpen:', isOpen);

  if (!isOpen) {
    return null;
  }

  console.log('LiveChat isOpen is true, rendering chat window...');

  const chatContent = (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '420px',
        maxWidth: 'calc(50vw - 24px)',
        height: '70vh',
        maxHeight: '600px',
        minHeight: '500px',
        zIndex: 999999,
        pointerEvents: 'auto',
      }}
      className="sm:w-[calc(100vw-48px)] sm:max-w-none sm:bottom-4 sm:right-4"
    >
      <motion.div
        key="chat-window"
        initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          border: '1px solid rgba(255, 141, 40, 0.2)',
          boxShadow: '0 20px 60px rgba(255, 141, 40, 0.3)',
        }}
      >
            {/* Header with Orange Gradient */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative flex items-center justify-between p-4 rounded-t-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FF8D28 0%, #FF6B00 50%, #FF8D28 100%)',
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              <div className="relative flex items-center gap-3 z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 overflow-hidden"
                  style={{ aspectRatio: '1/1' }}
                >
                  <AsliBogorLogo
                    variant="logomark"
                    className="w-7 h-7"
                  />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    AI Assistant
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles size={14} className="text-white" />
                    </motion.div>
                  </h3>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-300"
                    />
                    <p className="text-white/90 text-xs font-medium">Online</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="relative z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={16} />
              </motion.button>
            </motion.div>

            {/* Messages with smooth animations */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/30 via-white to-white scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                      delay: index === messages.length - 1 ? 0.1 : 0,
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[85%] sm:max-w-[90%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-orange-400 to-orange-500'
                        }`}
                        style={{ aspectRatio: '1/1' }}
                      >
                        {message.sender === 'user' ? (
                          <User size={20} className="text-white" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/10">
                            <AsliBogorLogo
                              variant="logomark"
                              className="w-6 h-6"
                            />
                          </div>
                        )}
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`rounded-2xl px-4 py-2.5 shadow-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : 'bg-white text-gray-800 border border-orange-100'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-1.5 ${
                            message.sender === 'user'
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md overflow-hidden"
                      style={{ aspectRatio: '1/1' }}
                    >
                      <div className="w-full h-full flex items-center justify-center bg-white/10">
                        <AsliBogorLogo
                          variant="logomark"
                          className="w-6 h-6"
                        />
                      </div>
                    </motion.div>
                    <div className="bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-orange-100">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 rounded-full bg-orange-400"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 rounded-full bg-orange-400"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 rounded-full bg-orange-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input with Orange Theme */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-t bg-white border-orange-100"
            >
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  disabled={isLoading}
                  className="flex-1 border-orange-200 focus:border-orange-400 focus:ring-orange-300"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4"
                    style={{
                      background: 'linear-gradient(135deg, #FF8D28 0%, #FF6B00 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(255, 141, 40, 0.4)',
                    }}
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1"
              >
                <Sparkles size={12} className="text-orange-400" />
                AI Assistant siap membantu Anda 24/7
              </motion.p>
            </motion.div>
      </motion.div>
    </div>
  );

  // Render to portal to ensure it appears above all content
  if (typeof window === 'undefined' || !document.body) {
    return null;
  }

  console.log('LiveChat: Creating portal to document.body');
  return createPortal(chatContent, document.body);
}
