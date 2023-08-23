import { Box } from "@chakra-ui/react";
import ZoomContext from "./context/zoom.context";
import ZoomVideo from "@zoom/videosdk";
import { Zoom } from "./video";

function App() {
  const client = ZoomVideo.createClient();

  return (
    <Box>
      <ZoomContext.Provider value={client}>
        <Zoom />
      </ZoomContext.Provider>
    </Box>
  );
}

export default App;
