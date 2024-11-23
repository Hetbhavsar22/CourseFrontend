import React, { useEffect, useState, useRef } from "react";
import shaka from "shaka-player";
import PropTypes from "prop-types";
import axios from "axios";

const VideoPlayer = ({
  manifestUrl,
  completion,
  setCompletion,
  userId,
  courseDetails,
  chapterIndex,
  resourceIndex,
  courseId,
  calculateCompletionPercentage,
  setCompletionPercentage,
  videoId,
  percentage,
  courseType,
  trigerChapters
}) => {
  const videoElement = useRef(null);
  const [progressUpdated, setProgressUpdated] = useState(false);
  const [player, setPlayer] = useState(null);
  const [isAccessible, setIsAccessible] = useState(true); // State for accessibility
  const [countdown, setCountdown] = useState(0); // Countdown timer in milliseconds

  const handleTimeUpdate = () => {
    const video = videoElement.current;
    if (video && video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      setCompletion(progress.toFixed(2));
      if (!progressUpdated && progress.toFixed(2) >= percentage) {
        setProgressUpdated(true);
        updateVideoProgress(progress);
      }
    }
  };

  const updateVideoProgress = async (progress) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/video-progress`,
        {
          userId,
          videoId,
          courseId,
          progress,
          percentage,
        }
      );
      if (response.status === 200) {
        console.log("Progress updated successfully:", response.data);
        courseDetails.chapters[chapterIndex].resources[resourceIndex].completed = true;
        const percentageCompleted = calculateCompletionPercentage();
        setCompletionPercentage(percentageCompleted);
      }
    } catch (error) {
      console.error("Error updating video progress:", error);
    }
  };

  const formatCountdown = (time) => {
    if (typeof time !== "number" || time < 0) return "00:00:00";
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleIsAccessible = () => {
      if (courseDetails?.courseType === "timeIntervals" && chapterIndex === 0) {
        const purchaseDate = new Date(courseDetails.transactionDate);
        const currentTime = new Date(courseDetails.currentTime); // Use currentTime as a Date object
  
        const [startHour, startMinute] = courseDetails.startTime
          .split("T")[1]
          .substring(0, 5)
          .split(":")
          .map(Number);
  
        const unlockTime = new Date(purchaseDate);
        unlockTime.setUTCHours(startHour, startMinute, 0, 0); // Set unlockTime
  
        // Compare currentTime with unlockTime
        const isAccessible = currentTime >= unlockTime;
        console.log("Accessible:", isAccessible);
        setIsAccessible(isAccessible);
  
        console.log("Unlock Time:", unlockTime);
        console.log("Current Time:", currentTime);
  
        if (!isAccessible) {
          // Calculate time difference
          const timeDifference = unlockTime.getTime() - currentTime.getTime(); // Subtract timestamps
          console.log("Time Difference (ms):", timeDifference);
  
          if (timeDifference > 0) {
            setCountdown(timeDifference); // Set countdown if difference is positive
          }
        }
      }
    };
  
    handleIsAccessible();
  }, [courseDetails, chapterIndex]);
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1000);
      } else if (countdown <= 0) {
        setIsAccessible(true);
        clearInterval(intervalId);
        trigerChapters(true);

      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  useEffect(() => {
    setProgressUpdated(false);
    setCompletion(0);
  }, [videoId]);
useEffect(() => {
    const playerInstance = new shaka.Player(videoElement.current);
    setPlayer(playerInstance);

    playerInstance.addEventListener("error", onErrorEvent);

    return () => {
      if (playerInstance) {
        console.log("Destroying player");
        playerInstance.destroy();
      }
    };
  }, [isAccessible]);

  useEffect(() => {
    if (player && manifestUrl) {
      player
        .load(manifestUrl)
        .then(() => {
          videoElement.current.autoplay = true;
          const videoDuration = videoElement.current.duration;
          const startTime = (completion / 100) * videoDuration;
          videoElement.current.currentTime = startTime;

          if (isAccessible && videoElement.current) {
            videoElement.current.play();
          }
        })
        .catch((error) => {
          console.error("Error loading video", error);
        });
    }
  }, [player, manifestUrl, isAccessible,isAccessible]);

  useEffect(() => {
    const video = videoElement.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [videoElement, handleTimeUpdate,isAccessible]);

  const onErrorEvent = (error) => {
    console.error("Error code", error.code, "object", error);
  };

  if (!isAccessible) {
    return (
      <div style={{height:"50vh",display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',backgroundColor:'black',borderRadius:'13px',color:'white'}}>
        <p>Video is locked. Please wait until it becomes accessible.</p> <br/>
        <p>Time remaining: {formatCountdown(countdown)}</p> 
      </div>
    );
  }

  return (
    <video
      id="videoPlayer"
      controls
      style={{ width: "100%", height: "auto" }}
      ref={videoElement}
    />
  );
};

VideoPlayer.propTypes = {
  manifestUrl: PropTypes.string.isRequired,
  completion: PropTypes.number.isRequired,
  setCompletion: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  courseDetails: PropTypes.object.isRequired,
  chapterIndex: PropTypes.number.isRequired,
  resourceIndex: PropTypes.number.isRequired,
  courseId: PropTypes.string.isRequired,
  calculateCompletionPercentage: PropTypes.func.isRequired,
  setCompletionPercentage: PropTypes.func.isRequired,
  videoId: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  courseType: PropTypes.string.isRequired,
};

export default VideoPlayer;