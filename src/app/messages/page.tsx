'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      participant: {
        id: 'user1',
        name: 'Priya Sharma',
        profilePhoto: '/api/placeholder/50/50',
        isOnline: true,
      },
      lastMessage: {
        content: 'That sounds great! Looking forward to meeting you.',
        timestamp: new Date('2024-01-15T14:30:00'),
        senderId: 'user1',
      },
      unreadCount: 2,
    },
    {
      id: '2',
      participant: {
        id: 'user2',
        name: 'Anita Patel',
        profilePhoto: '/api/placeholder/50/50',
        isOnline: false,
      },
      lastMessage: {
        content: 'Thank you for accepting my interest!',
        timestamp: new Date('2024-01-14T16:45:00'),
        senderId: 'user2',
      },
      unreadCount: 0,
    },
    {
      id: '3',
      participant: {
        id: 'user3',
        name: 'Kavya Reddy',
        profilePhoto: '/api/placeholder/50/50',
        isOnline: true,
      },
      lastMessage: {
        content: 'Hi! Nice to connect with you.',
        timestamp: new Date('2024-01-13T10:20:00'),
        senderId: 'current-user',
      },
      unreadCount: 1,
    },
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: '1',
      senderId: 'user1',
      content: 'Hi! Thank you for accepting my interest. I really liked your profile.',
      timestamp: new Date('2024-01-15T10:00:00'),
      type: 'text',
    },
    {
      id: '2',
      senderId: 'current-user',
      content: 'Hello Priya! Thank you for reaching out. I found your profile interesting too.',
      timestamp: new Date('2024-01-15T10:15:00'),
      type: 'text',
    },
    {
      id: '3',
      senderId: 'user1',
      content: 'I see we both love traveling. Have you been to any interesting places recently?',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'text',
    },
    {
      id: '4',
      senderId: 'current-user',
      content: 'Yes! I recently visited Goa with my family. The beaches were absolutely beautiful. What about you?',
      timestamp: new Date('2024-01-15T11:00:00'),
      type: 'text',
    },
    {
      id: '5',
      senderId: 'user1',
      content: 'That sounds amazing! I went to Kerala last month. The backwaters were so peaceful.',
      timestamp: new Date('2024-01-15T11:15:00'),
      type: 'text',
    },
    {
      id: '6',
      senderId: 'user1',
      content: 'Would you like to have a phone conversation sometime this week?',
      timestamp: new Date('2024-01-15T14:00:00'),
      type: 'text',
    },
    {
      id: '7',
      senderId: 'current-user',
      content: 'That sounds great! Looking forward to meeting you.',
      timestamp: new Date('2024-01-15T14:30:00'),
      type: 'text',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would send the message to your API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-rose-50 border-rose-200' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.participant.profilePhoto}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participant.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-rose-500 text-white text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(conversation.lastMessage.timestamp, 'relative')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage.senderId === 'current-user' ? 'You: ' : ''}
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConversationData.participant.profilePhoto}
                      alt={selectedConversationData.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConversationData.participant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedConversationData.participant.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedConversationData.participant.isOnline ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === 'current-user' ? 'text-rose-100' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(message.timestamp, 'short')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
