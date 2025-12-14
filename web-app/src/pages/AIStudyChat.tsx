import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, Mic } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ChatMessage from "@/components/ChatMessage";
import SuggestionChip from "@/components/SuggestionChip";
import { Button } from "@/components/ui/button";

const AIStudyChat = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const initialMessages = [
    {
      content: t('aiChat.initialMessage'),
      isUser: false,
      timestamp: "Now",
    },
  ];

  const suggestions = [
    t('aiChat.suggestions.explain'),
    t('aiChat.suggestions.examples'),
    t('aiChat.suggestions.questions'),
    t('aiChat.suggestions.fun'),
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");

  // Reset messages when language changes
  useEffect(() => {
    setMessages([{
      content: t('aiChat.initialMessage'),
      isUser: false,
      timestamp: "Now",
    }]);
  }, [language]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getLanguageLabel = () => {
    if (language === "hi") return "हिंदी";
    if (language === "mr") return "मराठी";
    return "EN";
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      { content: messageText, isUser: true, timestamp: "Now" },
    ]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      if (messageText.toLowerCase().includes("explain") || messageText.includes("समझाएं")) {
        response = t('aiResponses.chat.explain');
      } else if (messageText.toLowerCase().includes("example") || messageText.includes("उदाहरण")) {
        response = t('aiResponses.chat.example');
      } else if (messageText.toLowerCase().includes("question") || messageText.includes("सवाल") || messageText.includes("प्रश्न")) {
        response = t('aiResponses.chat.question');
      } else {
        response = t('aiResponses.chat.default').replace("{0}", messageText);
      }

      setMessages((prev) => [
        ...prev,
        { content: response, isUser: false, timestamp: "Now" },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('aiChat.title')} />

      {/* Offline Warning */}
      {!isOnline && (
        <div className="px-4 py-2 bg-warning/20 border-b border-warning/30">
          <p className="text-sm text-center font-semibold text-foreground">
            {t('aiChat.connectToChat')}
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-48">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              content={msg.content}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-4 max-w-lg mx-auto w-full">
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              label={suggestion}
              onClick={() => handleSend(suggestion)}
            />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 hover:bg-muted/80 transition-colors"
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t('aiChat.placeholder')}
            className="flex-1 h-12 px-4 rounded-full bg-muted border-0 focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
            disabled={!isOnline}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || !isOnline}
            className="w-12 h-12 rounded-full p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AIStudyChat;
