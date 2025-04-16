import { useNavigate } from "react-router-dom";

import styles from "./CatalogueSlot.module.scss";

import playSrc from "../../assets/svgs/play.svg";
import { ILoadedRecord } from "../../utility/interfaces/explore-responses";

const CatalogSlot: React.FC<{ mediaData: ILoadedRecord }> = function ({
  mediaData,
}) {
  const navigator = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles["container__thumb"]}>
        <img src={`http://localhost:8080${mediaData.thumb_src}`} />
        <img
          className={styles["container__thumb__backlight"]}
          src={`http://localhost:8080${mediaData.thumb_src}`}
        />
      </div>
      <div className={styles.details}>
        <h3 className={styles["details__title"]}>{mediaData.title}</h3>
        <div className={styles["details__tags"]}>
          {mediaData.Genres.slice(0, 3).map((g) => (
            <span key={g.genre}>{g.genre}</span>
          ))}
          <span>
            {mediaData.duration
              ? mediaData.duration + " minutes"
              : mediaData.seasons + " seasons"}
          </span>
        </div>
        <p className={styles["details__description"]}>
          {mediaData.description}
        </p>
        <div className={styles["details__others"]}>
          <span>
            {new Date(mediaData.release_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>✨ {mediaData.Personalization.rating} / 10</span>
        </div>
        <div className={styles["details__controls"]}>
          <button
            onClick={() =>
              navigator(
                `/stream/${mediaData.seasons ? "series" : "movie"}:${
                  mediaData.id
                }`
              )
            }
          >
            <img src={playSrc} />
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogSlot;
