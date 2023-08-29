import React from "react";
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsGrid1X2,
  BsGrid,
  BsRecordCircleFill,
  BsRecordCircle,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import _ from "lodash";
import { Participant } from "@zoom/videosdk";
import { useVideoActions } from "../../context/video-actions.context";
import { useRecord } from "../../hooks/useRecord";

interface VideoBoxProps {
  isAdmin: boolean;
  users: Participant[];
  currentUser: Participant;
}

const VideoBox: React.FC<VideoBoxProps> = ({ isAdmin, users, currentUser }) => {
  const {
    toggleVideo,
    videoOn,
    isMuted,
    toggleAudio,
    toggleShare,
    isSharing,
    isGrid,
    setIsGrid,
  } = useVideoActions();

  const { startRecording, startedRecording, stopRecording } = useRecord();

  return (
    <Box
      flex="1"
      bg="#EEEEEE"
      borderRadius="20px 0 0 20px"
      p="15px 30px"
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

        <HStack flex={1} borderRadius="10px">
          <Grid
            gap={2}
            templateColumns={isGrid ? "repeat(3, 1fr)" : "repeat(4, 1fr)"}
            templateRows={isGrid ? "repeat(3, auto)" : "repeat(2, auto)"}
          >
            {_.orderBy(users, ["muted", "isHost"], ["asc", "desc"]).map(
              (user, index) => {
                const isVideo = currentUser.userId === user.userId;

                return (
                  <GridItem
                    colSpan={!isGrid && index === 0 ? 3 : 1}
                    rowSpan={!isGrid && index === 0 ? 3 : 1}
                    key={String(user.userId)}
                    bg="white"
                    p="6px"
                    shadow="md"
                    borderRadius="4px"
                  >
                    <Stack flex={1} h="full" position="relative">
                      <Text
                        bg="rgba(0,0,0,0.3)"
                        px="10px"
                        fontSize="12px"
                        position="absolute"
                        borderRadius="10px"
                        color="white"
                        top="5px"
                        left="5px"
                      >
                        {index + 1} - {user?.displayName}{" "}
                        {isVideo ? "(Você)" : ""}
                      </Text>

                      {isVideo ? (
                        <Box
                          as="video"
                          id="user-video"
                          objectFit="cover"
                          bg="white"
                          flex={1}
                          h="full"
                          w="full"
                          borderRadius="4px"
                        />
                      ) : (
                        <Box
                          as="canvas"
                          id={`user-canvas-${user.userId}`}
                          objectFit="cover"
                          bg="white"
                          w="full"
                          h="full"
                          borderRadius="4px"
                        />
                      )}
                    </Stack>
                  </GridItem>
                );
              }
            )}
          </Grid>
        </HStack>

        {isAdmin && (
          <Center pt="20px">
            <HStack w="full" justify="center" spacing="20px">
              <Button
                bg="white"
                borderRadius="50px"
                h="60px"
                onClick={() => toggleAudio()}
                leftIcon={
                  !isMuted ? <BsMic size={22} /> : <BsMicMute size={22} />
                }
              >
                {!isMuted ? "Desligar microfone" : "Ligar microfone"}
              </Button>

              <Button
                bg={!videoOn ? "white" : "#DCAC36"}
                borderRadius="60px"
                h="60px"
                onClick={() => toggleVideo(currentUser!)}
                color={!videoOn ? "black" : "white"}
                leftIcon={
                  videoOn ? (
                    <BsCameraVideo size={22} color="white" />
                  ) : (
                    <BsCameraVideoOff size={22} />
                  )
                }
              >
                {videoOn ? "Desligar câmera" : "Ligar câmera"}
              </Button>

              <Button
                bg={!isSharing ? "white" : "#DCAC36"}
                borderRadius="60px"
                h="60px"
                onClick={toggleShare}
                leftIcon={
                  isSharing ? (
                    <LuScreenShareOff size={22} color="white" />
                  ) : (
                    <LuScreenShare size={22} />
                  )
                }
              >
                Compartilhar tela
              </Button>

              <Button
                bg="white"
                borderRadius="60px"
                h="60px"
                onClick={() => {
                  if (startedRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                leftIcon={
                  startedRecording ? (
                    <BsRecordCircleFill size={20} />
                  ) : (
                    <BsRecordCircle size={22} />
                  )
                }
              >
                {startedRecording ? "Parar gravação" : "Gravar"}
              </Button>

              <Button
                bg="white"
                borderRadius="60px"
                w="60px"
                h="60px"
                onClick={() => setIsGrid((m) => !m)}
              >
                {isGrid ? <BsGrid1X2 size={20} /> : <BsGrid size={22} />}
              </Button>
            </HStack>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default VideoBox;
