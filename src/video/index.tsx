import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useVideoActions } from "../hooks/useVideoActions";
import { useStream } from "../hooks/useStream";
import { BiMicrophone } from "react-icons/bi";
import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsPersonPlus,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useWebsocket } from "../hooks/useWebsocket";
import UserCardRequest from "../components/UserCardRequest";
import UserCard from "../components/UserCard";

function Zoom() {
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
  ];

  const currentUserBackend = usersBackend.find(
    (user) => user.id === Number(currentId)
  );

  const { users, stream, currentUser } = useStream(callId!, currentUserBackend);
  const { toggleVideo, videoOn, isMuted, toggleAudio, usersWithAudio } =
    useVideoActions(stream);

  const isAdmin = currentUserBackend?.admin === true;

  return (
    <HStack flex={1} h="100vh" w="full" bg="#dfdfdf" p="40px" spacing={0}>
      <Box
        flex="1"
        bg="#EEEEEE"
        borderRadius="20px 0 0 20px"
        p="30px"
        pb="0"
        h="full"
        shadow="0px 15px 30px 0px rgba(0, 0, 0, 0.1)"
      >
        <Box>
          <HStack pb="10px" justify="space-between">
            <HStack>
              <Text color="#222222" fontSize="30px" fontWeight="bold">
                Assembleia Virtual
              </Text>

              <HStack p="4px 10px" bg="#DEDEDE" borderRadius="30px">
                <Box w="10px" h="10px" borderRadius="30px" bg="#7AAF5B" />
                <Text fontSize="12px" color="#848484">
                  ESTAMOS AO VIVO
                </Text>
              </HStack>
            </HStack>

            <Button variant="unstyled">
              <HStack>
                <FiLogOut color="#888888" />
                <Text color="#06152B">Sair da conferencia</Text>
              </HStack>
            </Button>
          </HStack>

          {isAdmin && (
            <Box
              flex={1}
              w="full"
              h="450px"
              objectFit="cover"
              as="video"
              id="principal-video"
              border="10px solid white"
              borderRadius="20px"
              bg="black"
            />
          )}

          {!isAdmin && (
            <Box
              flex={1}
              w="full"
              h="540px"
              objectFit="cover"
              as="canvas"
              id="principal-video-canvas"
              border="10px solid white"
              borderRadius="20px"
              bg="black"
            />
          )}
        </Box>

        {isAdmin && (
          <Center py="20px">
            <HStack w="full" justify="center" spacing="20px">
              <Button bg="white" borderRadius="50px" w="60px" h="60px">
                <BsPersonPlus size={22} />
              </Button>

              <Button
                bg="white"
                borderRadius="50px"
                w="60px"
                h="60px"
                onClick={() => toggleAudio()}
              >
                {!isMuted ? <BsMic size={22} /> : <BsMicMute size={22} />}
              </Button>

              <Button
                bg={!videoOn ? "white" : "#DCAC36"}
                borderRadius="60px"
                w="60px"
                h="60px"
                onClick={toggleVideo}
              >
                {videoOn ? (
                  <BsCameraVideo size={22} color="white" />
                ) : (
                  <BsCameraVideoOff size={22} />
                )}
              </Button>
            </HStack>
          </Center>
        )}
      </Box>

      <Stack
        flex="0.4"
        bg="#F2F2F2"
        h="full"
        borderRadius="0 20px 20px 0"
        shadow="0px 15px 30px 0px rgba(0, 0, 0, 0.1)"
        p="30px"
      >
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
              isMuted={
                usersWithAudio.findIndex((u) => u === user.userId) === -1
              }
              toggleAudio={toggleAudio}
              user={user}
              key={String(user.userId)}
            />
          ))}
        </Box>

        {!isAdmin && (
          <Box>
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
          </Box>
        )}
      </Stack>
    </HStack>
  );
}

export default Zoom;
