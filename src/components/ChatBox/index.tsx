/* eslint-disable react-hooks/exhaustive-deps */
import React, { createRef, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { VideoClient } from "@zoom/videosdk";
import { Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react";
import "moment/locale/pt-br";
import moment from "moment";
moment.locale("pt-br");

interface Props {
  client: typeof VideoClient;
  isAdmin?: boolean;
}

const ChatBox: React.FC<Props> = ({ client, isAdmin }) => {
  const { messages, sendMessage } = useChat(client);
  const messagesEndRef = createRef<any>();
  const [text, setText] = React.useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    sendMessage(text);
    setText("");
  };

  return (
    <Stack h="full" flex={1}>
      <Stack flex={1} overflow="auto" maxH={isAdmin ? "74vh" : "58vh"}>
        {messages.map((message, index) => (
          <Box key={index} pb="10px">
            <HStack>
              <Text fontSize="10px" fontWeight="bold">
                {message.sender.name}
              </Text>

              <Text opacity={0.5} fontSize="10px">
                {moment(message.timestamp).format("HH[h]mm - DD/MM/yy")}
              </Text>
            </HStack>

            <Text lineHeight="16px">{message.message}</Text>
          </Box>
        ))}

        <div ref={messagesEndRef} />
      </Stack>

      <HStack pb="10px">
        <Input
          style={{
            backgroundColor: "white",
          }}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Digite sua mensagem"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Button
          style={{
            backgroundColor: "#DCAC36",
            borderRadius: 5,
            height: 36,
          }}
          onClick={handleSubmit}
        >
          Enviar
        </Button>
      </HStack>
    </Stack>
  );
};

export default ChatBox;
