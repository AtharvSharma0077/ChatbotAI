import React from "react";
import { MessageSquarePlus, Trash2, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Sidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  theme,
  onToggleTheme,
  isOpen,
  onClose,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-[#18181B] border-r border-[#E4E4E7] dark:border-[#27272A]">
      <div className="p-4 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-2xl font-semibold text-[#4F46E5]"
            data-testid="sidebar-title"
          >
            E1 Chat
          </h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] rounded-lg transition-colors"
            data-testid="sidebar-close-btn"
          >
            <X size={20} className="text-[#71717A] dark:text-[#A1A1AA]" />
          </button>
        </div>
        <Button
          onClick={onNewConversation}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl py-6 font-medium transition-all duration-200 hover:shadow-lg"
          data-testid="new-chat-btn"
        >
          <MessageSquarePlus size={20} className="mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1" data-testid="conversations-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                currentConversationId === conv.id
                  ? "bg-[#F4F4F5] dark:bg-[#27272A]"
                  : "hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
              }`}
              onClick={() => onSelectConversation(conv.id)}
              data-testid={`conversation-item-${conv.id}`}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA] truncate"
                  data-testid={`conversation-title-${conv.id}`}
                >
                  {conv.title}
                </p>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                  {formatDate(conv.updated_at)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
                data-testid={`delete-conversation-btn-${conv.id}`}
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[#E4E4E7] dark:border-[#27272A]">
        <Button
          onClick={onToggleTheme}
          variant="outline"
          className="w-full rounded-xl py-5 border-[#E4E4E7] dark:border-[#27272A] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-colors"
          data-testid="theme-toggle-btn"
        >
          {theme === "light" ? (
            <Moon size={18} className="mr-2" />
          ) : (
            <Sun size={18} className="mr-2" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block w-[280px] h-full" data-testid="sidebar-desktop">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="sidebar-mobile"
      >
        {sidebarContent}
      </div>
    </>
  );
};