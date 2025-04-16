import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import CarouselSlot from "./CarouselSlot";
import GalleryController from "./GalleryControler";

import styles from "./Wishlist.module.scss";
import picSrc from "../../../assets/images/profile.jpg";
import logoSrc from "../../../assets/images/logo.png";
import settingsSrc from "../../../assets/images/settings.png";
import { changeDevVisibility } from "../../../store/ui";
import { IGeneralRecord } from "../../../utility/interfaces/explore-responses";

const Wishlist: React.FC = function () {
  const location = useLocation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [topSelection, setTopSelection] = useState<IGeneralRecord[]>([]);
  const [loadingState, setLoadingState] = useState(false);

  const getTopSelection = async function () {
    try {
      setLoadingState(true);
      const response = await fetch(
        `http://localhost:8080/explore/top-selection?type=${
          location.pathname.includes("movies") ? "movie" : "series"
        }&limit=${5}`
      );

      const responseData: { message: string; topSelection: IGeneralRecord[] } =
        await response.json();
      if (response.ok) {
        setTopSelection(responseData.topSelection);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't add the media to the listing.\nError Details: \n",
        error
      );
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    getTopSelection();
    setIndex(0);
  }, [location.pathname]);

  return (
    <>
      {!loadingState && topSelection.length > 0 ? (
        <header
          className={styles.base}
          style={{
            backgroundImage: `url(http://localhost:8080${
              topSelection[
                (index - 1 + topSelection.length) % topSelection.length
              ].thumb_src
            })`,
          }}
        >
          <div className={styles["base__ribbon"]}>
            <div className={styles["base__logo"]}>
              <img src={logoSrc} alt="Ganflix Logo" />
              <p>
                {location.pathname.includes("movies") ? "Movies" : "Series"} Hub
              </p>
            </div>
            <span className={styles["base__profile"]}>
              <button onClick={() => dispatch(changeDevVisibility(true))}>
                <img src={settingsSrc} />
              </button>
              <img src={picSrc} />
            </span>
          </div>
          <motion.img
            key={index}
            initial={{ x: 35 }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.5,
              ease: "backOut",
            }}
            src={`http://localhost:8080${topSelection[index].thumb_src}`}
            className={styles["base__thumb"]}
          />
          <div className={styles["base__filter"]} />
          <CarouselSlot mediaData={topSelection[index]} />
          <GalleryController
            thumbs={topSelection.map((set) => set.thumb_src)}
            setMainIndex={setIndex}
          />
          <div className={styles["base__transition"]} />
        </header>
      ) : (
        <header className={styles.base}>
          <div className={styles["base__ribbon"]}>
            <div className={styles["base__logo"]}>
              <img src={logoSrc} alt="Ganflix Logo" />
              <p>
                {location.pathname.includes("movies") ? "Movies" : "Series"} Hub
              </p>
            </div>
            <span className={styles["base__profile"]}>
              <button onClick={() => dispatch(changeDevVisibility(true))}>
                <img src={settingsSrc} />
              </button>
              <img src={picSrc} />
            </span>
          </div>
          <div className={styles["loading-plane"]}>
            <aside className={styles["skeleton"]}>
              <div className={styles["skeleton__title"]}>
                <span className={styles["loading-plane__trigger"]} />
              </div>
              <div className={styles["skeleton__attributes"]}>
                <span className={styles["loading-plane__trigger"]} />
              </div>
              <div className={styles["skeleton__description"]}>
                <span className={styles["loading-plane__trigger"]} />
              </div>
            </aside>
            <div className={styles["skeleton__gallery"]}>
              <div className={styles["skeleton__slot"]}>
                <span className={styles["loading-plane__trigger"]} />
              </div>
              <div className={styles["skeleton__slot"]}>
                <span className={styles["loading-plane__trigger"]} />
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Wishlist;
