import { Box, Button, Center, HStack, Text } from "@chakra-ui/react";
import { useVideoActions } from "../hooks/useVideoActions";
import { useStream } from "../hooks/useStream";

import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
} from "react-icons/bs";

import { BiSlideshow } from "react-icons/bi";

function Zoom() {
  const { users, stream, currentUser } = useStream();
  const { toggleVideo, videoOn, isMuted, toggleAudio } =
    useVideoActions(stream);

  return (
    <Box flex={1} h="100vh" w="full" bg="black">
      <Box flex="1">
        <Box
          objectFit="cover"
          as="video"
          id="my-self-view-video"
          w="100vw !important"
          h="100vh !important"
        />

        <Box position="absolute" top="20px" right="20px">
          {users
            ?.filter((a) => a.userId !== currentUser?.userId)
            .map((user) => (
              <Box
                key={String(user.userId)}
                bg="black"
                mb="10px"
                borderRadius="10px"
                p="10px"
              >
                <Text pb="5px" color="white" fontWeight="bold">
                  {user?.displayName}
                </Text>
                <Box
                  as="canvas"
                  id={`p-user-video-${user.userId}`}
                  w="300px"
                  height="200px"
                  objectFit="cover"
                />

                <HStack w="full" justify="center" pt="10px">
                  <Button
                    bg="white"
                    borderRadius="50px"
                    w="40px"
                    h="40px"
                    p="0"
                    onClick={() => toggleAudio()}
                  >
                    {!isMuted ? <BsMic size={18} /> : <BsMicMute size={18} />}
                  </Button>

                  <Button
                    bg={!videoOn ? "white" : "#97d1ff"}
                    borderRadius="40px"
                    w="40px"
                    h="40px"
                    p="0"
                    onClick={toggleVideo}
                  >
                    {videoOn ? (
                      <BsCameraVideo size={18} />
                    ) : (
                      <BsCameraVideoOff size={18} />
                    )}
                  </Button>
                </HStack>
              </Box>
            ))}
        </Box>
      </Box>

      <Box position="absolute" bottom={0} left="20px" right="20px">
        <Center w="full" py="40px">
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
              bg={!videoOn ? "white" : "#97d1ff"}
              borderRadius="60px"
              w="60px"
              h="60px"
              onClick={toggleVideo}
            >
              {videoOn ? (
                <BsCameraVideo size={22} />
              ) : (
                <BsCameraVideoOff size={22} />
              )}
            </Button>

            <Button bg="white" borderRadius="50px" w="60px" h="60px">
              <BiSlideshow size={22} />
            </Button>
          </HStack>
        </Center>
      </Box>
    </Box>
  );
}

export default Zoom;
