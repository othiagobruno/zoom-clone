/* eslint-disable react-hooks/exhaustive-deps */
import { io } from "socket.io-client";
import { Participant } from "@zoom/videosdk";
import { useEffect } from "react";
import { useVideoActions } from "../context/video-actions.context";
const socket = io("http://localhost:3333");

export const useWebsocket = (callId?: string) => {
  const {
    setRequestedMicrophone,
    requestedMicrophones,
    setRequestMicrophones,
    removeRequestedMicrophone,
  } = useVideoActions();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });
    socket.on(`requestMicrophone:${callId}`, (participant: Participant) => {
      const alreadyRequested = requestedMicrophones.find(
        (p) => p.userId === participant.userId
      );
      if (!alreadyRequested) {
        setRequestMicrophones([...requestedMicrophones, participant]);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected ", !socket.connected);
    });
  }, [callId, requestedMicrophones]);

  const requestMicrophone = (participant: Participant) => {
    setRequestedMicrophone(true);
    socket.emit("requestMicrophone", {
      id: callId,
      payload: participant,
    });
  };

  return { requestMicrophone, requestedMicrophones, removeRequestedMicrophone };
};
