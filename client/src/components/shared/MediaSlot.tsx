import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { IListing } from "../../utility/interfaces/listings-responses";
import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

import styles from "./MediaSlot.module.scss";
import playSrc from "../../assets/svgs/play.svg";
import plusSrc from "../../assets/svgs/plus.svg";

const MediaSlot: React.FC<{
  mediaData: IGeneralRecord;
  layoutMode: "carousel" | "grid";
  sectionBounds?: DOMRect | null;
  slotBounds?: DOMRect | null;
  positionDependency?: any;
}> = function ({
  mediaData,
  sectionBounds,
  slotBounds,
  layoutMode,
  positionDependency,
}) {
  const navigator = useNavigate();
  const slotRef = useRef<HTMLDivElement>(null);
  const [displayedRight, setDisplayedRight] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [listings, setListings] = useState<IListing[]>([]);
  const [previewListings, setPreviewListings] = useState(false);
  const [mediaListings, setMediaListings] = useState(mediaData.Listings);

  useEffect(() => {
    if (layoutMode === "carousel" && slotBounds && sectionBounds) {
      const spaceRight = sectionBounds.right - slotBounds.right;
      setDisplayedRight(spaceRight >= sectionBounds.width * 0.35);
    } else if (layoutMode === "grid" && slotRef.current) {
      const slotRect = slotRef.current.getBoundingClientRect();
      setDisplayedRight(
        window.innerWidth - slotRect.right >= window.innerWidth * 0.3
      );
    }
  }, [layoutMode, slotBounds, sectionBounds, positionDependency]);

  const handleSlotClick = () => {
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (isActive) {
      setIsActive(false);
      setPreviewListings(false);
    }
  };

  const getListings = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/listings/get-listings"
      );

      const responseData: { message: string; listings: IListing[] } =
        await response.json();
      if (response.ok) {
        setListings(responseData.listings);
      } else {
        console.log(responseData.message);
        setListings([]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't get listings.\nError Details: \n",
        error
      );
    }
  };

  const addToListing = async function (listingId: string, listingName: string) {
    try {
      const response = await fetch("http://localhost:8080/listings/add-to", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mediaData.seasons ? "series" : "movie",
          mediaId: mediaData.id,
          listingId,
        }),
      });

      if (response.ok) {
        setMediaListings((previousState) => [
          ...previousState,
          { id: listingId, name: listingName },
        ]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't add the media to the listing.\nError Details: \n",
        error
      );
    }
  };

  const removeFromListing = async function (listingId: string) {
    try {
      const response = await fetch(
        "http://localhost:8080/listings/remove-from",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: mediaData.seasons ? "series" : "movie",
            mediaId: mediaData.id,
            listingId,
          }),
        }
      );

      if (response.ok) {
        setMediaListings((previousState) =>
          previousState.filter((l) => l.id !== listingId)
        );
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't add the media to the listing.\nError Details: \n",
        error
      );
    }
  };

  const listingHandler = async function (
    listingId: string,
    listingName: string
  ) {
    if (mediaListings.some((l) => l.id === listingId)) {
      removeFromListing(listingId);
    } else {
      addToListing(listingId, listingName);
    }
  };

  return (
    <div
      className={styles.container}
      ref={slotRef}
      onClick={handleSlotClick}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={styles.slot}
        initial={{ scale: 1 }}
        animate={{
          scale: isActive ? 1.05 : 1,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
          },
        }}
        whileHover={{
          scale: 1.07,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
          },
        }}
        whileTap={{
          scale: 0.95,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <img
          className={styles["slot__poster"]}
          src={`http://localhost:8080${mediaData.poster_src}`}
          alt={`${mediaData.title} Poster`}
          draggable={false}
          loading="lazy"
        />
      </motion.div>
      {isActive && (
        <div
          className={styles["details__bridge"]}
          style={displayedRight ? { right: "-15px" } : { left: "-15px" }}
        />
      )}
      {isActive && (
        <motion.div
          className={`${styles["details"]} ${
            displayedRight ? styles["details--right"] : styles["details--left"]
          }`}
          initial={{
            opacity: 0,
            x: displayedRight ? -50 : 50,
            y: "-50%",
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: "-50%",
            zIndex: 15,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.3,
          }}
        >
          <img
            className={styles["details__thumb"]}
            src={`http://localhost:8080${mediaData.thumb_src}`}
            alt={`${mediaData.title} Thumb`}
            draggable={false}
            loading="lazy"
          />
          <h6 className={styles["details__title"]}>{mediaData.title}</h6>
          <div className={styles["details__tags"]}>
            {mediaData.Genres.slice(0, 3).map((g) => (
              <p key={g.genre}>{g.genre}</p>
            ))}
          </div>
          <p className={styles["details__data"]}>
            <span>Type: </span> {mediaData.seasons ? "Series" : "Movie"}
          </p>
          <p className={styles["details__data"]}>
            <span>Release Date: </span>
            {new Date(mediaData.release_date).getFullYear()}
          </p>
          <p className={styles["details__data"]}>
            <span>Listings: </span>
            {mediaListings.length > 0
              ? mediaListings
                  .slice(0, 2)
                  .map((l) => l.name)
                  .join(", ")
              : "None"}
          </p>
          <menu className={styles["details__controls"]}>
            <button
              onClick={() => {
                navigator(
                  `/stream/${mediaData.seasons ? "series" : "movie"}:${
                    mediaData.id
                  }`
                );
              }}
            >
              <img src={playSrc} />
              Watch Now
            </button>
            <button
              onClick={async () => {
                await getListings();
                setPreviewListings(true);
              }}
            >
              <img src={plusSrc} />
            </button>
          </menu>
          {previewListings && (
            <div className={styles.listings}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles["listings__filter"]}
                onClick={() => setPreviewListings(false)}
              />
              {listings.map((list) => (
                <motion.button
                  key={list.id}
                  initial={{ y: 1.5 }}
                  animate={{ y: 0 }}
                  className={
                    mediaListings.some((l) => l.id === list.id)
                      ? styles["listings--active"]
                      : styles["listings--disabled"]
                  }
                  onClick={() => listingHandler(list.id, list.name)}
                >
                  <img src={`http://localhost:8080${list.icon_src}`} />
                  {list.name}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MediaSlot;
