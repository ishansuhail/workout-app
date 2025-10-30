"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const { user } = useUser();
  const userId = user?.id;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Add user message to history
    const userMessage: Message = { role: "user", content: message };

    try {
      const response = await fetch(`/api/chat/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message,
          history: messageHistory.slice(-10) // Send last 10 messages (5 back-and-forth exchanges)
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Message sent successfully:", data);
        toast.success("Logged exercise successfully");
        
        // Add assistant response to history
        const assistantMessage: Message = { 
          role: "assistant", 
          content: data.aiResponse || "Exercise logged successfully" 
        };
        
        // Update history with new messages, keep only last 10 (5 exchanges)
        setMessageHistory(prev => [...prev, userMessage, assistantMessage].slice(-10));
        
        // Clear the textarea after successful send
        setMessage("");
      } else {
        console.error("❌ Error:", data.error);
        toast.error("Failed to log exercise");
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid w-full gap-2">
      <Textarea
        placeholder="Type your message here. (Cmd/Ctrl + Enter to send)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
        {isLoading ? "Sending..." : "Send message"}
      </Button>
    </div>
  );
}

