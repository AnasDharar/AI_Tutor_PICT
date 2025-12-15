interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        <p className="text-base leading-relaxed">{content}</p>
        {timestamp && (
          <p
            className={`text-xs mt-1 ${
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
