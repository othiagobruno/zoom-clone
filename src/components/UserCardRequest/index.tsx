import { Box, Button, HStack, Image, Text } from "@chakra-ui/react";
import { Participant } from "@zoom/videosdk";
import React from "react";

interface Props {
  user: Participant;
  toggleAudio: (userId: number) => void;
  index: number;
}

const UserCardRequest: React.FC<Props> = ({ toggleAudio, user, index }) => {
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
        <Text fontSize="12px" fontWeight="bold" color="rgba(223, 145, 38, 1)">
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
        onClick={() => {
          toggleAudio(user.userId);
        }}
      >
        Autorizar
      </Button>
    </HStack>
  );
};

export default UserCardRequest;
