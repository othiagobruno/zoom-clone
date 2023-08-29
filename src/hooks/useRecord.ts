import { useState } from "react";
import { useStream } from "../context/stream.context";

export const useRecord = () => {
  const { cloudRecord } = useStream();
  const [startedRecording, setStartRecording] = useState(false);

  const startRecording = async () => {
    try {
      await cloudRecord?.startCloudRecording();
      setStartRecording(true);
    } catch (error) {}
  };

  const stopRecording = async () => {
    try {
      await cloudRecord?.stopCloudRecording();
      setStartRecording(false);
      const res = await cloudRecord?.getCloudRecordingStatus();
      console.log(res);
    } catch (error) {}
  };

  return { startRecording, startedRecording, stopRecording };
};
