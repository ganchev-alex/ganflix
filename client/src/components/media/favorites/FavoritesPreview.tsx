import { useNavigate } from "react-router-dom";
import { IGeneralRecord } from "../../../utility/interfaces/explore-responses";

import styles from "./FavoritesPreview.module.scss";
import playSrc from "../../../assets/svgs/play.svg";

const FavoritesPreview: React.FC<{ mediaData: IGeneralRecord }> = function ({
  mediaData,
}) {
  const navigator = useNavigate();
  return (
    <section className={styles.plane}>
      <h3 className={styles["plane__subtitle"]}>Favorites Selection</h3>
      <h2 className={styles["plane__title"]}>{mediaData.title}</h2>
      <div className={styles["plane__attributes"]}>
        {mediaData.Genres.slice(0, 3).map((g) => (
          <p key={g.genre}>{g.genre}</p>
        ))}
        <p>
          {mediaData.seasons
            ? `${mediaData.seasons} seasons`
            : `${mediaData.duration} minutes`}
        </p>
      </div>
      <p className={styles["plane__description"]}>{mediaData.description}</p>
      <div className={styles["plane__controlls"]}>
        <button
          onClick={() =>
            navigator(
              `/stream/${mediaData.seasons ? "series" : "movie"}:${
                mediaData.id
              }`
            )
          }
        >
          <img src={playSrc} alt="Play Button" />
          Watch Now
        </button>
      </div>
    </section>
  );
};

export default FavoritesPreview;
