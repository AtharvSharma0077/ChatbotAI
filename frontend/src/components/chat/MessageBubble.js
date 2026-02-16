import React from "react";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
      data-testid={`message-${message.role}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-[#4F46E5]"
            : "bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6]"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Sparkles size={16} className="text-white" />
        )}
      </div>

      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
          isUser
            ? "bg-[#4F46E5] text-white rounded-br-sm"
            : "bg-[#F4F4F5] dark:bg-[#27272A] text-[#18181B] dark:text-[#FAFAFA] rounded-bl-sm"
        }`}
        data-testid="message-content"
      >
        <div className="message-content text-base leading-relaxed">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};