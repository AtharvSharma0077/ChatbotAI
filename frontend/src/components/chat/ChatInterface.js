import React, { useState, useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { InputArea } from "@/components/chat/InputArea";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ChatInterface = ({
  conversationId,
  onConversationUpdate,
  onToggleSidebar,
}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const response = await axios.get(
        `${API}/conversations/${conversationId}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (content) => {
    if (!conversationId) {
      toast.error("Please create a conversation first");
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === "message") {
              setMessages((prev) => [...prev, data.data]);
              onConversationUpdate();
            } else if (data.type === "error") {
              toast.error("AI Error: " + data.data);
            }
          } catch (e) {
            console.error("Error parsing response:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-[#09090B]">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] rounded-2xl flex items-center justify-center">
              <Sparkles size={40} className="text-white" />
            </div>
          </div>
          <h2
            className="text-3xl font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-3"
            data-testid="welcome-title"
          >
            Welcome to E1 Chat
          </h2>
          <p className="text-[#71717A] dark:text-[#A1A1AA] text-lg mb-6">
            Start a conversation by creating a new chat
          </p>
          <Button
            onClick={onToggleSidebar}
            className="md:hidden bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl px-6 py-5 font-medium transition-all duration-200 hover:shadow-lg"
            data-testid="mobile-new-chat-btn"
          >
            <Menu size={20} className="mr-2" />
            Open Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#09090B]" data-testid="chat-interface">
      {/* Header */}
      <div className="border-b border-[#E4E4E7] dark:border-[#27272A] p-4 flex items-center gap-3 bg-white dark:bg-[#18181B]">
        <Button
          onClick={onToggleSidebar}
          variant="ghost"
          size="icon"
          className="md:hidden"
          data-testid="toggle-sidebar-btn"
        >
          <Menu size={20} />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-[#18181B] dark:text-[#FAFAFA]" data-testid="chat-header-title">
              E1 Assistant
            </h2>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Powered by Gemini 2.0 Flash (Free API)
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin" data-testid="messages-container">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <MessageBubble key={message.id || index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3" data-testid="typing-indicator">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="bg-[#F4F4F5] dark:bg-[#27272A] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <InputArea onSendMessage={sendMessage} disabled={isLoading} />
    </div>
  );
};