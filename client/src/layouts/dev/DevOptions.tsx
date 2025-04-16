import { useDispatch, useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { RootState } from "../../store/store";
import { changeDevVisibility } from "../../store/ui";

import MovieOptions from "./movie/MovieOptions";
import SeriesOptions from "./series/SeriesOptions";
import GenresOptions from "./genres/GenresOptions";
import CataloguesOptions from "./catalogues/CataloguesOptions";
import Notification from "./Notifaction";

import styles from "./DevOptions.module.scss";
import movieIcon from "../../assets/svgs/movies.svg";
import seriesIcon from "../../assets/svgs/tv_series.svg";
import categoriesIcon from "../../assets/svgs/favorites.svg";
import cataloguesIcon from "../../assets/svgs/wishlist.svg";

const settingsHubs: {
  title: string;
  color: string;
  icon: any;
  state: "movie" | "series" | "genres" | "catalogues";
}[] = [
  {
    title: "Movie Management",
    color: "#ec325a",
    icon: movieIcon,
    state: "movie",
  },
  {
    title: "Series Management",
    color: "#701192",
    icon: seriesIcon,
    state: "series",
  },
  {
    title: "Collections",
    color: "#3bceac",
    icon: cataloguesIcon,
    state: "catalogues",
  },
  {
    title: "Genres",
    color: "#ffe799",
    icon: categoriesIcon,
    state: "genres",
  },
];

const modalVariants = {
  hidden: { opacity: 0, y: "0%", x: "-50%" },
  visible: { opacity: 1, y: "-50%", x: "-50%" },
};

const Backdrop: React.FC = function () {
  const disatch = useDispatch();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      className={styles.backdrop}
      onClick={() => disatch(changeDevVisibility(false))}
    />
  );
};

const DevOption: React.FC = function () {
  const [selectedHub, setSelectedHub] = useState<
    "movie" | "series" | "genres" | "catalogues"
  >("movie");
  const [backgroundColor, setBackGroundColor] = useState("#ec325a");
  const { statusCode } = useSelector(
    (state: RootState) => state.ui.notification
  );

  return (
    <motion.menu
      className={styles.dev}
      key={"dev_options"}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.5, 1] }}
      variants={modalVariants}
    >
      <aside className={styles["dev__nav"]}>
        <h4>Settings Hub</h4>
        {settingsHubs.map((hub) => (
          <button
            key={hub.title}
            style={
              selectedHub === hub.state ? { backgroundColor: hub.color } : {}
            }
            onClick={() => {
              setSelectedHub(hub.state);
              setBackGroundColor(hub.color);
            }}
            className={`${styles["dev__hubs"]} ${
              selectedHub === hub.state ? styles["dev__hubs--active"] : ""
            }`}
          >
            <img src={hub.icon} />
            {hub.title}
          </button>
        ))}
        <motion.div
          className={styles["dev__backlight--nav"]}
          animate={{ backgroundColor }}
        />
      </aside>
      <main className={styles["dev__main"]}>
        {selectedHub === "movie" && <MovieOptions />}
        {selectedHub === "series" && <SeriesOptions />}
        {selectedHub === "genres" && <GenresOptions />}
        {selectedHub === "catalogues" && <CataloguesOptions />}
      </main>
      {statusCode != 0 && <Notification />}
      <motion.div
        className={styles["dev__backlight--main"]}
        animate={{ backgroundColor }}
      />
    </motion.menu>
  );
};

const DevOptionsModal: React.FC = function () {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop />,
        document.getElementById("dev") as any
      )}
      {ReactDOM.createPortal(
        <DevOption />,
        document.getElementById("dev") as any
      )}
    </>
  );
};

export default DevOptionsModal;
