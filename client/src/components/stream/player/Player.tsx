import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import VideoPlayer from "./VideoPlayer";
import Shelf from "../../shared/Shelf";

import {
  IGeneralRecord,
  ILoadedEpsiode,
  ILoadedRecord,
} from "../../../utility/interfaces/explore-responses";

import styles from "./Player.module.scss";

const Player: React.FC<{
  mediaData: ILoadedRecord;
  episodeData?: ILoadedEpsiode;
  similarSelection: IGeneralRecord[];
  externalLoadingState: boolean;
}> = function ({
  mediaData,
  episodeData,
  similarSelection,
  externalLoadingState,
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [windowsWidth, setWindowsWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowsWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const primeScrollContainer = document.getElementById("player-container");
    if (primeScrollContainer) {
      primeScrollContainer.scrollTo(0, 0);
    }
  }, [mediaData]);

  return (
    <section className={styles.player} ref={containerRef}>
      <img
        className={styles["player__backlight"]}
        src={`http://localhost:8080${mediaData.thumb_src}`}
      />
      <h4 className={styles["player__type"]}>
        {mediaData.seasons ? "Series" : "Movie"}
      </h4>
      <VideoPlayer mediaData={mediaData} episodeData={episodeData} />
      <h3 className={styles["player__title"]}>
        {episodeData
          ? `Season ${episodeData.season}, Episode ${episodeData.episode_num}: ${episodeData.title}`
          : mediaData.title}
      </h3>
      {episodeData && (
        <h5 className={styles["player__subtitle"]}>{mediaData.title}</h5>
      )}
      <div className={styles["player__more"]}>
        {
          <Shelf
            sectionTitle={`Similar to ${mediaData.title}`}
            slotsNumber={windowsWidth > 1800 ? 4.4 : 3.4}
            preFetchedData={similarSelection}
            externalLoadingState={externalLoadingState}
          />
        }
      </div>
    </section>
  );
};

export default Player;
