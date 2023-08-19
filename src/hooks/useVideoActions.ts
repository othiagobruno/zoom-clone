import { useCallback, useState } from "react";
import { Stream } from "@zoom/videosdk";

export const useVideoActions = (stream?: typeof Stream) => {
  const [videoOn, setVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [usersWithAudio, setUsersWithAudio] = useState<number[]>([]);

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
          if (userId) {
            setUsersWithAudio([...usersWithAudio, userId]);
          } else {
            setIsMuted(false);
          }

          await stream?.unmuteAudio(userId);
        } else {
          if (userId) {
            const newUsersWithAudio = usersWithAudio.filter(
              (user) => user !== userId
            );
            setUsersWithAudio(newUsersWithAudio);
          } else {
            setIsMuted(true);
          }

          await stream?.muteAudio(userId);
        }
      } catch (error) {
        console.log("audio ", error);
      }
    },
    [stream, isMuted, usersWithAudio]
  );

  return { videoOn, toggleVideo, toggleAudio, isMuted, usersWithAudio };
};
