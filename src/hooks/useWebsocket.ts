import { Participant } from "@zoom/videosdk";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3333");

export const useWebsocket = (callId?: string) => {
  const [requestedMicrophones, setRequestMicrophones] = useState<Participant[]>(
    []
  );

  const removeRequestedMicrophone = (participant: Participant) => {
    const updatedRequestedMicrophones = requestedMicrophones.filter(
      (p) => p.userId !== participant.userId
    );
    setRequestMicrophones(updatedRequestedMicrophones);
  };

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
    socket.emit("requestMicrophone", {
      id: callId,
      payload: participant,
    });
  };

  return { requestMicrophone, requestedMicrophones, removeRequestedMicrophone };
};
