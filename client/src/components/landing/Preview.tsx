import { useNavigate } from "react-router-dom";

import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

import styles from "./Preview.module.scss";
import playSrc from "../../assets/svgs/play.svg";

const Preview: React.FC<{ mediaData: IGeneralRecord }> = function ({
  mediaData,
}) {
  const navigator = useNavigate();

  return (
    <div className={styles.slot}>
      <aside className={styles.data}>
        <h1 className={styles["data__title"]}>{mediaData.title}</h1>
        <span className={styles["data__attributes"]}>
          <h3>{mediaData.seasons ? "Series" : "Movie"}</h3>
          <h3>
            {new Date(mediaData.release_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
          <h3>{mediaData.Listings[0].name}</h3>
        </span>
        <p className={styles["data__description"]}>{mediaData.description}</p>
        <div className={styles["data__controlls"]}>
          <button
            onClick={() =>
              navigator(
                `/stream/${mediaData.seasons ? "series" : "movie"}:${
                  mediaData.id
                }`
              )
            }
          >
            <img src={playSrc} alt="Watch Now" />
            Watch Now
          </button>
        </div>
      </aside>
      <img
        className={styles["slot__poster"]}
        src={`http://localhost:8080${mediaData.poster_src}`}
        alt={`${mediaData.title} Poster`}
      />
    </div>
  );
};

export default Preview;
