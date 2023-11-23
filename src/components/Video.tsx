import { MutableRefObject } from "react";

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
      src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_10MB.mp4"
    ></video>
  );
};
export default Video;
