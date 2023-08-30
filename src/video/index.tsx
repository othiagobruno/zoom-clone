/* eslint-disable react-hooks/exhaustive-deps */
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
import { BiMicrophone } from "react-icons/bi";
import { useWebsocket } from "../hooks/useWebsocket";
import UserCardRequest from "../components/UserCardRequest";
import UserCard from "../components/UserCard";
import VideoBox from "../components/VideoBox";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsGrid,
  BsGrid1X2,
} from "react-icons/bs";
import { useState } from "react";
import ChatBox from "../components/ChatBox";
import { useStream } from "../context/stream.context";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { useVideoActions } from "../context/video-actions.context";

export function Zoom() {
  const [tab, setTab] = useState("people");

  const {
    users,
    currentUser,
    started,
    client,
    renderUsersVideo,
    callId,
    currentUserBackend,
  } = useStream();

  const { requestMicrophone, requestedMicrophones, removeRequestedMicrophone } =
    useWebsocket(callId ?? "");

  const {
    toggleAudio,
    usersWithAudio,
    toggleVideo,
    videoOn,
    toggleShare,
    isSharing,
    isMuted,
    requestedMicrophone,
    setIsGrid,
    isGrid,
  } = useVideoActions();

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
        align="start"
      >
        <VideoBox users={users} currentUser={currentUser!} isAdmin={isAdmin} />

        <Box
          display="flex"
          flexDirection="column"
          flex="0.5"
          bg="#F2F2F2"
          h="full"
          borderRadius="0 20px 20px 0"
          shadow="0px 15px 30px 0px rgba(0, 0, 0, 0.1)"
        >
          <HStack spacing={0}>
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

          {tab === "chat" && <ChatBox client={client!} isAdmin={isAdmin} />}

          {tab === "people" && (
            <Box overflow="auto" h="full" p="30px">
              {isAdmin && (
                <Box position="relative">
                  <Text fontWeight="bold" fontSize="12px" pb="20px">
                    Lista de espera para falar
                  </Text>

                  {requestedMicrophones.length === 0 && (
                    <Center pb="20px" opacity={0.5}>
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

                  <Divider mb="10px" />
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

              <Box flex={1}>
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
            </Box>
          )}

          {!isAdmin && (
            <Stack p="20px">
              <Button
                bg="white"
                borderRadius="60px"
                fontSize="12px"
                p="0px 20px"
                h="40px"
                shadow="lg"
                leftIcon={
                  isGrid ? <BsGrid1X2 size={20} /> : <BsGrid size={22} />
                }
                onClick={() => setIsGrid((m) => !m)}
              >
                Mudar Visualização
              </Button>

              {!isMuted && (
                <Button
                  w="full"
                  color={requestedMicrophone ? "white" : "black"}
                  fontSize="12px"
                  p="0px 20px"
                  h="40px"
                  bg={requestedMicrophone ? "black" : "white"}
                  shadow="lg"
                  borderRadius="60px"
                  onClick={() => {
                    toggleShare();
                  }}
                  leftIcon={
                    isSharing ? (
                      <LuScreenShareOff size={22} color="white" />
                    ) : (
                      <LuScreenShare size={22} />
                    )
                  }
                >
                  {isSharing ? "Parar de compartilhar" : "Compartilhar tela"}
                </Button>
              )}

              <Button
                w="full"
                color={requestedMicrophone ? "white" : "black"}
                fontSize="12px"
                p="0px 20px"
                h="40px"
                bg={requestedMicrophone ? "black" : "white"}
                shadow="lg"
                borderRadius="60px"
                onClick={() => {
                  if (!isMuted) {
                    toggleAudio();
                  } else {
                    requestMicrophone(currentUser!);
                  }
                }}
                leftIcon={<BiMicrophone size={22} />}
              >
                {!isMuted
                  ? "Desativar áudio"
                  : requestedMicrophone
                  ? "Solicitando o microfone..."
                  : "Solicitar para falar"}
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
        </Box>
      </HStack>
    </Box>
  );
}
