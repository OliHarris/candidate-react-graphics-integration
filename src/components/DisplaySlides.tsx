import { MutableRefObject } from "react";
import bbcLogo from "../assets/images/blq-orbit-blocks_grey.svg";

interface DisplaySlidesInterface {
  timelineArray: {
    startTime: number;
    endTime: number;
    captionType: string;
    captionData: {
      action: string | null;
      location: string | null;
      line1: string | null;
      line2: string | null;
      text: string | null;
    };
  }[];
  videoContainerRef: MutableRefObject<HTMLVideoElement | null>;
  nextStartTime: number;
}

const DisplaySlides = ({
  timelineArray,
  videoContainerRef,
  nextStartTime,
}: DisplaySlidesInterface) => {
  const timelineObjectMap = {
    logo: timelineArray.find((obj) => obj.captionType === "logo"),
    nameSuper1: timelineArray.find(
      (obj) => obj.captionData.line1 === "a rabbit hole"
    ),
    nameSuper2: timelineArray.find(
      (obj) =>
        obj.captionData.line1 === "a tree" &&
        obj.captionData.line2 === "(a big one)"
    ),
    nameSuper3: timelineArray.find(
      (obj) => obj.captionData.line1 === "some rocks"
    ),
    nameSuper4: timelineArray.find(
      (obj) => obj.captionData.line1 === "some grass"
    ),
    title: timelineArray.find((obj) => obj.captionType === "title"),
  };
  const findTimelineObject = (type: string) => {
    return timelineObjectMap[type as keyof typeof timelineObjectMap];
  };

  const getTimelineNumber = (type: string, property: string) => {
    const timelineObject = findTimelineObject(type)!;
    return timelineObject[property as keyof typeof timelineObject] as number;
  };

  const video = videoContainerRef.current;

  const nameSuperMarkup = (nameSuper: {
    startTime: number;
    endTime: number;
    captionType: string;
    captionData: {
      action: string | null;
      location: string | null;
      line1: string | null;
      line2: string | null;
      text: string | null;
    };
  }) => {
    return (
      <div id="name-super-display">
        <div>{nameSuper && nameSuper.captionData.line1}</div>
        <div>{nameSuper && nameSuper.captionData.line2}</div>
      </div>
    );
  };

  return (
    <>
      {/* display if nextStartTime greater than startTime value */}
      {/* display if video.currentTime less than or equal to endTime value */}
      {nextStartTime > getTimelineNumber("logo", "startTime") &&
        video &&
        video.currentTime <= getTimelineNumber("logo", "endTime") && (
          <figure id="bbc-logo">
            <img className="svg" src={bbcLogo} alt="BBC logo" />
          </figure>
        )}

      {nextStartTime > getTimelineNumber("nameSuper1", "startTime") &&
        video &&
        video.currentTime <= getTimelineNumber("nameSuper1", "endTime") &&
        nameSuperMarkup(findTimelineObject("nameSuper1")!)}

      {nextStartTime > getTimelineNumber("nameSuper2", "startTime") &&
        video &&
        video.currentTime <= getTimelineNumber("nameSuper2", "endTime") &&
        nameSuperMarkup(findTimelineObject("nameSuper2")!)}

      {nextStartTime > getTimelineNumber("nameSuper3", "startTime") &&
        video &&
        video.currentTime <= getTimelineNumber("nameSuper3", "endTime") &&
        nameSuperMarkup(findTimelineObject("nameSuper3")!)}

      {nextStartTime > getTimelineNumber("nameSuper4", "startTime") &&
        video &&
        video.currentTime <= getTimelineNumber("nameSuper4", "endTime") &&
        nameSuperMarkup(findTimelineObject("nameSuper4")!)}

      {nextStartTime > getTimelineNumber("title", "startTime") &&
        video &&
        video.currentTime <= getTimelineNumber("title", "endTime") && (
          <div id="title-display">
            {findTimelineObject("title")!.captionData.text}
          </div>
        )}
    </>
  );
};
export default DisplaySlides;
