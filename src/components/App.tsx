import { useRef, useState, useEffect, useMemo, useCallback } from "react";

import DisplaySlides from "./DisplaySlides";
import Video from "./Video";
import Controls from "./Controls";

// For this test, to save time I used this code as an initial springboard for the JS and CSS:
// https://blog.logrocket.com/creating-customizing-html5-video-player-css/
// I also checked the FontAwesome docs for integration with React:
// https://fontawesome.com/v5/docs/web/use-with/react

const App = () => {
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
      };
    }[]
  >(
    () => [
      {
        startTime: 1.0,
        endTime: 10.0,
        captionType: "logo",
        captionData: {
          action: "on",
          location: "top left",
          line1: null,
          line2: null,
          text: null,
        },
      },
      {
        startTime: 2.0,
        endTime: 3.2,
        captionType: "nameSuper",
        captionData: {
          action: null,
          location: null,
          line1: "a rabbit hole",
          line2: null,
          text: null,
        },
      },
      {
        startTime: 4.0,
        endTime: 5.1,
        captionType: "nameSuper",
        captionData: {
          action: null,
          location: null,
          line1: "a tree",
          line2: "(a big one)",
          text: null,
        },
      },
      {
        startTime: 6.0,
        endTime: 6.2,
        captionType: "nameSuper",
        captionData: {
          action: null,
          location: null,
          line1: "some rocks",
          line2: null,
          text: null,
        },
      },
      {
        startTime: 7.0,
        endTime: 8.14,
        captionType: "nameSuper",
        captionData: {
          action: null,
          location: null,
          line1: "some grass",
          line2: null,
          text: null,
        },
      },
      {
        startTime: 9.0,
        endTime: 10.0,
        captionType: "title",
        captionData: {
          action: null,
          location: null,
          line1: null,
          line2: null,
          text: "the end",
        },
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
  }, [nextMaxStartTime, startTimeArray, timelineArray]);

  useEffect(() => {
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
  }, [pauseOnTimecode]);

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

  return (
    <div className="container">
      <DisplaySlides
        timelineArray={timelineArray}
        videoContainerRef={videoContainerRef}
        nextStartTime={nextStartTime}
      />
      <Video videoContainerRef={videoContainerRef} playToggle={playToggle} />
      <Controls playToggle={playToggle} />
    </div>
  );
};

export default App;
