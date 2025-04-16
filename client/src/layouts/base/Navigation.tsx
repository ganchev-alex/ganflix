import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useEffect } from "react";

import { setColorfulBacklight } from "../../store/cosmetics";

import styles from "./Navigation.module.scss";
import homeSrc from "../../assets/svgs/home.svg";
import exploreSrc from "../../assets/svgs/search.svg";
import moviesSrc from "../../assets/svgs/movies.svg";
import tvSrc from "../../assets/svgs/tv_series.svg";
import { resetFiltering } from "../../store/explore";

const linkSets = [
  {
    path: "/",
    label: "Home",
    iconSrc: homeSrc,
    light: "#ffe799",
  },
  {
    path: "/explore",
    label: "Explore",
    iconSrc: exploreSrc,
    light: "#3bceac",
  },
  {
    path: "/movies",
    label: "Movies",
    iconSrc: moviesSrc,
    light: "#ec325a",
  },
  {
    path: "/series",
    label: "Series",
    iconSrc: tvSrc,
    light: "#701192",
  },
];

const Navigation: React.FC<{ customBacklight?: string }> = function ({
  customBacklight,
}) {
  const location = useLocation();
  const dispatch = useDispatch();

  const classesConfiger = ({ isActive }: { isActive: boolean }) =>
    `${styles["navigation__link"]} ${
      isActive ? styles["navigation__link--active"] : ""
    }`;
  const currentLink = linkSets.find((set) => set.path === location.pathname);
  const backgroundColor = currentLink ? currentLink.light : "#ffe799";

  useEffect(() => {
    dispatch(setColorfulBacklight(backgroundColor));
  }, [backgroundColor, dispatch]);

  useEffect(() => {
    dispatch(resetFiltering());
  }, [location]);

  return (
    <nav className={styles.navigation}>
      {linkSets.map((set) => (
        <NavLink key={set.light} to={set.path} className={classesConfiger}>
          <img src={set.iconSrc} />
          {set.label}
        </NavLink>
      ))}
      <motion.div
        className={styles["navigation__light"]}
        style={
          customBacklight
            ? {
                filter: "blur(30px)",
                opacity: 0.5,
              }
            : {}
        }
        animate={
          customBacklight
            ? {
                backgroundImage: `url(http://localhost:8080${customBacklight})`,
              }
            : { backgroundColor }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </nav>
  );
};

export default Navigation;
