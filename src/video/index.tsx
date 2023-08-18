import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Image,
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
import { Participant } from "@zoom/videosdk";

function Zoom() {
  const currentId = new URLSearchParams(window.location.search).get("id");
  const callId = new URLSearchParams(window.location.search).get("callId");

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
  const { toggleVideo, videoOn, isMuted, toggleAudio } =
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

              <Center pb="50px" opacity={0.5}>
                <Text>Nenhúm participante na lista de espera</Text>
              </Center>

              {([] as Participant[]).map((user, index) => (
                <HStack
                  pb="10px"
                  key={String(user.userId)}
                  justify="space-between"
                  spacing="14px"
                >
                  <Image
                    src={`https://api.multiavatar.com/stefan${user?.displayName}.svg`}
                    w="45px"
                    h="45px"
                    borderRadius="50px"
                    bg="grey.300"
                  />

                  <Box flex={1}>
                    <Text
                      fontSize="12px"
                      fontWeight="bold"
                      color="rgba(223, 145, 38, 1)"
                    >
                      {index + 1}° lugar na fila
                    </Text>
                    <Text fontSize="14px">{user?.displayName}</Text>
                  </Box>

                  <Button
                    color="white"
                    fontSize="12px"
                    p="0px 20px"
                    h="34px"
                    bg={"#DCAC36"}
                    borderRadius="40px"
                    onClick={toggleVideo}
                  >
                    Autorizar
                  </Button>
                </HStack>
              ))}

              <Divider />
            </Box>
          )}

          <Text fontWeight="bold" fontSize="12px" pb="20px">
            Nesta reunião
          </Text>

          {users?.map((user, index) => (
            <HStack
              pb="10px"
              key={String(user.userId)}
              justify="space-between"
              spacing="14px"
            >
              <Image
                src={`https://api.multiavatar.com/stefan${user?.displayName}.svg`}
                w="45px"
                h="45px"
                borderRadius="50px"
                bg="grey.300"
              />

              <Box flex={1}>
                {user?.isHost && (
                  <Text
                    fontSize="12px"
                    fontWeight="bold"
                    color="rgba(223, 145, 38, 1)"
                  >
                    Organizador
                  </Text>
                )}
                <Text fontSize="14px">
                  {user.userId !== currentUser?.userId
                    ? user?.displayName
                    : "Você"}
                </Text>
              </Box>

              {isAdmin && user.userId !== currentUser?.userId && (
                <HStack justify="center" pt="10px">
                  <Button
                    bg="white"
                    borderRadius="50px"
                    w="40px"
                    h="40px"
                    p="0"
                    onClick={() => toggleAudio(user.userId)}
                  >
                    {!isMuted ? <BsMic size={18} /> : <BsMicMute size={18} />}
                  </Button>
                </HStack>
              )}
            </HStack>
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
              onClick={() => {}}
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
