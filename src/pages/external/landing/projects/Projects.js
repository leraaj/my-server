import React, { useEffect, useRef, useState } from "react";
import "../../../../styles/projectStyles.css";

// List of video URLs and their titles
const videos = [
  {
    url: "https://www.youtube.com/embed/VYwmpN586iQ?si=z0gbq3GsLHYarbe-",
    title: "Koleksyon | Pinoy Pawnstar #EdCaluag #TheEdFiles",
  },
  {
    url: "https://www.youtube.com/embed/bu9w6uTD8JA?si=NV_1dYBlXAhC5_yU",
    title: "#Single Book Entry ",
  },
  {
    url: "https://www.youtube.com/embed/AJAky6jqoRE?si=xkyZtnYFB_j5YK3D",
    title: "Ano nga ba ?",
  },
  {
    url: "https://www.youtube.com/embed/MaEH6p8JlWE?si=7r7sER-65g-fWer6",
    title:
      "Ang Lihim Na Pagdiskubre Kay San Jose: Kasaysayan Ng San Jose Del Monte, Bulacan",
  },
  {
    url: "https://www.youtube.com/embed/-WUDPAkBGWg?si=QA5R2h0229LlsKn_",
    title: "SALUDO EXCELLENCE AWARD | Jay Costura",
  },
];

// Utility function to extract video ID from YouTube URL
const getYouTubeID = (url) => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const Projects = () => {
  const [currentVideo, setCurrentVideo] = useState(videos[0].url);
  const [currentVideoWithoutAutoplay, setCurrentVideoWithoutAutoplay] =
    useState(videos[0].url);

  const videoRef = useRef(null);
  const handleVideoClick = (url) => {
    const autoplayUrl = url.includes("?")
      ? `${url}&autoplay=1`
      : `${url}?autoplay=1`;
    setCurrentVideo(autoplayUrl);
    setCurrentVideoWithoutAutoplay(url);
  };
  return (
    <div
      id="projects"
      className="landing-section"
      style={{
        backgroundImage: `var(--dark-100)`,
      }}>
      <div className="col pt-5">
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          we proudly present
          <br />
          our videographer
        </span>
        <section>
          <div className="col-12">
            <div className="video-playing ratio ratio-21x9">
              <iframe
                ref={videoRef}
                src={currentVideo}
                allow="autoplay; fullscreen"
                title="YouTube video"
                allowFullScreen></iframe>
            </div>
          </div>
          <div className="horizontal-list gap-3">
            {videos.map((video, index) => {
              const videoID = getYouTubeID(video.url);
              const thumbnailUrl = `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`;

              return (
                <div
                  key={index}
                  className="idle-video-item"
                  onClick={() => handleVideoClick(video.url)}
                  style={{ cursor: "pointer" }}>
                  <img
                    src={thumbnailUrl}
                    alt={`Thumbnail ${index}`}
                    className="img-thumbnail ratio ratio-1x1"
                    style={{
                      minWidth: "200px",
                      width: "100%",
                      height: "70%",
                      objectFit: "cover",
                      backgroundColor: "transparent",
                      borderRadius: 0,
                      border: "none",
                    }}
                  />

                  <div
                    className="video-title"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "0.8rem",
                    }}>
                    {video.title}
                    {currentVideoWithoutAutoplay === video.url && (
                      <div
                        className="now-playing-label"
                        style={{
                          fontFamily: "Poppins-Medium",
                          fontSize: "1.2rem",
                        }}>
                        Now Playing
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
