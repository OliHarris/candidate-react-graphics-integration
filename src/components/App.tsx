import { useRef, useState, useEffect, useMemo, useCallback } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import bbcLogo from "../assets/images/blq-orbit-blocks_grey.svg";

// For this test, to save time I used this code as an initial springboard for the JS and CSS:
// https://blog.logrocket.com/creating-customizing-html5-video-player-css/
// I also checked the FontAwesome docs for integration with React:
// https://fontawesome.com/v5/docs/web/use-with/react

const App = () => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [nextStartTime, setNextStartTime] = useState<number>(0);
  const startTimeArray = useMemo<number[]>(() => [], []);

  const playIconRef = useRef<HTMLElement | null>(null);
  const pauseIconRef = useRef<HTMLElement | null>(null);
  const barInnerRef = useRef<HTMLElement | null>(null);
  const videoContainerRef = useRef<HTMLVideoElement | null>(null);

  // fortunately frame rate of this video details 60.00 frames/second
  // will only note SS:FF values in timecodes
  const timelineArray = useMemo<
    {
      startTime: number;
      endTime: number;
      captionType: string;
      captionData: {
        action: string | null;
        location: string | null;
        line1: string | null;
        line2: string | null;
        text: string | null;
      }[];
    }[]
  >(
    () => [
      {
        startTime: 1.0,
        endTime: 10.0,
        captionType: "logo",
        captionData: [
          {
            action: "on",
            location: "top left",
            line1: null,
            line2: null,
            text: null,
          },
        ],
      },
      {
        startTime: 2.0,
        endTime: 3.2,
        captionType: "nameSuper",
        captionData: [
          {
            action: null,
            location: null,
            line1: "a rabbit hole",
            line2: null,
            text: null,
          },
        ],
      },
      {
        startTime: 4.0,
        endTime: 5.1,
        captionType: "nameSuper",
        captionData: [
          {
            action: null,
            location: null,
            line1: "a tree",
            line2: "(a big one)",
            text: null,
          },
        ],
      },
      {
        startTime: 6.0,
        endTime: 6.2,
        captionType: "nameSuper",
        captionData: [
          {
            action: null,
            location: null,
            line1: "some rocks",
            line2: null,
            text: null,
          },
        ],
      },
      {
        startTime: 7.0,
        endTime: 8.14,
        captionType: "nameSuper",
        captionData: [
          {
            action: null,
            location: null,
            line1: "some grass",
            line2: null,
            text: null,
          },
        ],
      },
      {
        startTime: 9.0,
        endTime: 10.0,
        captionType: "title",
        captionData: [
          {
            action: null,
            location: null,
            line1: null,
            line2: null,
            text: "the end",
          },
        ],
      },
    ],
    []
  );

  const showPlayIcon = (action: string) => {
    if (playIconRef.current) {
      const playIcon = playIconRef.current;
      playIcon.setAttribute("style", "display: block;");
    }
    if (pauseIconRef.current) {
      const pauseIcon = pauseIconRef.current;
      pauseIcon.setAttribute("style", "display: none;");
    }
    if (videoContainerRef.current) {
      const video = videoContainerRef.current;
      if (action === "pauseVideo") {
        video.pause();
      }
    }
  };

  const showPauseIcon = (action: string) => {
    if (playIconRef.current) {
      const playIcon = playIconRef.current;
      playIcon.setAttribute("style", "display: none;");
    }
    if (pauseIconRef.current) {
      const pauseIcon = pauseIconRef.current;
      pauseIcon.setAttribute("style", "display: block;");
    }
    if (videoContainerRef.current) {
      const video = videoContainerRef.current;
      if (action === "playVideo") {
        video.play();
      }
    }
  };

  // add pause logic for "Task: The Timeline management"
  const nextMaxStartTime = useCallback(
    (closestTo: number) => {
      let video;
      if (videoContainerRef.current) {
        video = videoContainerRef.current;
      }
      // deal with what happens after final nextStartTime (beyond 9.0 seconds)
      if (
        video &&
        video.currentTime > startTimeArray[startTimeArray.length - 1]
      ) {
        return video.duration;
      } else {
        // usual calculation
        // I had inspiration with this top function for this logic:
        // https://stackoverflow.com/questions/33309930/javascript-find-closest-number-in-array-without-going-over
        let closestValue = Math.max.apply(null, startTimeArray);
        for (let i = 0; i < startTimeArray.length; i++) {
          if (
            startTimeArray[i] >= closestTo &&
            startTimeArray[i] < closestValue
          )
            closestValue = startTimeArray[i];
        }
        return closestValue;
      }
    },
    [startTimeArray]
  );

  // TODO: instead of timeupdate eventListener
  // consider re-wring to use "window.requestAnimationFrame"
  // which fires at 60 frames/second
  // would also probably sort display of nameSuper - line1: "some rocks"
  // due to very small interval between startTime and endTime
  // this does not always trigger...
  const pauseOnTimecode = useCallback(() => {
    // console.log(video.currentTime);
    // console.log(nextStartTime);
    if (videoContainerRef.current) {
      const video = videoContainerRef.current;
      // I had inspiration with this answer for this logic:
      // https://stackoverflow.com/questions/19355952/make-html5-video-stop-at-indicated-time
      // current time is given in seconds
      if (video.currentTime >= nextStartTime) {
        // pause the playback
        showPlayIcon("pauseVideo");
        // remove pauseOnTimecode() event listener after paused playback
        video.removeEventListener("timeupdate", pauseOnTimecode);
        // update nextStartTime to pause on
        setNextStartTime(nextMaxStartTime(video.currentTime));
      }
    }
  }, [nextMaxStartTime, nextStartTime]);

  useEffect(() => {
    // switch needed to make sure initialise logic only on first load
    if (firstLoad === true) {
      setFirstLoad(false);
      // reference important static elements
      playIconRef.current = document.querySelector(".fa-play") as HTMLElement;
      pauseIconRef.current = document.querySelector(".fa-pause") as HTMLElement;
      barInnerRef.current = document.querySelector(
        "#timeline .bar .inner"
      ) as HTMLElement;

      // startTimeArray is useMemo hook so only one extraction
      timelineArray.forEach((item) => startTimeArray.push(item.startTime));
      // obviously does not need sorting but good practice
      startTimeArray.sort(function (a, b) {
        return a - b;
      });

      // initialise
      showPlayIcon("");
      setNextStartTime(nextMaxStartTime(0));

      // update the progress bar
      if (videoContainerRef.current) {
        const video = videoContainerRef.current;
        // TODO: onTimeUpdate could be own useCallback
        // to use "window.requestAnimationFrame"
        video.addEventListener("timeupdate", () => {
          const barInnerCalc = (video.currentTime / video.duration) * 100;
          if (barInnerRef.current) {
            const barInner = barInnerRef.current;
            barInner.setAttribute("style", `width: ${barInnerCalc}%`);
          }
          if (video.ended) {
            // reset pauseOnTimecode() event listener
            video.addEventListener("timeupdate", pauseOnTimecode);
            // TODO: BUG with playing video after has ended (first click only)
            // consider parsing status to pauseOnTimecode() or
            // setNextStartTime(0);
          }
        });
      }
    }
  }, [
    firstLoad,
    timelineArray,
    startTimeArray,
    nextMaxStartTime,
    pauseOnTimecode,
  ]);

  // pause or play the video
  const playToggle = () => {
    if (videoContainerRef.current) {
      const video = videoContainerRef.current;
      // Condition when to play a video
      if (video.paused) {
        showPauseIcon("playVideo");
        // add pauseOnTimecode() event listener
        video.addEventListener("timeupdate", pauseOnTimecode);
      } else {
        showPlayIcon("pauseVideo");
      }
    }
  };

  const findTimelineObject = (type: string) => {
    let timelineObject;
    switch (type) {
      case "logo":
        timelineObject = timelineArray.find(
          (obj) => obj.captionType === "logo"
        );
        break;
      case "nameSuper1":
        timelineObject = timelineArray.find(
          (obj) => obj.captionData[0].line1 === "a rabbit hole"
        );
        break;
      case "nameSuper2":
        timelineObject = timelineArray.find(
          (obj) =>
            obj.captionData[0].line1 === "a tree" &&
            obj.captionData[0].line2 === "(a big one)"
        );
        break;
      case "nameSuper3":
        timelineObject = timelineArray.find(
          (obj) => obj.captionData[0].line1 === "some rocks"
        );
        break;
      case "nameSuper4":
        timelineObject = timelineArray.find(
          (obj) => obj.captionData[0].line1 === "some grass"
        );
        break;
      case "title":
        timelineObject = timelineArray.find(
          (obj) => obj.captionType === "title"
        );
        break;
      default:
    }
    return timelineObject;
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
    }[];
  }) => {
    return (
      <div id="name-super-display">
        <div>{nameSuper && nameSuper.captionData[0].line1}</div>
        <div>{nameSuper && nameSuper.captionData[0].line2}</div>
      </div>
    );
  };

  return (
    <div className="container">
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
            {findTimelineObject("title")!.captionData[0].text}
          </div>
        )}

      <video
        id="video"
        ref={videoContainerRef}
        onClick={() => playToggle()}
        src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_10MB.mp4"
      ></video>
      <section className="controls">
        <button onClick={() => playToggle()}>
          <FontAwesomeIcon icon={faPlay} />
          <FontAwesomeIcon icon={faPause} />
        </button>
        <div id="timeline">
          <div className="bar">
            <div className="inner"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
