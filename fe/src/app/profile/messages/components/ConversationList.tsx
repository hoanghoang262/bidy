import React, { useState } from "react";

interface Conversation {
  id: string;
  name: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 border-r border-border bg-background">
        <h3 className="p-4 m-0 border-b border-border text-foreground text-lg font-semibold">
          Danh sách tin nhắn
        </h3>
        <ul className="list-none m-0 p-0">
          {conversations.map((c) => (
            <li
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`p-4 cursor-pointer border-b border-border transition-colors flex items-center gap-2 ${
                c.id === selectedId
                  ? "bg-primary text-primary-foreground font-bold"
                  : "hover:bg-primary/50 text-foreground"
              } ${c.id === selectedId ? "" : "font-normal"}`}
            >
              {c.name}
            </li>
          ))}
        </ul>
      </aside>
      {/* Mobile dropdown nav */}
      <div className="lg:hidden fixed top-[52px] left-0 right-0 z-20">
        <button
          className="w-full flex items-center text-foreground justify-center gap-2 h-14 bg-background border-t border-border shadow-md text-base font-semibold focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          {selectedConversation ? selectedConversation.name : "Conversations"}
          <svg
            className={`w-5 h-5 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {open && (
          <div className="absolute top-[56px] left-0 right-0 bg-background border-t border-border shadow-xl h-fit max-h-[25dvh] overflow-y-auto animate-fadeIn">
            <ul className="list-none m-0 p-0 divide-y divide-border">
              {conversations.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    onSelect(c.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 p-4 cursor-pointer transition-colors ${
                    c.id === selectedId
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-primary/25 text-foreground"
                  } ${c.id === selectedId ? "" : "font-normal"}`}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationList;
