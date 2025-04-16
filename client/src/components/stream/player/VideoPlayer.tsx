import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import videojs from "video.js";
import Player from "video.js/dist/types/player";

import {
  ILoadedEpsiode,
  ILoadedRecord,
} from "../../../utility/interfaces/explore-responses";
import { RootState } from "../../../store/store";

import styles from "./VideoPlayer.module.scss";
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/fantasy/index.css";
import "./theme-modifications.css";

const VideoPlayer: React.FC<{
  mediaData: ILoadedRecord;
  episodeData?: ILoadedEpsiode;
}> = function ({ mediaData, episodeData }) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stoppedUpdates = useRef(false);

  const { resumeTime } = useSelector((state: RootState) => state.stream);

  const sendPlaybackData = async function () {
    if (stoppedUpdates.current) return;

    try {
      if (playerRef.current) {
        const response = await fetch("http://localhost:8080/state/manage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: episodeData ? "episode" : "movie",
            id: episodeData?.id || mediaData.id,
            resumeTime: (playerRef.current.currentTime() as number) / 60,
            totalDuration: episodeData?.duration || mediaData.duration,
          }),
        });

        const responseData: { message: string; action?: "STOP_UPDATES" } =
          await response.json();
        if (responseData.action === "STOP_UPDATES") {
          stoppedUpdates.current = true;
        }
        console.log(responseData);
      }
    } catch (error) {
      console.log(
        "Client Error. Couldn't append new state's data. Errro details: ",
        error
      );
    }
  };

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add(
        "video-js",
        "vjs-theme-fantasy",
        styles["vjs-matrix"]
      );

      videoRef.current.appendChild(videoElement);

      const tracks: any[] = [];
      if (episodeData) {
        episodeData.en_subtitles &&
          tracks.push({
            kind: "subtitles",
            src: `http://localhost:8080${episodeData.en_subtitles}`,
            srclang: "en",
            label: "English",
            default: true,
          });
        episodeData.bg_subtitles &&
          tracks.push({
            kind: "subtitles",
            src: `http://localhost:8080${episodeData.bg_subtitles}`,
            srclang: "bg",
            label: "Bulgarian",
            default: true,
          });
      } else {
        mediaData.en_subtitles &&
          tracks.push({
            kind: "subtitles",
            src: `http://localhost:8080${mediaData.en_subtitles}`,
            srclang: "en",
            label: "English",
            default: true,
          });
        mediaData.bg_subtitles &&
          tracks.push({
            kind: "subtitles",
            src: `http://localhost:8080${mediaData.bg_subtitles}`,
            srclang: "bg",
            label: "Bulgarian",
            default: true,
          });
      }

      playerRef.current = videojs(videoElement, {
        controls: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: [
          {
            src: `http://localhost:8080${
              episodeData ? episodeData.stream_src : mediaData.stream_src
            }`,
            type: "video/mp4",
          },
        ],
        poster: `http://localhost:8080${mediaData.thumb_src}`,
        tracks,
      });

      playerRef.current.ready(() => {
        if (playerRef.current && resumeTime > 0) {
          playerRef.current.currentTime(resumeTime * 60);
        }
      });

      playerRef.current.on("play", () => {
        if (!intervalRef.current) {
          intervalRef.current = window.setInterval(sendPlaybackData, 5000);
        }
      });

      playerRef.current.on("pause", () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });

      playerRef.current.on("dispose", () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
    }

    return () => {
      const player = playerRef.current;

      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [mediaData, episodeData]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef, mediaData, episodeData]);

  return (
    <div data-vjs-player className={styles.base}>
      <div ref={videoRef} className={styles["base__wrapper"]} />
    </div>
  );
};

export default VideoPlayer;
