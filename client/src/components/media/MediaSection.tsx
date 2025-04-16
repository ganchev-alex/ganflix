import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Wishlist from "./wishlist/Wishlist";
import Shelf from "../shared/Shelf";

import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

import styles from "./MediaSection.module.scss";
import Collections from "./collections/Collections";
import Favorites from "./favorites/Favorites";

const MediaSection: React.FC = function () {
  const location = useLocation();
  const hubType = location.pathname.includes("movies") ? "movies" : "series";
  const [favoritesSelection, setFavoritesSelection] = useState<
    IGeneralRecord[]
  >([]);
  const [titlesYouLoved, setTitlesYouLoved] = useState<IGeneralRecord[]>([]);
  const [randomizedSelection, setRandomizedSelection] = useState<
    IGeneralRecord[]
  >([]);
  const [lovedLoadingState, setLovedLoadingState] = useState(false);
  const [randomizedLoadingState, setRandomizedLoadingState] = useState(false);

  const getTitlesYouLoved = async function () {
    try {
      setLovedLoadingState(true);
      const response = await fetch(
        "http://localhost:8080/explore/titles-loved",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: hubType,
            rating: 7.5,
            exclusiveIds: favoritesSelection.map((record) => record.id),
          }),
        }
      );

      const responseData: { message: string; records: IGeneralRecord[] } =
        await response.json();
      if (response.ok) {
        setTitlesYouLoved(responseData.records);
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(
        "Client error. Couldn't load the section title you have loved. Error details: ",
        error
      );
    } finally {
      setLovedLoadingState(false);
    }
  };

  const getRandomizedSelection = async function () {
    try {
      setRandomizedLoadingState(true);
      const response = await fetch("http://localhost:8080/explore/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: hubType,
          limit: 15,
        }),
      });

      const responseData: {
        message: string;
        records: IGeneralRecord[];
      } = await response.json();
      console.log(responseData);
      if (response.ok) {
        setRandomizedSelection(responseData.records);
      } else {
        setRandomizedSelection([]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't retrieve the randomized selection.\nError Details: \n",
        error
      );
    } finally {
      setRandomizedLoadingState(false);
    }
  };

  useEffect(() => {
    getTitlesYouLoved();
    getRandomizedSelection();
  }, [hubType]);

  return (
    <>
      <Wishlist />
      <div className={styles.shelf}>
        <Shelf
          sectionTitle="Wishlist Selection"
          reqProperties={{
            listingId: "dc675045-7c1f-4693-8712-b9e53ff3cc6b",
            type: hubType,
            limit: 16,
          }}
        />
      </div>
      <Collections />
      <Shelf
        sectionTitle="Rewind: Re-watch List"
        reqProperties={{
          listingId: "e50b9871-6a3f-4c59-895d-8f8064d23e52",
          type: hubType,
          limit: 16,
        }}
      />
      <Favorites
        hubType={hubType}
        favoritesSelection={favoritesSelection}
        setFavoritesSelection={setFavoritesSelection}
      />
      <Shelf
        sectionTitle="Titles You've Loved"
        preFetchedData={titlesYouLoved}
        externalLoadingState={lovedLoadingState}
      />
      <Shelf
        sectionTitle="Random Selection"
        preFetchedData={randomizedSelection}
        externalLoadingState={randomizedLoadingState}
      />
    </>
  );
};

export default MediaSection;
