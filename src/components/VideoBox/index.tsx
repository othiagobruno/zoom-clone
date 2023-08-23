import React from "react";
import { Box, Button, Center, HStack, Text } from "@chakra-ui/react";

import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsPersonPlus,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { useVideoActions } from "../../hooks/useVideoActions";
import { Stream, VideoClient } from "@zoom/videosdk";

interface VideoBoxProps {
  isAdmin: boolean;
  stream: typeof Stream;
  client: typeof VideoClient;
}

const VideoBox: React.FC<VideoBoxProps> = ({ isAdmin, stream, client }) => {
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

        {isShareWithVideo && (
          <Box
            as="video"
            id="my-screen-share-content-video"
            flex={1}
            w="full"
            h="450px"
            objectFit="cover"
            border="10px solid white"
            borderRadius="20px"
            bg="black"
            display={isSharing ? "block" : "none"}
          />
        )}

        {!isShareWithVideo && (
          <Box
            as="canvas"
            id="my-screen-share-content-canvas"
            flex={1}
            w="full"
            h="450px"
            objectFit="cover"
            border="10px solid white"
            borderRadius="20px"
            bg="black"
            display={isSharing ? "block" : "none"}
          />
        )}

        {isAdmin && !isSharing && (
          <Box
            id="principal-video"
            flex={1}
            w="full"
            h="450px"
            objectFit="cover"
            as="video"
            border="10px solid white"
            borderRadius="20px"
            bg="black"
          />
        )}

        {!isAdmin && !isSharing && (
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
  );
};

export default VideoBox;
