import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setResumeTime } from "../../store/stream";

import styles from "./ContinueWatching.module.scss";

import playSrc from "../../assets/svgs/play.svg";
import {
  IGeneralRecord,
  ILoadedEpsiode,
} from "../../utility/interfaces/explore-responses";

const ContinueWatching: React.FC<{
  slotData: {
    mediaData: IGeneralRecord;
    resumeTime: number;
    episode?: ILoadedEpsiode;
  };
}> = function ({ slotData }) {
  console.log(slotData.mediaData);
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const openStream = function () {
    dispatch(
      setResumeTime({
        resumeTime: slotData.resumeTime,
        activeId: slotData.episode?.id,
      })
    );
    navigator(
      `/stream/${slotData.episode ? "series" : "movie"}:${
        slotData.mediaData.id
      }`
    );
  };

  function formatDuration(decimalMinutes: number) {
    const totalSeconds = Math.floor(decimalMinutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime =
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");

    return formattedTime;
  }

  return (
    <div className={styles.slot}>
      <img
        className={styles["slot__thumb"]}
        src={`http://localhost:8080${slotData.mediaData.thumb_src}`}
      />
      <div className={styles.description}>
        <button className={styles["description__play"]} onClick={openStream}>
          <img src={playSrc} />
        </button>
        <span className={styles["description__title"]}>
          <h6>{slotData.mediaData.title}</h6>
          <p>{slotData.episode ? "Series" : "Movies"}</p>
        </span>
        <span className={styles["description__duration"]}>
          {slotData.episode
            ? `S:${slotData.episode.season} Ep:${slotData.episode.episode_num}`
            : `${slotData.mediaData.duration} min.`}
        </span>
        <p className={styles["description__metadata"]}>
          Continue watching from: <b>{formatDuration(slotData.resumeTime)}</b>
        </p>
      </div>
    </div>
  );
};

export default ContinueWatching;
