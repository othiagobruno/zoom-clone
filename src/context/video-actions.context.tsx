/* eslint-disable react-hooks/exhaustive-deps */
import { Participant } from "@zoom/videosdk";
import React, { createContext, useEffect, useState } from "react";
import { useStream } from "./stream.context";

interface IVideoActionsContext {
  videoOn: boolean;
  toggleShare: () => void;
  toggleVideo: (user?: Participant) => void;
  toggleAudio: (userId?: number) => void;
  isMuted: boolean;
  isSharing: boolean;
  usersWithAudio: number[];
  requestedMicrophone: boolean;
  ableToShare: boolean;
  setRequestedMicrophone: React.Dispatch<React.SetStateAction<boolean>>;
  isUserShare: boolean;
  isGrid: boolean;
  setIsGrid: React.Dispatch<React.SetStateAction<boolean>>;
  requestedMicrophones: Participant[];
  setRequestMicrophones: React.Dispatch<React.SetStateAction<Participant[]>>;
  removeRequestedMicrophone: (participant: Participant) => void;
}

const VideoActionsContext = createContext<IVideoActionsContext>(
  {} as IVideoActionsContext
);

interface Props {
  children: React.ReactNode;
}

export const VideoActionProvider: React.FC<Props> = ({ children }) => {
  const { client, stream } = useStream();

  const [isGrid, setIsGrid] = useState(false);
  const [usersWithAudio, setUsersWithAudio] = useState<number[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isUserShare, setIsUserSharing] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [requestedMicrophone, setRequestedMicrophone] = useState(false);
  const [ableToShare, setAbleToShare] = useState(false);
  const [requestedMicrophones, setRequestMicrophones] = useState<Participant[]>(
    []
  );

  useEffect(() => {
    client?.on("current-audio-change", async (payload) => {
      console.log("current-audio-change", { payload });

      if (payload.action === "unmuted") {
        setIsMuted(false);
      } else {
        setIsMuted(true);
      }
    });

    client?.on("host-ask-unmute-audio", async (payload) => {
      console.log("host-ask-unmute-audio", { payload });
      await toggleAudio();
      setRequestedMicrophone(false);
      setAbleToShare(true);
    });
  }, [client, stream]);

  useEffect(() => {
    client?.on("user-updated", (payload) => {
      console.log("user-updated", { payload });
      for (let user of payload) {
        if (user.muted === false) {
          setUsersWithAudio((old) => [...old, user.userId]);
        } else if (user.muted === true) {
          setUsersWithAudio((old) => old.filter((id) => id !== user.userId));
        }
      }
    });

    client?.on("active-share-change", (payload) => {
      if (payload.state === "Active") {
        setIsUserSharing(true);
        stream?.startShareView(
          document.querySelector("#my-screen-share-content-canvas")!,
          payload.userId
        );
      } else if (payload.state === "Inactive") {
        setIsUserSharing(false);
        stream?.stopShareView();
      }
    });
  }, [client, stream]);

  const toggleShare = async () => {
    try {
      if (!isSharing) {
        setIsSharing(true);
        if (stream?.isStartShareScreenWithVideoElement()) {
          await stream.startShareScreen(
            document.querySelector("#share-video")!
          );
        } else {
          await stream?.startShareScreen(
            document.querySelector("#share-canvas")!
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
          videoElement: document.querySelector(`#user-video`) as any,
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

  const removeRequestedMicrophone = (participant: Participant) => {
    const updatedRequestedMicrophones = requestedMicrophones.filter(
      (p) => p.userId !== participant.userId
    );
    setRequestMicrophones(updatedRequestedMicrophones);
  };

  return (
    <VideoActionsContext.Provider
      value={{
        videoOn,
        toggleShare,
        toggleVideo,
        toggleAudio,
        isMuted,
        isSharing,
        usersWithAudio,
        requestedMicrophone,
        ableToShare,
        setRequestedMicrophone,
        isUserShare,
        isGrid,
        setIsGrid,
        requestedMicrophones,
        setRequestMicrophones,
        removeRequestedMicrophone,
      }}
    >
      {children}
    </VideoActionsContext.Provider>
  );
};

export const useVideoActions = () => {
  const context = React.useContext(VideoActionsContext);

  if (context === undefined) {
    throw new Error(
      "useVideoActions must be used within a VideoActionsProvider"
    );
  }

  return context;
};
