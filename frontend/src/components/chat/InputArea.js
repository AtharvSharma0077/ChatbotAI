import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InputArea = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-[#E4E4E7] dark:border-[#27272A] p-4 bg-white dark:bg-[#18181B]" data-testid="input-area">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2 bg-white dark:bg-[#09090B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-[#4F46E5] focus-within:border-transparent transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none bg-transparent px-5 py-4 text-[#18181B] dark:text-[#FAFAFA] placeholder:text-[#71717A] dark:placeholder:text-[#A1A1AA] focus:outline-none max-h-[150px] overflow-y-auto scrollbar-thin"
              data-testid="message-input"
            />
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="mb-2 mr-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              data-testid="send-message-btn"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
};