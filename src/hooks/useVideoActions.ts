import { useCallback, useState } from "react";
import { Stream } from "@zoom/videosdk";

export const useVideoActions = (stream?: typeof Stream) => {
  const [videoOn, setVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const toggleVideo = async () => {
    try {
      if (videoOn) {
        setVideoOn(false);
        await stream?.stopVideo();
      } else {
        setVideoOn(true);
        await stream?.startVideo({
          videoElement: document.querySelector("#my-self-view-video") as any,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAudio = useCallback(async () => {
    if (isMuted) {
      await stream?.unmuteAudio();
      setIsMuted(false);
    } else {
      await stream?.muteAudio();
      setIsMuted(true);
    }
  }, [stream, isMuted]);

  return { videoOn, toggleVideo, toggleAudio, isMuted };
};
