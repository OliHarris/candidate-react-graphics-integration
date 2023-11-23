import { MutableRefObject } from "react";
import bunnyVideo from "../assets/video/Big_Buck_Bunny_1080_10s_10MB.mp4";

interface VideoInterface {
  videoContainerRef: MutableRefObject<HTMLVideoElement | null>;
  playToggle: () => void;
}

const Video = ({ videoContainerRef, playToggle }: VideoInterface) => {
  return (
    <video
      id="video"
      ref={videoContainerRef}
      onClick={() => playToggle()}
      src={bunnyVideo}
    ></video>
  );
};
export default Video;
