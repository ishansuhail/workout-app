"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Message sent successfully:", data);
        toast.success("Logged exercise successfully");
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

