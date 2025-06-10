"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Phone,
  Video,
  Paperclip,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: "user" | "agent" | "bot";
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  agentName?: string;
  agentPhoto?: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [currentAgent, setCurrentAgent] = useState<{
    name: string;
    photo: string;
    status: "online" | "busy";
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Simulate connection and initial messages
      setTimeout(() => {
        setConnectionStatus("connected");
        setCurrentAgent({
          name: "Priya Support",
          photo: "/api/placeholder/40/40",
          status: "online",
        });

        const welcomeMessage: Message = {
          id: "1",
          sender: "agent",
          content:
            "Hello! Welcome to Jeevanik support. I'm Priya, and I'm here to help you. How can I assist you today?",
          timestamp: new Date(),
          type: "text",
          agentName: "Priya Support",
          agentPhoto: "/api/placeholder/40/40",
        };

        setMessages([welcomeMessage]);
      }, 1500);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);

      const responses = [
        "I understand your concern. Let me help you with that.",
        "That's a great question! Here's what I can tell you...",
        "I'll be happy to assist you with this. Let me check our records.",
        "Thank you for reaching out. I can definitely help you resolve this.",
        "I see what you mean. Let me provide you with the best solution.",
      ];

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: "text",
        agentName: currentAgent?.name,
        agentPhoto: currentAgent?.photo,
      };

      setMessages((prev) => [...prev, agentMessage]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVideoCall = () => {
    toast({
      title: "Video Call Requested",
      description: "An agent will join the video call shortly.",
    });
  };

  const startVoiceCall = () => {
    toast({
      title: "Voice Call Requested",
      description: "An agent will call you within 2 minutes.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-80 shadow-2xl transition-all duration-300 ${
          isMinimized ? "h-16" : "h-96"
        }`}
      >
        {/* Header */}
        <CardHeader className="p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm">Live Support</CardTitle>
                {currentAgent && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={currentAgent.photo}
                        alt={currentAgent.name}
                      />
                      <AvatarFallback className="text-xs">
                        {currentAgent.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{currentAgent.name}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        currentAgent.status === "online"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {connectionStatus === "connected" ? "Online" : "Connecting..."}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-blue-700 p-1"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-blue-700 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-0 h-64 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs ${
                        message.sender === "user" ? "order-2" : "order-1"
                      }`}
                    >
                      {message.sender === "agent" && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={message.agentPhoto}
                              alt={message.agentName}
                            />
                            <AvatarFallback className="text-xs">
                              {message.agentName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">
                            {message.agentName}
                          </span>
                        </div>
                      )}

                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border shadow-sm"
                        }`}
                      >
                        {message.content}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border shadow-sm rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              {/* Quick Actions */}
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startVoiceCall}
                  className="flex-1"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={startVideoCall}
                  className="flex-1"
                >
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </Button>
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={connectionStatus !== "connected"}
                />

                <Button variant="ghost" size="sm" className="p-2">
                  <Smile className="h-4 w-4" />
                </Button>

                <Button
                  onClick={sendMessage}
                  disabled={
                    !newMessage.trim() || connectionStatus !== "connected"
                  }
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-2 text-center">
                Powered by Jeevanik Support
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// Chat Widget Button Component
export function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
