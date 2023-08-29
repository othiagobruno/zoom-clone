import { Box, Stack, Text } from "@chakra-ui/react";
import ZoomContext from "./context/zoom.context";
import ZoomVideo from "@zoom/videosdk";
import { Zoom } from "./video";
import { StreamProvider } from "./context/stream.context";
import { VideoActionProvider } from "./context/video-actions.context";

function App() {
  const currentId = new URLSearchParams(window.location.search).get("id");
  const callId = new URLSearchParams(window.location.search).get("callId");
  const client = ZoomVideo.createClient();

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
    {
      id: 5,
      name: "Maria Ana",
      email: "ana@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
    {
      id: 6,
      name: "Maria José",
      email: "maria@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
    {
      id: 7,
      name: "Patricia",
      email: "patricia@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
    {
      id: 8,
      name: "Patricia",
      email: "patrici3a@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
    {
      id: 9,
      name: "Patricia",
      email: "patricia2@sensi.com",
      avatar: "https://api.multiavatar.com/jose.svg",
    },
  ];

  const currentUserBackend = usersBackend.find(
    (user) => user.id === Number(currentId)
  );

  if (!currentUserBackend) {
    return (
      <Stack h="100vh" w="100vw" bg="red" color="white" justifyContent="center">
        <Text fontSize="26px" fontWeight="bold" textAlign="center">
          Plataforma não disponível para este usuário :(
        </Text>
      </Stack>
    );
  }

  return (
    <Box>
      <ZoomContext.Provider value={client}>
        <StreamProvider
          callId={callId as string}
          currentUserBackend={currentUserBackend}
        >
          <VideoActionProvider>
            <Zoom />
          </VideoActionProvider>
        </StreamProvider>
      </ZoomContext.Provider>
    </Box>
  );
}

export default App;
