import React, { useState, useEffect } from "react";
import "@/App.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get(`${API}/conversations`);
      setConversations(response.data);
      if (response.data.length > 0 && !currentConversationId) {
        setCurrentConversationId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const createNewConversation = async () => {
    try {
      const response = await axios.post(`${API}/conversations`, {
        title: "New Chat",
      });
      setConversations([response.data, ...conversations]);
      setCurrentConversationId(response.data.id);
      setSidebarOpen(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await axios.delete(`${API}/conversations/${id}`);
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        const remaining = conversations.filter((c) => c.id !== id);
        setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="App flex h-screen overflow-hidden bg-white dark:bg-[#09090B]">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={(id) => {
          setCurrentConversationId(id);
          setSidebarOpen(false);
        }}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ChatInterface
        conversationId={currentConversationId}
        onConversationUpdate={loadConversations}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Toaster />
    </div>
  );
}

export default App;