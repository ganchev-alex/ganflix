import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./CarouselSlot.module.scss";
import playSrc from "../../../assets/svgs/play.svg";

import { IGeneralRecord } from "../../../utility/interfaces/explore-responses";

const CarouselSlot: React.FC<{
  mediaData: IGeneralRecord;
}> = function ({ mediaData }) {
  const navigator = useNavigate();

  return (
    <motion.section
      key={mediaData.id}
      initial={{ x: 70 }}
      animate={{ x: 0 }}
      transition={{
        duration: 0.5,
        ease: "backOut",
      }}
      className={styles.plane}
    >
      <h3 className={styles["plane__subtitle"]}>Top Selection</h3>
      <h2 className={styles["plane__title"]}>{mediaData.title}</h2>
      <div className={styles["plane__attributes"]}>
        {mediaData.Genres.slice(0, 4).map((g) => (
          <p key={g.genre}>{g.genre}</p>
        ))}
        <p>
          {mediaData.seasons
            ? mediaData.seasons + ` season${mediaData.seasons === 1 ? "" : "s"}`
            : mediaData.duration + " minutes"}
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
    </motion.section>
  );
};

export default CarouselSlot;
