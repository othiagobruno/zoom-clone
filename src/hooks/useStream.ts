/* eslint-disable react-hooks/exhaustive-deps */
import ZoomVideo, { Participant, Stream } from "@zoom/videosdk";
import { generateSignature } from "../utils/singature";
import { useContext, useEffect, useState } from "react";
import zoomContext from "../context/zoom.context";
import { useVideoActions } from "./useVideoActions";
const sdkKey = "X1k75GMu0ULCaz26yBa5iRev43eRHisvHPVE";
const sdkSecret = "KspZ4bLhzgO0ECEXzTYjtGFOQkvX0iGXyOtp";

type CurrentUserBackend = {
  id: number;
  name: string;
  email: string;
  admin?: boolean;
  avatar: string;
};

export const useStream = (
  callId?: string,
  currentUserBackend?: CurrentUserBackend
) => {
  const client = useContext(zoomContext);
  client.init("en-US", "CDN");

  const [currentUser, setCurrentUser] = useState<Participant>();
  const [stream, setStream] = useState<typeof Stream>(); // eslint-disable-line
  const [users, setUsers] = useState<Participant[]>([]);
  const { toggleAudio } = useVideoActions(stream);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    startVideo().catch((e) => console.log(e));
    loadUsersInfo().catch((e) => console.log(e));

    return () => {
      ZoomVideo.destroyClient();
    };
  }, []);

  useEffect(() => {
    if (!!stream) {
      client.on("passively-stop-share", (payload) => {
        stream.stopShareScreen().catch((e) => console.log(e));
      });

      client.on("host-ask-unmute-audio", (payload) => {
        toggleAudio().catch((e) => console.log(e));
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
        setStream(stream);

        try {
          loadUsersInfo();
        } catch (error) {}

        if (currentUserBackend.admin) {
          try {
            await stream.startVideo({
              videoElement: document.querySelector("#principal-video") as any,
              hd: true,
            });
            await stream.renderVideo(
              document.querySelector("#principal-video-canvas")!,
              client.getCurrentUserInfo().userId,
              1920,
              1080,
              0,
              0,
              3
            );
          } catch (e) {
            //
          }
        } else {
          try {
            await stream.startVideo({
              videoElement: document.querySelector(`#user-video`) as any,
              hd: true,
            });
            await stream.renderVideo(
              document.querySelector(
                `#p-user-video-${client.getCurrentUserInfo().userId}`
              )!,
              client.getCurrentUserInfo().userId,
              1920,
              1080,
              0,
              0,
              3
            );
            await renderUsersVideo();
            await renderUsersVideo();
          } catch (error) {}
        }

        setStarted(true);

        try {
          await stream.startAudio({ mute: true });
        } catch (error) {
          console.log("erro ao iniciar audio: ", error);
        }
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
      renderUsersVideo();
    } catch (error) {
      console.log("erro ao carregar usuarios: ", error);
    }
  };

  const stopRenderUsersVideo = async (userId: number) => {
    try {
      const allUsers = client.getAllUser();
      const findUser = allUsers.find((user) => user.userId === userId);

      if (findUser?.isHost) {
        await stream
          ?.stopRenderVideo(
            document.querySelector("#principal-video-canvas")!,
            userId
          )
          .catch((e) => console.log(e));
      } else {
        await stream
          ?.stopRenderVideo(
            document.querySelector(`#p-user-video-${userId}`)!,
            userId
          )
          .catch((e) => console.log(e));
      }
    } catch (error) {
      console.log("erro ao parar de renderizar video do gerente: ", error);
    }
  };

  const renderUsersVideo = async () => {
    try {
      const allUsers = client.getAllUser();
      for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];

        if (user.isHost) {
          await stream
            ?.renderVideo(
              document.querySelector("#principal-video-canvas")!,
              user.userId,
              920,
              920,
              0,
              0,
              3
            )
            .catch((e) => console.log(e));
        } else {
          await stream
            ?.renderVideo(
              document.querySelector(`#p-user-video-${user.userId}`)!,
              user.userId,
              560,
              540,
              0,
              0,
              2
            )
            .catch((e) => console.log(e));
        }
      }
    } catch (error) {
      console.log("erro ao renderizar video do gerente: ", error);
    }
  };

  return {
    startVideo,
    users,
    started,
    stream,
    client,
    currentUser,
    renderUsersVideo,
  };
};
