import { Box } from "@chakra-ui/react";
import Zoom from "./video";
import ZoomContext from "./context/zoom.context";
import ZoomVideo from "@zoom/videosdk";

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
