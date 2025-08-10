import React, { useState, useRef, useEffect } from "react";

interface Message {
  from: string;
  text: string;
}

interface Conversation {
  id: string;
  name: string;
}

interface ChatWindowProps {
  messages: Message[];
  conversation?: Conversation;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, conversation }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversation]);

  if (!conversation)
    return (
      <div className="flex-1 flex items-center justify-center">
        No conversation selected
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="p-4 border-b border-border text-foreground font-bold text-lg">
        {conversation.name}
      </header>
      <div className="flex-1 overflow-y-auto p-4 bg-card space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-[60%] break-words ${
                msg.from === "me"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/25 text-foreground"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex border-t border-border p-4 bg-background gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setInput(""); // No actual send logic
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="px-8 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/80 transition-colors"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
