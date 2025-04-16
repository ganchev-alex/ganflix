import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./Ratings.module.scss";
import {
  ICollection,
  IListing,
} from "../../../utility/interfaces/listings-responses";
import { ILoadedRecord } from "../../../utility/interfaces/explore-responses";

const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, y: 5, transition: { duration: 0.16 } },
};

const Ratings: React.FC<{
  mediaData: ILoadedRecord;
  ratingValue: number;
  onRatingChange: (value: any) => any;
}> = function ({ mediaData, ratingValue, onRatingChange }) {
  const { indicator } = useParams();
  const [type, id] = (indicator as string).split(":");

  const [color, setColor] = useState("#5D4A66");

  const [listings, setListings] = useState<IListing[]>([]);
  const [mediaListings, setMediaListings] = useState<
    { id: string; name: string }[]
  >(mediaData.Listings);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [mediaCollection, setMediaCollection] = useState<
    { id: string; name: string }[]
  >(mediaData.Collections);
  const [selectedOptions, setSelectedOptions] = useState<{
    type: "listings" | "collections";
    options: IListing[] | ICollection[];
  }>({ type: "collections", options: [] });

  const getListings = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/listings/get-listings"
      );
      const responseData: { message: string; listings: IListing[] } =
        await response.json();
      if (response.ok) {
        setListings(responseData.listings);
      }
    } catch (error) {
      console.log("Couldn't retrieve listings. Error details: ", error);
    }
  };

  const getCollections = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/collections/get-collections"
      );
      const responseData: { message: string; collections: ICollection[] } =
        await response.json();
      if (response.ok) {
        setCollections(responseData.collections);
        if (type === "movie") {
          setSelectedOptions({
            type: "collections",
            options: responseData.collections,
          });
        }
      }
    } catch (error) {
      console.log("Couldn't retrieve collctions. Error details: ", error);
    }
  };

  const presentOptions = function (
    type: "listings" | "collections",
    options: ICollection[] | IListing[]
  ) {
    if (selectedOptions.options[0] == options[0]) {
      setSelectedOptions({ type: "collections", options: [] });
    } else {
      setSelectedOptions({ type, options });
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

  const addToCollection = async function (
    collectionId: string,
    collectionName: string
  ) {
    try {
      const response = await fetch("http://localhost:8080/collections/add-to", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mediaData.seasons ? "series" : "movie",
          mediaId: mediaData.id,
          collectionId,
        }),
      });

      if (response.ok) {
        setMediaCollection((previousState) => [
          ...previousState,
          { id: collectionId, name: collectionName },
        ]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't add the media to the collection.\nError Details: \n",
        error
      );
    }
  };

  const removeFromCollection = async function (collectionId: string) {
    try {
      const response = await fetch(
        "http://localhost:8080/collections/remove-from",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: mediaData.seasons ? "series" : "movie",
            mediaId: mediaData.id,
            collectionId,
          }),
        }
      );

      if (response.ok) {
        setMediaCollection((previousState) =>
          previousState.filter((l) => l.id !== collectionId)
        );
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't add the media to the collection.\nError Details: \n",
        error
      );
    }
  };

  const listingHandler = async function (
    optionsType: "listings" | "collections",
    id: string,
    name: string
  ) {
    if (optionsType === "listings") {
      if (mediaListings.some((l) => l.id === id)) {
        removeFromListing(id);
      } else {
        addToListing(id, name);
      }
    }

    if (optionsType === "collections") {
      if (mediaCollection.some((c) => c.id === id)) {
        removeFromCollection(id);
      } else {
        addToCollection(id, name);
      }
    }
  };

  useEffect(() => {
    if (ratingValue >= 0 && ratingValue <= 2) {
      setColor("#5D4A66");
    } else if (ratingValue > 2 && ratingValue <= 4) {
      setColor("#6A5D7B");
    } else if (ratingValue > 4 && ratingValue <= 6) {
      setColor("#749C75");
    } else if (ratingValue > 6 && ratingValue <= 8) {
      setColor("#B2BD7E");
    } else if (ratingValue > 8) {
      setColor("#E9D985");
    }
  }, [ratingValue]);

  useEffect(() => {
    getListings();
    getCollections();
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles["wrapper__rating"]}>
        <motion.input
          type="number"
          step={0.1}
          min={0}
          max={10}
          value={ratingValue}
          onChange={(e) => onRatingChange(Number.parseFloat(e.target.value))}
          animate={{ backgroundColor: color }}
          placeholder="0"
        />
        <p>⭐</p>
      </div>
      <div className={styles["wrapper__adding"]}>
        <button onClick={() => presentOptions("collections", collections)}>
          Collections
        </button>
        <button onClick={() => presentOptions("listings", listings)}>
          Listings
        </button>
      </div>
      <AnimatePresence>
        {selectedOptions.options.length > 0 && (
          <motion.ul
            className={styles["wrapper__list"]}
            key="lists"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            {selectedOptions.options.map((set) => (
              <li
                className={`${
                  (selectedOptions.type === "listings"
                    ? mediaListings
                    : mediaCollection
                  ).some((l) => l.id === set.id)
                    ? styles["wrapper__list--active"]
                    : ""
                }`}
                key={set.id}
                onClick={() =>
                  listingHandler(selectedOptions.type, set.id, set.name)
                }
              >
                <img src={`http://localhost:8080${set.icon_src}`} />
                {set.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Ratings;
