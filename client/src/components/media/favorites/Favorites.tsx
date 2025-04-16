import { act, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { IGeneralRecord } from "../../../utility/interfaces/explore-responses";

import FavoritesDeck from "./FavoritesDeck";
import FavoritesPreview from "./FavoritesPreview";

import styles from "./Favorites.module.scss";

const Favorites: React.FC<{
  hubType: "movies" | "series";
  favoritesSelection: IGeneralRecord[];
  setFavoritesSelection: (values: any) => any;
}> = function ({ hubType, favoritesSelection, setFavoritesSelection }) {
  const [loadingState, setLoadingState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadFavoriteSelection = async function () {
    try {
      setLoadingState(true);
      const response = await fetch("http://localhost:8080/explore/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: "5473d2da-b919-4a68-83ef-006809c38735",
          type: hubType,
          limit: 10,
        }),
      });

      const reponseData: {
        message: string;
        shelf: {
          Movie: IGeneralRecord | null;
          Series: IGeneralRecord | null;
        }[];
      } = await response.json();
      if (response.ok) {
        const records = reponseData.shelf
          .map((record) => {
            if (record.Movie) {
              return { ...record.Movie };
            } else if (record.Series) {
              return { ...record.Series };
            }
          })
          .filter((r) => r != undefined || r != null);

        if (records) {
          setFavoritesSelection(records as IGeneralRecord[]);
        }
      } else {
        console.log(reponseData.message);
        setFavoritesSelection([]);
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
    loadFavoriteSelection();
    setActiveIndex(0);
  }, [hubType]);

  return (
    <header className={styles.base}>
      {favoritesSelection.length > 0 && !loadingState ? (
        <>
          <AnimatePresence>
            <motion.img
              className={styles["base__backlight"]}
              src={`http://localhost:8080${favoritesSelection[activeIndex].thumb_src}`}
              key={favoritesSelection[activeIndex].id}
              initial={{
                opacity: 0,
                scale: 0.95,
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
              }}
              animate={{
                opacity: 0.9,
                scale: 1,
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
              }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
          <FavoritesPreview mediaData={favoritesSelection[activeIndex]} />
          <FavoritesDeck
            favoritesSelection={favoritesSelection}
            onChangeActiveIndex={setActiveIndex}
          />
        </>
      ) : (
        <></>
      )}
    </header>
  );
};

export default Favorites;
