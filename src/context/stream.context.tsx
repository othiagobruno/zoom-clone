/* eslint-disable react-hooks/exhaustive-deps */
import ZoomVideo, { Participant, Stream, VideoClient } from "@zoom/videosdk";
import React, { createContext, useContext, useEffect, useState } from "react";
import zoomContext from "./zoom.context";
import { generateSignature } from "../utils/singature";
const sdkKey = "X1k75GMu0ULCaz26yBa5iRev43eRHisvHPVE";
const sdkSecret = "KspZ4bLhzgO0ECEXzTYjtGFOQkvX0iGXyOtp";

interface IStremContext {
  startVideo: () => void;
  users: Participant[];
  started: boolean;
  stream: typeof Stream | undefined;
  client: typeof VideoClient | undefined;
  currentUser: Participant | undefined;
  renderUsersVideo: () => void;
  callId?: string;
  currentUserBackend?: CurrentUserBackend;
}

const StreamContext = createContext<IStremContext>({} as IStremContext);

type CurrentUserBackend = {
  id: number;
  name: string;
  email: string;
  admin?: boolean;
  avatar: string;
};

interface Props {
  callId?: string;
  currentUserBackend?: CurrentUserBackend;
  children: React.ReactNode;
}

export const StreamProvider: React.FC<Props> = ({
  children,
  callId,
  currentUserBackend,
}) => {
  const client = useContext(zoomContext);

  const [currentUser, setCurrentUser] = useState<Participant>();
  const [stream, setStream] = useState<typeof Stream>();
  const [users, setUsers] = useState<Participant[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    init();

    return () => {
      ZoomVideo.destroyClient();
    };
  }, []);

  const init = async () => {
    await client.init("en-US", "CDN");
    await startVideo();
  };

  useEffect(() => {
    if (users.length > 0) {
      renderUsersVideo().catch((e) => console.log(e));
    }
  }, [users]);

  useEffect(() => {
    if (!!stream) {
      client.on("passively-stop-share", (payload) => {
        stream.stopShareScreen().catch((e) => console.log(e));
      });

      client.on("peer-video-state-change", (payload) => {
        if (payload.action === "Start") {
          renderUsersVideo().catch((e) => console.log(e));
        } else if (payload.action === "Stop") {
          stopRenderUsersVideo(payload.userId).catch((e) => console.log(e));
        }
        loadUsersInfo().catch((e) => console.log(e));
      });
    }
  }, [stream, client]);

  const startVideo = async () => {
    if (!!currentUserBackend && !!callId) {
      try {
        try {
          const signature = generateSignature(
            sdkKey,
            sdkSecret,
            callId,
            currentUserBackend?.admin ? 1 : 0
          );
          await client.join(
            callId,
            signature,
            currentUserBackend.email,
            "8wfb1x"
          );
        } catch (error) {
          console.log("erro ao entrar na reunião ", error);
        }

        const stream = client.getMediaStream();
        try {
          await stream?.startAudio({ mute: true });
          stream?.muteAudio();
        } catch (error) {
          console.log("erro ao iniciar audio: ", error);
        }

        setStream(stream);
        setStarted(true);
        await loadUsersInfo();
      } catch (error) {
        console.log("erro start: ", error);
      }
    }
  };

  const loadUsersInfo = async () => {
    try {
      const cUser = client.getCurrentUserInfo();
      const uUsers = client.getAllUser();
      setUsers(uUsers);
      setCurrentUser(cUser);
    } catch (error) {
      console.log("erro ao carregar usuarios: ", error);
    }
  };

  const stopRenderUsersVideo = async (userId: number) => {
    try {
      await stream
        ?.stopRenderVideo(
          document.querySelector(`#user-canvas-${userId}`)!,
          userId
        )
        .catch((e) => console.log(e));
    } catch (error) {
      console.log("erro ao parar de renderizar video do gerente: ", error);
    }
  };

  const renderUsersVideo = async () => {
    try {
      await stream?.startVideo({
        videoElement: document.querySelector(`#user-video`) as any,
        hd: false,
      });
    } catch (error) {
      console.log("erro ao iniciar video: ", error);
    }

    try {
      const allUsers = client.getAllUser();
      for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        await stream
          ?.renderVideo(
            document.querySelector(`#user-canvas-${user.userId}`)!,
            user.userId,
            780,
            520,
            0,
            0,
            2
          )
          .catch((e) => console.log(e));
      }
      try {
        await stream?.startAudio({ mute: true });
      } catch (error) {
        console.log("erro ao iniciar audio: ", error);
      }
    } catch (error) {
      console.log("erro ao renderizar video do gerente: ", error);
    }
  };

  return (
    <StreamContext.Provider
      value={{
        startVideo,
        users,
        started,
        stream,
        client,
        currentUser,
        renderUsersVideo,
        callId,
        currentUserBackend,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = React.useContext<IStremContext>(StreamContext);
  if (context === undefined) {
    throw new Error("useStream must be used within a StreamProvider");
  }

  return context;
};
