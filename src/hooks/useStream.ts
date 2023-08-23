/* eslint-disable react-hooks/exhaustive-deps */
import ZoomVideo, { Participant, Stream } from "@zoom/videosdk";
import { generateSignature } from "../utils/singature";
import { useCallback, useContext, useEffect, useState } from "react";
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
    startVideo();
    loadUsersInfo();

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

      client.on("peer-video-state-change", async (payload) => {
        if (payload.action === "Start") {
          showManagerVideo();
        } else if (payload.action === "Stop") {
          stream
            ?.stopRenderVideo(
              document.querySelector("#principal-video-canvas")!,
              payload.userId
            )
            .catch((e) => console.log(e));
        }

        loadUsersInfo().catch((e) => console.log(e));
      });
    }
  }, [stream, client]);

  const startVideo = useCallback(async () => {
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
        loadUsersInfo();

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
          await showManagerVideo();
          await showManagerVideo();
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
  }, [client, currentUserBackend, callId]);

  const loadUsersInfo = async () => {
    try {
      const cUser = client.getCurrentUserInfo();
      const uUsers = client.getAllUser();
      setUsers(uUsers);
      setCurrentUser(cUser);
      showManagerVideo();
    } catch (error) {
      console.log("erro ao carregar usuarios: ", error);
    }
  };

  const showManagerVideo = async () => {
    try {
      const allUsers = await client.getAllUser();
      const findManagerUser = allUsers.find((u) => u.isHost);
      if (!!findManagerUser) {
        try {
          await stream?.renderVideo(
            document.querySelector("#principal-video-canvas")!,
            findManagerUser.userId,
            920,
            920,
            0,
            0,
            3
          );
        } catch (error) {
          //
        }
      }
    } catch (error) {
      console.log("erro ao renderizar video do gerente: ", error);
    }
  };

  return { startVideo, users, started, stream, client, currentUser };
};
