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
        console.error("❌ Error missing fields:", data.error);
        
        // Handle missing fields by prompting user
        if (data.missingFields && data.missingFields.length > 0) {
          const fieldNames = data.missingFields.map((field: string) => {
            // Convert camelCase to readable format
            return field.replace(/([A-Z])/g, ' $1').toLowerCase();
          }).join(", ");
          
          // Create a helpful prompt message
          const promptMessage = `Couldn't extract: ${fieldNames}. Please provide these details.`;
          toast.error(promptMessage, { duration: 5000 });
          
          // Add assistant response with the prompt to history
          const assistantMessage: Message = { 
            role: "assistant", 
            content: `Missing information: ${fieldNames}. Please provide these details.` 
          };
          
          // Update history with new messages
          setMessageHistory(prev => [...prev, userMessage, assistantMessage].slice(-10));
          
          // Keep the original message in the textarea so user can edit it
          // Don't clear the message
        } else {
          toast.error("Failed to log exercise");
        }
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

