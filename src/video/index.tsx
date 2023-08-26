import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useVideoActions } from "../hooks/useVideoActions";
import { useStream } from "../hooks/useStream";
import { BiMicrophone } from "react-icons/bi";
import { useWebsocket } from "../hooks/useWebsocket";
import UserCardRequest from "../components/UserCardRequest";
import UserCard from "../components/UserCard";
import VideoBox from "../components/VideoBox";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { useState } from "react";
import ChatBox from "../components/ChatBox";

export function Zoom() {
  const [tab, setTab] = useState("people");
  const currentId = new URLSearchParams(window.location.search).get("id");
  const callId = new URLSearchParams(window.location.search).get("callId");
  const { requestMicrophone, requestedMicrophones, removeRequestedMicrophone } =
    useWebsocket(callId ?? "");

  const usersBackend = [
    {
      id: 1,
      name: "Thiago Bruno",
      email: "thiago@sensi.com",
      admin: true,
      avatar: "https://api.multiavatar.com/thiago.svg",
    },
    {
      id: 2,
      name: "Stefan",
      email: "stefan@sensi.com",
      avatar: "https://api.multiavatar.com/stefan.svg",
    },
    {
      id: 3,
      name: "José Carlos",
      email: "jose@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
    {
      id: 4,
      name: "Pedro Souza",
      email: "pedro@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
  ];

  const currentUserBackend = usersBackend.find(
    (user) => user.id === Number(currentId)
  );

  const { users, stream, currentUser, started, client, renderUsersVideo } =
    useStream(callId!, currentUserBackend);
  const { toggleAudio, usersWithAudio, toggleVideo, videoOn } = useVideoActions(
    stream,
    client
  );

  const isAdmin = currentUserBackend?.admin === true;

  return (
    <Box w="100vw" h="100vh">
      <Box display={started ? "none" : "block"}>
        <Center py="200px">
          <Spinner />
        </Center>
      </Box>

      <HStack
        display={!started ? "none" : "flex"}
        flex={1}
        h="100vh"
        w="full"
        bg="#dfdfdf"
        p="10px"
        spacing={0}
      >
        <VideoBox
          users={users}
          currentUser={currentUser!}
          stream={stream!}
          isAdmin={isAdmin}
          client={client}
        />

        <Stack
          flex="0.3"
          bg="#F2F2F2"
          h="full"
          borderRadius="0 20px 20px 0"
          shadow="0px 15px 30px 0px rgba(0, 0, 0, 0.1)"
          p="30px"
        >
          <HStack spacing={0} pb="20px">
            <Box
              onClick={() => setTab("people")}
              flex={1}
              p="6px 20px"
              fontSize="16px"
              fontWeight="bold"
              textAlign="center"
              bg={tab === "people" ? "#DCAC36" : "#ddd"}
              cursor="pointer"
              userSelect="none"
            >
              PESSOAS
            </Box>

            <Box
              cursor="pointer"
              userSelect="none"
              onClick={() => setTab("chat")}
              p="6px 20px"
              fontSize="16px"
              fontWeight="bold"
              flex={1}
              bg={tab === "chat" ? "#DCAC36" : "#ddd"}
              textAlign="center"
            >
              CHAT
            </Box>
          </HStack>
          {tab === "chat" && <ChatBox client={client} isAdmin={isAdmin} />}

          {tab === "people" && (
            <Box h="full">
              {isAdmin && (
                <Box position="relative">
                  <Text fontWeight="bold" fontSize="12px" pb="20px">
                    Lista de espera para falar
                  </Text>

                  {requestedMicrophones.length === 0 && (
                    <Center pb="50px" opacity={0.5}>
                      <Text>Nenhúm participante na lista de espera</Text>
                    </Center>
                  )}

                  {requestedMicrophones.map((user, index) => (
                    <UserCardRequest
                      index={index}
                      toggleAudio={(p) => {
                        toggleAudio(p);
                        removeRequestedMicrophone(user);
                      }}
                      user={user}
                      key={String(user.userId)}
                    />
                  ))}

                  <Divider />
                </Box>
              )}

              <Text fontWeight="bold" fontSize="12px" pb="20px">
                Nesta reunião
              </Text>

              {users.length === 0 && (
                <Center pb="50px" opacity={0.5}>
                  <Text>Nenhúm participante</Text>
                </Center>
              )}

              {users?.map((user) => (
                <UserCard
                  currentUser={currentUser!}
                  isAdmin={isAdmin}
                  isMuted={!usersWithAudio.find((u) => u === user.userId)}
                  toggleAudio={toggleAudio}
                  user={user}
                  key={String(user.userId)}
                />
              ))}
            </Box>
          )}

          {!isAdmin && (
            <Stack>
              <Button
                w="full"
                color="black"
                fontSize="12px"
                p="0px 20px"
                h="40px"
                bg="white"
                shadow="lg"
                borderRadius="60px"
                onClick={() => requestMicrophone(currentUser!)}
                leftIcon={<BiMicrophone size={22} />}
              >
                Solicitar para falar
              </Button>

              <Button
                w="full"
                color="black"
                fontSize="12px"
                p="0px 20px"
                h="40px"
                bg="white"
                shadow="lg"
                borderRadius="60px"
                onClick={async () => {
                  await toggleVideo(currentUser!);
                  renderUsersVideo();
                }}
                leftIcon={
                  !videoOn ? (
                    <BsCameraVideo size={22} />
                  ) : (
                    <BsCameraVideoOff size={22} />
                  )
                }
              >
                {videoOn ? "Desligar a câmera" : "Ligar a câmera"}
              </Button>
            </Stack>
          )}
        </Stack>
      </HStack>
    </Box>
  );
}
