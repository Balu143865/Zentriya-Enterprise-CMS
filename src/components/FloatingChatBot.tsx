import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, RotateCcw, Sparkles, ArrowRight, CornerDownLeft, Minus, Copy, Check, Download, Palette, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "What IT services do you offer?",
  "What are your cloud services?",
  "Do you build custom software?",
  "What cybersecurity solutions do you provide?",
  "Tell me about internship programs.",
  "Are there offline or online training courses?",
  "How can I apply or contact sales?",
];

interface ChatTheme {
  id: string;
  name: string;
  primaryBg: string;
  primaryText: string;
  primaryHoverBg: string;
  primaryHoverBorder: string;
  primaryHoverText: string;
  primaryRing: string;
  glowBg: string;
  glowBorder: string;
  badgeBg: string;
  badgePing: string;
  colorDot: string;
}

const COLOR_THEMES: ChatTheme[] = [
  {
    id: 'emerald',
    name: 'Zentriya Emerald',
    primaryBg: 'bg-emerald-500',
    primaryText: 'text-emerald-600 dark:text-emerald-400',
    primaryHoverBg: 'hover:bg-emerald-500/5 dark:hover:bg-emerald-500/5',
    primaryHoverBorder: 'hover:border-emerald-500 dark:hover:border-emerald-400',
    primaryHoverText: 'hover:text-emerald-700 dark:hover:text-emerald-400',
    primaryRing: 'focus:ring-emerald-500 focus:border-emerald-500',
    glowBg: 'bg-emerald-500/25 dark:bg-emerald-400/25',
    glowBorder: 'border-emerald-500/30 dark:border-emerald-400/30',
    badgeBg: 'bg-emerald-500',
    badgePing: 'bg-emerald-400',
    colorDot: 'bg-emerald-500'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    primaryBg: 'bg-blue-600',
    primaryText: 'text-blue-600 dark:text-blue-400',
    primaryHoverBg: 'hover:bg-blue-500/5 dark:hover:bg-blue-500/5',
    primaryHoverBorder: 'hover:border-blue-500 dark:hover:border-blue-400',
    primaryHoverText: 'hover:text-blue-700 dark:hover:text-blue-400',
    primaryRing: 'focus:ring-blue-500 focus:border-blue-500',
    glowBg: 'bg-blue-500/25 dark:bg-blue-400/25',
    glowBorder: 'border-blue-500/30 dark:border-blue-400/30',
    badgeBg: 'bg-blue-500',
    badgePing: 'bg-blue-400',
    colorDot: 'bg-blue-500'
  },
  {
    id: 'indigo',
    name: 'Indigo Premium',
    primaryBg: 'bg-indigo-600',
    primaryText: 'text-indigo-600 dark:text-indigo-400',
    primaryHoverBg: 'hover:bg-indigo-500/5 dark:hover:bg-indigo-500/5',
    primaryHoverBorder: 'hover:border-indigo-500 dark:hover:border-indigo-400',
    primaryHoverText: 'hover:text-indigo-700 dark:hover:text-indigo-400',
    primaryRing: 'focus:ring-indigo-500 focus:border-indigo-500',
    glowBg: 'bg-indigo-500/25 dark:bg-indigo-400/25',
    glowBorder: 'border-indigo-500/30 dark:border-indigo-400/30',
    badgeBg: 'bg-indigo-500',
    badgePing: 'bg-indigo-400',
    colorDot: 'bg-indigo-500'
  },
  {
    id: 'violet',
    name: 'Violet Tech',
    primaryBg: 'bg-violet-600',
    primaryText: 'text-violet-600 dark:text-violet-400',
    primaryHoverBg: 'hover:bg-violet-500/5 dark:hover:bg-violet-500/5',
    primaryHoverBorder: 'hover:border-violet-500 dark:hover:border-violet-400',
    primaryHoverText: 'hover:text-violet-700 dark:hover:text-violet-400',
    primaryRing: 'focus:ring-violet-500 focus:border-violet-500',
    glowBg: 'bg-violet-500/25 dark:bg-violet-400/25',
    glowBorder: 'border-violet-500/30 dark:border-violet-400/30',
    badgeBg: 'bg-violet-500',
    badgePing: 'bg-violet-400',
    colorDot: 'bg-violet-500'
  },
  {
    id: 'amber',
    name: 'Amber Warmth',
    primaryBg: 'bg-amber-500',
    primaryText: 'text-amber-600 dark:text-amber-400',
    primaryHoverBg: 'hover:bg-amber-500/5 dark:hover:bg-amber-500/5',
    primaryHoverBorder: 'hover:border-amber-500 dark:hover:border-amber-400',
    primaryHoverText: 'hover:text-amber-700 dark:hover:text-amber-400',
    primaryRing: 'focus:ring-amber-500 focus:border-amber-500',
    glowBg: 'bg-amber-500/25 dark:bg-amber-400/25',
    glowBorder: 'border-amber-500/30 dark:border-amber-400/30',
    badgeBg: 'bg-amber-500',
    badgePing: 'bg-amber-400',
    colorDot: 'bg-amber-500'
  }
];

function GoogleAssistantLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Red Circle (Main, Largest) */}
      <motion.circle
        cx="6"
        cy="12"
        r="3.2"
        fill="#EA4335"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        style={{ transformOrigin: "6px 12px" }}
      />
      {/* Blue Circle (Second Largest) */}
      <motion.circle
        cx="12"
        cy="6.2"
        r="2.1"
        fill="#4285F4"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ transformOrigin: "12px 6.2px" }}
      />
      {/* Yellow Circle (Medium Small) */}
      <motion.circle
        cx="13.5"
        cy="13.5"
        r="1.6"
        fill="#FBBC05"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ transformOrigin: "13.5px 13.5px" }}
      />
      {/* Green Circle (Smallest) */}
      <motion.circle
        cx="18.5"
        cy="11.5"
        r="1"
        fill="#34A853"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{ transformOrigin: "18.5px 11.5px" }}
      />
    </svg>
  );
}

function CopyButton({ text, activeTheme }: { text: string; activeTheme: ChatTheme }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 -mr-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-150 flex items-center gap-1 cursor-pointer"
      title="Copy message to clipboard"
    >
      {copied ? (
        <>
          <span className={`text-[9px] font-medium ${activeTheme.primaryText}`}>Copied!</span>
          <Check className={`w-3 h-3 ${activeTheme.primaryText}`} />
        </>
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

interface SpeakButtonProps {
  messageId: string;
  text: string;
  activeTheme: ChatTheme;
  speakingMsgId: string | null;
  onToggleSpeak: (id: string, text: string) => void;
}

function SpeakButton({ messageId, text, activeTheme, speakingMsgId, onToggleSpeak }: SpeakButtonProps) {
  const isSpeaking = speakingMsgId === messageId;
  const speechSynthSupported = 'speechSynthesis' in window;

  if (!speechSynthSupported) return null;

  return (
    <button
      onClick={() => onToggleSpeak(messageId, text)}
      className="p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-150 flex items-center gap-1 cursor-pointer"
      title={isSpeaking ? "Stop reading aloud" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className={`w-3.5 h-3.5 ${activeTheme.primaryText} animate-pulse`} />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('zentriya_chat_theme');
      if (saved && COLOR_THEMES.some(t => t.id === saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load theme from localStorage:', e);
    }
    return 'emerald';
  });

  const activeTheme = COLOR_THEMES.find(t => t.id === activeThemeId) || COLOR_THEMES[0];

  useEffect(() => {
    try {
      localStorage.setItem('zentriya_chat_theme', activeThemeId);
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
  }, [activeThemeId]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Start fresh with welcome message as requested
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        text: "Hello! I am Zentriya's official AI assistant. How can I help you with our premium IT solutions, collaborative internships, or technical training courses today?",
        timestamp: new Date()
      }
    ];
  });

  // Clean up any previously stored chat history to comply with the preference of not showing past chats
  useEffect(() => {
    try {
      localStorage.removeItem('zentriya_chat_history');
    } catch (e) {
      console.error('Failed to clear previous chat history:', e);
    }
  }, []);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const streamingIntervalRef = useRef<any>(null);

  // Stop streaming on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  // Web Speech API Integration
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Stop listening when chat window closes or when unmounted
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  useEffect(() => {
    if (!isOpen && isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isOpen, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    }
  };

  // Web Speech synthesis / read aloud states
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Stop reading aloud on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop reading aloud when chat window is closed
  useEffect(() => {
    if (!isOpen && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
  }, [isOpen]);

  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      
      // Clean markdown, asterisks, list markers, links, code snippets for natural reading aloud
      const cleanedText = text
        .replace(/\*\*+/g, '') // Bold formatting
        .replace(/\*+/g, '') // Italics or bullet list asterisks
        .replace(/-\s+/g, '') // Bullet list markers
        .replace(/`[^`]+`/g, '') // Inline code blocks
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Markdown link conversion
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.onend = () => {
        setSpeakingMsgId(null);
      };
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setSpeakingMsgId(null);
      };

      setSpeakingMsgId(messageId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper to format line breaks, bold text, and bullet lists professionally
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      let formattedLine = line;
      
      // Check if line is a bullet point starting with * or -
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      if (isBullet) {
        formattedLine = line.trim().replace(/^[\*\-]\s+/, '');
      }

      // Parse bold text **something**
      const parts = formattedLine.split(/(\*\*.*?\*\*)/g);
      const elements = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-bold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc pl-1 mb-1.5 text-slate-700 dark:text-slate-300">
            {elements}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
          {elements}
        </p>
      );
    });
  };

  // Auto scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Intelligently auto-expand the welcome message after the user spends 30 seconds on the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(prevIsOpen => {
        if (!prevIsOpen) {
          setShowNotificationBadge(false);
          return true;
        }
        return prevIsOpen;
      });
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  // Handle opening the chat window
  const handleOpenChat = () => {
    setIsOpen(true);
    setShowNotificationBadge(false);
  };

  // Reset/Clear chat history
  const handleResetChat = () => {
    if (window.confirm("Do you want to reset your conversation history?")) {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);
      setIsStreaming(false);
      setIsLoading(false);
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          text: "Hello! I am Zentriya's official AI assistant. How can I help you with our premium IT solutions, collaborative internships, or technical training courses today?",
          timestamp: new Date()
        }
      ]);
    }
  };

  // Export current conversation as a text file
  const handleExportConversation = () => {
    try {
      const formattedText = messages
        .map((msg) => {
          const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const role = msg.role === 'user' ? 'User' : 'Zentriya AI Assistant';
          return `[${time}] ${role}:\n${msg.text}`;
        })
        .join('\n\n-----------------------------------------\n\n');

      const header = `=========================================\nZENTRIYA AI - CONVERSATION EXPORT\nExported on: ${new Date().toLocaleString()}\n=========================================\n\n`;
      const footer = `\n\n=========================================\nThank you for using Zentriya AI Assistant\n=========================================\n`;

      const fullText = header + formattedText + footer;
      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zentriya-ai-chat-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export conversation:', err);
    }
  };

  // Send message handler
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || isStreaming) return;

    // Clear any previous active streaming interval
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history to send to Gemini endpoint
      // We exclude the initial welcome message from the history to keep it clean,
      // or we can include all messages. Let's include everything except welcome if needed, or everything.
      const historyToSend = messages.map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: historyToSend
        })
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with AI server');
      }

      const data = await response.json();

      setIsLoading(false); // Hide the loader, since we're going to type/stream now
      setIsStreaming(true);

      const aiMessageId = Math.random().toString(36).substring(7);
      const aiMessagePlaceholder: ChatMessage = {
        id: aiMessageId,
        role: 'assistant',
        text: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessagePlaceholder]);

      // Split words and retain whitespace for natural rendering
      const chunks = data.text.split(/(\s+)/).filter(Boolean);
      let currentText = '';
      let chunkIdx = 0;

      streamingIntervalRef.current = setInterval(() => {
        if (chunkIdx < chunks.length) {
          currentText += chunks[chunkIdx];
          chunkIdx++;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, text: currentText }
                : msg
            )
          );
        } else {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
            streamingIntervalRef.current = null;
          }
          setIsStreaming(false);
        }
      }, 30); // 30ms per word/space chunk for natural typing speed

    } catch (error) {
      console.error('Error fetching chat response:', error);
      setIsLoading(false);
      setIsStreaming(true);
      
      const errorMessageId = Math.random().toString(36).substring(7);
      const errorMessagePlaceholder: ChatMessage = {
        id: errorMessageId,
        role: 'assistant',
        text: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessagePlaceholder]);

      const errorText = "I am experiencing a minor connection glitch right now. Please check your internet connection, or drop us an email directly at info@zentriya.com and we will be delighted to help!";
      const chunks = errorText.split(/(\s+)/).filter(Boolean);
      let currentText = '';
      let chunkIdx = 0;

      streamingIntervalRef.current = setInterval(() => {
        if (chunkIdx < chunks.length) {
          currentText += chunks[chunkIdx];
          chunkIdx++;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === errorMessageId
                ? { ...msg, text: currentText }
                : msg
            )
          );
        } else {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
            streamingIntervalRef.current = null;
          }
          setIsStreaming(false);
        }
      }, 30);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div id="zentriya-ai-chatbot">
      
      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 50 }}
            transition={{ type: "spring", damping: 26, stiffness: 290 }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-3 sm:inset-auto sm:bottom-24 sm:right-6 w-auto sm:w-[400px] h-auto sm:h-[580px] max-h-[calc(100vh-32px)] sm:max-h-[580px] min-h-[340px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <GoogleAssistantLogo className="w-5 h-5" />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${activeTheme.colorDot} border-2 border-white dark:border-slate-950 rounded-full`}></span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    Zentriya AI
                  </h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider">
                    Virtual Assistant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-lg transition-colors ${showSettings ? `${activeTheme.primaryText} bg-slate-150/40 dark:bg-slate-800/40` : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-150/40 dark:hover:bg-slate-800/40'}`}
                  title="Theme Settings"
                >
                  <Palette className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportConversation}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-150/40 dark:hover:bg-slate-800/40 transition-colors"
                  title="Export conversation"
                >
                  <Download className="w-4 h-4" />
                </button>
                {messages.length > 1 && (
                  <button
                    onClick={handleResetChat}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-150/40 dark:hover:bg-slate-800/40 transition-colors"
                    title="Clear history"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-150/40 dark:hover:bg-slate-800/40 transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-150/40 dark:hover:bg-slate-800/40 transition-colors sm:hidden"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showSettings ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Settings Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-850">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-3">
                      Brand Themes
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Choose an accent color palette that matches Zentriya's professional brand identity:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      {COLOR_THEMES.map((theme) => {
                        const isSelected = theme.id === activeThemeId;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => setActiveThemeId(theme.id)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? `bg-slate-50 dark:bg-slate-950/40 border-slate-300 dark:border-slate-700 shadow-sm`
                                : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Colored swatch */}
                              <span className={`w-4 h-4 rounded-full ${theme.primaryBg} shadow-sm flex-shrink-0`} />
                              <div>
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                                  {theme.name}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                  {theme.id === 'emerald' ? 'Corporate Accent' : 'Brand Accent'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Radio button */}
                            <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? `border-slate-900 dark:border-slate-100`
                                : 'border-slate-300 dark:border-slate-700'
                            }`}>
                              {isSelected && (
                                <span className={`w-2.5 h-2.5 rounded-full ${theme.primaryBg}`} />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-3">
                      Connection Status
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-4 border border-slate-150/40 dark:border-slate-800/40 space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 dark:text-slate-500">Service</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Zentriya Core API</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 dark:text-slate-500">Status</span>
                        <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 dark:text-slate-500">Selected Palette</span>
                        <span className={`font-semibold ${activeTheme.primaryText}`}>{activeTheme.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Save/Close Button */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850/60">
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`w-full py-2.5 rounded-xl font-medium text-xs text-white ${activeTheme.primaryBg} hover:opacity-95 transition-opacity text-center cursor-pointer shadow-sm`}
                  >
                    Done & Return to Chat
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-850">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-slate-900 text-white rounded-br-none dark:bg-slate-100 dark:text-slate-950 font-medium'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none dark:bg-slate-800/50 dark:text-slate-200 border border-slate-150/50 dark:border-slate-800/40'
                        }`}
                      >
                        {renderMessageText(msg.text)}
                        <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-200/30 dark:border-slate-700/20">
                          <div
                            className={`text-[9px] font-mono ${
                              msg.role === 'user' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {msg.role !== 'user' && (
                            <div className="flex items-center gap-1">
                              <SpeakButton
                                messageId={msg.id}
                                text={msg.text}
                                activeTheme={activeTheme}
                                speakingMsgId={speakingMsgId}
                                onToggleSpeak={handleSpeak}
                              />
                              <CopyButton text={msg.text} activeTheme={activeTheme} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Loader Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-150/50 dark:border-slate-800/40 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3], y: [1.5, -1.5, 1.5] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                          className={`w-2 h-2 ${activeTheme.primaryBg} rounded-full`}
                        />
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3], y: [1.5, -1.5, 1.5] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          className={`w-2 h-2 ${activeTheme.primaryBg} rounded-full`}
                        />
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3], y: [1.5, -1.5, 1.5] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                          className={`w-2 h-2 ${activeTheme.primaryBg} rounded-full`}
                        />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Container */}
                {messages.length === 1 && !isLoading && !isStreaming && (
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-850/60 bg-slate-50/40 dark:bg-slate-950/20">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
                      Common Inquiries
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTED_PROMPTS.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(prompt)}
                          className={`text-left text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 ${activeTheme.primaryHoverBorder} ${activeTheme.primaryHoverBg} text-slate-700 dark:text-slate-300 ${activeTheme.primaryHoverText} transition-all duration-200 flex items-center justify-between group`}
                        >
                          <span className="line-clamp-1">{prompt}</span>
                          <ArrowRight className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ${activeTheme.primaryText}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Horizontally Scrollable Quick Reply Pill Tray */}
                {!isLoading && !isStreaming && (
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt)}
                        className={`flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 ${activeTheme.primaryHoverBg} ${activeTheme.primaryText} border border-slate-200/80 dark:border-slate-800 ${activeTheme.primaryHoverBorder} transition-all duration-150 text-slate-600 dark:text-slate-400 cursor-pointer shadow-sm`}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isListening ? "Listening... Speak now" : isLoading ? "Zentriya is generating..." : isStreaming ? "Zentriya is typing..." : "Type your inquiry here..."}
                      disabled={isLoading || isStreaming}
                      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 ${activeTheme.primaryRing} transition-all disabled:opacity-60`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono hidden sm:inline-flex items-center gap-1">
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  {speechSupported && (
                    <button
                      onClick={toggleListening}
                      disabled={isLoading || isStreaming}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
                        isListening
                          ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                          : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                      title={isListening ? "Stop recording voice input" : "Record voice input"}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isLoading || isStreaming}
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-950 rounded-xl flex items-center justify-center transition-all shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden sm:block' : 'block'}`}>
        {!isOpen && (
          <>
            {/* Subtle, beautiful pulsing glow layers */}
            <span className={`absolute inset-0 rounded-full ${activeTheme.glowBg} blur-sm animate-pulse`} />
            <span className={`absolute -inset-1 rounded-full border-2 ${activeTheme.glowBorder} animate-ping opacity-75`} style={{ animationDuration: '3s' }} />
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isOpen ? () => setIsOpen(false) : handleOpenChat}
          className="relative w-14 h-14 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-full flex items-center justify-center shadow-xl cursor-pointer group transition-all duration-250"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <GoogleAssistantLogo className="w-6 h-6" />
                {/* Pulsing notification badge */}
                {showNotificationBadge && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeTheme.badgePing} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${activeTheme.badgeBg}`}></span>
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

    </div>
  );
}
