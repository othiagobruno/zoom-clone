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
          videoElement: document.querySelector("#principal-video") as any,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAudio = useCallback(
    async (userId?: number) => {
      try {
        if (isMuted) {
          await stream?.unmuteAudio(userId);
          setIsMuted(false);
        } else {
          await stream?.muteAudio(userId);
          setIsMuted(true);
        }
      } catch (error) {
        console.log("audio ", error);
      }
    },
    [stream, isMuted]
  );

  return { videoOn, toggleVideo, toggleAudio, isMuted };
};
