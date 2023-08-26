import React from "react";
import { Box, Button, Center, HStack, Stack, Text } from "@chakra-ui/react";

import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { useVideoActions } from "../../hooks/useVideoActions";
import { Participant, Stream, VideoClient } from "@zoom/videosdk";

interface VideoBoxProps {
  isAdmin: boolean;
  stream: typeof Stream;
  client: typeof VideoClient;
  users: Participant[];
  currentUser: Participant;
}

const VideoBox: React.FC<VideoBoxProps> = ({
  isAdmin,
  stream,
  client,
  users,
  currentUser,
}) => {
  const {
    toggleVideo,
    videoOn,
    isMuted,
    toggleAudio,
    toggleShare,
    isSharing,
    isShareWithVideo,
  } = useVideoActions(stream, client);

  return (
    <Box
      flex="1"
      bg="#EEEEEE"
      borderRadius="20px 0 0 20px"
      p="30px"
      h="full"
      shadow="0px 15px 30px 0px rgba(0, 0, 0, 0.1)"
    >
      <Box h="full" display="flex" flexDirection="column">
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

        <HStack alignItems="start" flex={1}>
          <Box flex={1} h="full">
            {isShareWithVideo && (
              <Box
                flex={1}
                h="full"
                as="video"
                id="my-screen-share-content-video"
                objectFit="cover"
                border="5px solid white"
                borderRadius="20px"
                bg="black"
                display={isSharing ? "block" : "none"}
              />
            )}

            {!isShareWithVideo && (
              <Box
                flex={1}
                h="full"
                as="canvas"
                id="my-screen-share-content-canvas"
                objectFit="cover"
                border="5px solid white"
                borderRadius="20px"
                bg="black"
                display={isSharing ? "block" : "none"}
              />
            )}

            {isAdmin && !isSharing && (
              <Box
                flex={1}
                h="full"
                id="principal-video"
                objectFit="cover"
                as="video"
                border="5px solid white"
                borderRadius="20px"
                bg="black"
              />
            )}

            {!isAdmin && !isSharing && (
              <Box
                flex={1}
                h="full"
                w="full"
                objectFit="cover"
                as="canvas"
                id="principal-video-canvas"
                border="5px solid white"
                borderRadius="20px"
                bg="black"
              />
            )}
          </Box>

          <Stack h="70vh" overflow="auto">
            {users
              ?.filter((a) => !a.isHost)
              .map((user) => {
                const isVideo = currentUser.userId === user.userId;

                return (
                  <Box
                    key={String(user.userId)}
                    bg="white"
                    borderRadius="14px"
                    p="6px"
                  >
                    <Text opacity={0.8} pb="5px" px="10px" fontSize="12px">
                      {user?.displayName} {isVideo ? "(Você)" : ""}
                    </Text>
                    {isVideo ? (
                      <Box
                        as="video"
                        id="user-video"
                        w="280px"
                        height="200px"
                        objectFit="cover"
                        borderRadius="12px"
                        bg="black"
                      />
                    ) : (
                      <Box
                        as="canvas"
                        id={`p-user-video-${user.userId}`}
                        w="280px"
                        height="200px"
                        objectFit="cover"
                        borderRadius="12px"
                        bg="black"
                      />
                    )}
                  </Box>
                );
              })}
          </Stack>
        </HStack>

        {isAdmin && (
          <Center pt="20px">
            <HStack w="full" justify="center" spacing="20px">
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
                onClick={() => toggleVideo(currentUser!)}
              >
                {videoOn ? (
                  <BsCameraVideo size={22} color="white" />
                ) : (
                  <BsCameraVideoOff size={22} />
                )}
              </Button>

              <Button
                bg={!isSharing ? "white" : "#DCAC36"}
                borderRadius="60px"
                w="60px"
                h="60px"
                onClick={toggleShare}
              >
                {isSharing ? (
                  <LuScreenShareOff size={22} color="white" />
                ) : (
                  <LuScreenShare size={22} />
                )}
              </Button>
            </HStack>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default VideoBox;
