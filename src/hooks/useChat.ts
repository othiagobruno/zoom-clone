/* eslint-disable react-hooks/exhaustive-deps */
import { ChatMessage, VideoClient } from "@zoom/videosdk";
import { useEffect, useState } from "react";

export const useChat = (client: typeof VideoClient) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chat = client.getChatClient();

  const removeDuplicate = (messages: ChatMessage[]) => {
    const map = new Map<string, ChatMessage>();
    messages.forEach((m) => {
      map.set(m.id!, m);
    });
    return Array.from(map.values());
  };

  const sendMessage = (message: string) => {
    chat.sendToAll(message);
  };

  useEffect(() => {
    const m = chat.getHistory();
    setMessages(m);
  }, [client, chat]);

  useEffect(() => {
    client.on("chat-on-message", (payload) => {
      setMessages((messages) => [...messages, payload]);
    });
  }, []);

  return {
    sendMessage,
    messages: removeDuplicate(messages),
  };
};
