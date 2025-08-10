'use client';

import React, { useState } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';

interface Conversation {
  id: string;
  name: string;
}

interface Message {
  from: string;
  text: string;
}

const conversations: Conversation[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const messagesMock: { [key: string]: Message[] } = {
  '1': [
    { from: 'me', text: 'Hi Alice!' },
    { from: 'Alice', text: 'Hello!' },
  ],
  '2': [
    { from: 'me', text: 'Hey Bob, how are you?' },
    { from: 'Bob', text: 'Doing well, thanks!' },
  ],
  '3': [
    { from: 'me', text: 'Hi Charlie' },
    { from: 'Charlie', text: 'Hey!' },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  return (
    <div className="flex h-[calc(100vh-52px)] lg:h-[calc(100vh-64px)] bg-background overflow-hidden">
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatWindow
        messages={messagesMock[selectedId] || []}
        conversation={conversations.find(c => c.id === selectedId)}
      />
    </div>
  );
} 