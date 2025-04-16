import { ILoadedRecord } from "../../../utility/interfaces/explore-responses";

import styles from "./Details.module.scss";

const Details: React.FC<{ mediaData: ILoadedRecord }> = function ({
  mediaData,
}) {
  return (
    <section className={styles.details}>
      <img
        className={styles["details__poster"]}
        src={`http://localhost:8080${mediaData.poster_src}`}
      />
      <div className={styles["details__genres"]}>
        {mediaData.Genres.map((g) => (
          <span key={g.id}>{g.genre}</span>
        ))}
      </div>
      <p className={styles["details__params"]}>
        {mediaData.seasons ? (
          <>
            <span>Seasons: </span> {mediaData.seasons}{" "}
          </>
        ) : (
          <>
            <span>Duration:</span> {mediaData.duration} minutes
          </>
        )}
      </p>
      <p className={styles["details__params"]}>
        <span>Released Date:</span>{" "}
        {new Date(mediaData.release_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p className={styles["details__description"]}>{mediaData.description}</p>
    </section>
  );
};

export default Details;
