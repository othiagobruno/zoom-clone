import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import { Participant } from "@zoom/videosdk";
import React from "react";
import { BsMic, BsMicMute } from "react-icons/bs";

interface Props {
  user: Participant;
  currentUser: Participant;
  isAdmin: boolean;
  isMuted: boolean;
  toggleAudio: (userId: number) => void;
}

const UserCard: React.FC<Props> = ({
  toggleAudio,
  currentUser,
  isAdmin,
  isMuted,
  user,
}) => {
  return (
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
          <Text fontSize="12px" fontWeight="bold" color="rgba(223, 145, 38, 1)">
            Organizador
          </Text>
        )}
        <Text fontSize="14px">
          {user.userId !== currentUser?.userId ? user?.displayName : "Você"}
        </Text>
      </Box>

      {isAdmin && user.userId !== currentUser?.userId && (
        <HStack justify="center" pt="10px">
          <Button
            bg={isMuted ? "white" : "rgba(223, 145, 38, 1)"}
            borderRadius="50px"
            w="40px"
            h="40px"
            p="0"
            onClick={() => toggleAudio(user.userId)}
          >
            {!isMuted ? (
              <BsMic color="white" size={18} />
            ) : (
              <BsMicMute size={18} />
            )}
          </Button>
        </HStack>
      )}
    </HStack>
  );
};

export default UserCard;
