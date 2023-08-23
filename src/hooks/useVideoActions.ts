import { useEffect, useState } from "react";
import { Stream, VideoClient } from "@zoom/videosdk";

export const useVideoActions = (
  stream?: typeof Stream,
  client?: typeof VideoClient
) => {
  const [usersWithAudio, setUsersWithAudio] = useState<number[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isShareWithVideo, setIsShareWithVideo] = useState(
    stream?.isStartShareScreenWithVideoElement()
  );
  const [videoOn, setVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    client?.on("active-share-change", (payload) => {
      console.log(payload);
      if (payload.state === "Active") {
        setIsShareWithVideo(false);
        stream?.startShareView(
          document.querySelector("#my-screen-share-content-canvas")!,
          payload.userId
        );
        setIsSharing(true);
      } else if (payload.state === "Inactive") {
        setIsSharing(false);
      }
    });
  }, [client, stream]);

  const toggleShare = async () => {
    try {
      if (!isSharing) {
        setIsSharing(true);
        if (stream?.isStartShareScreenWithVideoElement()) {
          await stream.startShareScreen(
            document.querySelector("#my-screen-share-content-video")!
          );
        } else {
          await stream?.startShareScreen(
            document.querySelector("#my-screen-share-content-canvas")!
          );
        }
      } else {
        setIsSharing(false);
        await stream?.stopShareScreen();
      }
    } catch (error) {
      console.log("Erro ao compratilhar tela", error);
    }
  };

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

  const toggleAudio = async (userId?: number) => {
    try {
      if (isMuted) {
        await stream?.unmuteAudio(userId);
        setIsMuted(false);
        if (userId) {
          setUsersWithAudio((old) => [...old, userId]);
        }
      } else {
        await stream?.muteAudio(userId);
        setIsMuted(true);
        setUsersWithAudio((old) => old.filter((id) => id !== userId));
      }
    } catch (error) {
      console.log("audio ", error);
    }
  };

  return {
    videoOn,
    toggleShare,
    toggleVideo,
    toggleAudio,
    isMuted,
    isSharing,
    usersWithAudio,
    isShareWithVideo,
  };
};
