/* eslint-disable react-hooks/exhaustive-deps */
import ZoomVideo, { Participant, Stream } from "@zoom/videosdk";
import { generateSignature } from "../utils/singature";
import { useCallback, useContext, useEffect, useState } from "react";
import zoomContext from "../context/zoom.context";
import { randomName } from "../utils/name";
const sdkKey = "X1k75GMu0ULCaz26yBa5iRev43eRHisvHPVE";
const sdkSecret = "KspZ4bLhzgO0ECEXzTYjtGFOQkvX0iGXyOtp";
const signature = generateSignature(sdkKey, sdkSecret, "topic", 0);

export const useStream = () => {
  const client = useContext(zoomContext);
  client.init("en-US", "CDN");
  const [currentUser, setCurrentUser] = useState<Participant>();
  const [stream, setStream] = useState<typeof Stream>(); // eslint-disable-line
  const [users, setUsers] = useState<Participant[]>([]);

  useEffect(() => {
    startVideo();
    loadUsersInfo();

    return () => {
      ZoomVideo.destroyClient();
    };
  }, []);

  useEffect(() => {
    if (!!stream) {
      client.on("peer-video-state-change", async (payload) => {
        try {
          loadUsersInfo();
          if (payload.action === "Start") {
            await stream?.renderVideo(
              document.querySelector(`#p-user-video-${payload.userId}`)!,
              payload.userId,
              560,
              540,
              0,
              0,
              2
            );
          } else if (payload.action === "Stop") {
            await stream?.stopRenderVideo(
              document.querySelector(`#p-user-video-${payload.userId}`)!,
              payload.userId
            );
          }
        } catch (error) {
          console.log("error: ", error);
        }
      });
    }
  }, [stream, client]);

  const startVideo = useCallback(async () => {
    try {
      await client.join("topic", signature, randomName(), "8wfb1x");

      const stream = client.getMediaStream();
      setStream(stream);
      loadUsersInfo();

      try {
        await stream.startVideo({
          videoElement: document.querySelector("#my-self-view-video") as any,
        });
        await stream.renderVideo(
          document.querySelector("#my-self-view-canvas")!,
          client.getCurrentUserInfo().userId,
          920,
          920,
          0,
          0,
          2
        );
      } catch (e) {
        //
      }

      try {
        await stream.startAudio({ mute: true });
      } catch (error) {
        //
      }

      await Promise.allSettled(
        client.getAllUser().map(async (user) => {
          if (user.bVideoOn) {
            await stream?.renderVideo(
              document.querySelector(`#p-user-video-${user.userId}`)!,
              user.userId,
              560,
              540,
              0,
              0,
              2
            );
          }
        })
      );
    } catch (error) {
      console.log("erro start: ", error);
    }
  }, [client]);

  const loadUsersInfo = () => {
    const uUsers = client.getAllUser();
    const cUser = client.getCurrentUserInfo();
    setUsers(uUsers);
    setCurrentUser(cUser);
  };

  return { startVideo, users, stream, client, currentUser };
};
