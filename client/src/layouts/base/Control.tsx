import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../store/store";

import ContinueWatching from "./ContinueWatching";
import { IListing } from "../../utility/interfaces/listings-responses";

import styles from "./Controls.module.scss";
import {
  IGeneralRecord,
  ILoadedEpsiode,
} from "../../utility/interfaces/explore-responses";
import { setCatalogue } from "../../store/catalogues";

const Controls: React.FC = function () {
  const dispatch = useDispatch();

  const [listings, setListings] = useState<IListing[]>([]);
  const [watching, setWatching] = useState<
    {
      mediaData: IGeneralRecord;
      resumeTime: number;
      episode?: ILoadedEpsiode;
    }[]
  >([]);
  const [listingLoadingState, setListingLoadingState] = useState(false);
  const [watchingLoadingState, setWatchingLoadingState] = useState(false);

  let backgroundColor = useSelector(
    (state: RootState) => state.comsetics.backlights.colorful
  ) as string;

  const classesConfiger = ({ isActive }: { isActive: boolean }) =>
    `${styles["controlls__link"]} ${
      isActive ? styles["controlls__link--active"] : ""
    }`;

  const getListings = async function () {
    try {
      setListingLoadingState(true);
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
    } finally {
      setListingLoadingState(false);
    }
  };

  const getCurrentlyWatching = async function () {
    try {
      setWatchingLoadingState(true);
      const response = await fetch("http://localhost:8080/state/watching");

      const responseData: {
        message: string;
        watching: {
          state_id: string;
          resume_time: number;
          Episode?: ILoadedEpsiode;
          Movie: IGeneralRecord;
          Series: IGeneralRecord;
        }[];
      } = await response.json();

      if (response.ok) {
        const prepData = responseData.watching
          .map((state) => {
            if (state.Movie) {
              return {
                mediaData: { ...state.Movie },
                resumeTime: state.resume_time,
              };
            }
            if (state.Series) {
              return {
                mediaData: { ...state.Series },
                resumeTime: state.resume_time,
                episode: state.Episode,
              };
            }
          })
          .filter((s) => s !== undefined);

        setWatching(
          prepData as {
            mediaData: IGeneralRecord;
            resumeTime: number;
            epsiode: ILoadedEpsiode;
          }[]
        );
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(
        "Couldn't load currently watching states. Error details: ",
        error
      );
    } finally {
      setWatchingLoadingState(false);
    }
  };

  const openCatalogue = function (catalogueId: string) {
    dispatch(setCatalogue({ catalogueKind: "listings", catalogueId }));
  };

  useEffect(() => {
    getListings();
    getCurrentlyWatching();
  }, []);

  return (
    <menu className={styles.controlls}>
      <h4 className={styles["controlls__title"]}>Listings</h4>
      <nav className={styles["controlls__nav"]}>
        {!listingLoadingState
          ? listings.map((set) => (
              <NavLink
                key={set.id}
                to={`catalogues/${set.name.toLowerCase()}`}
                className={classesConfiger}
                onClick={() => {
                  openCatalogue(set.id);
                }}
              >
                <img src={`http://localhost:8080${set.icon_src}`} />
                {set.name}
              </NavLink>
            ))
          : Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={styles["loading-slot"]}
                style={{ height: "25px", borderRadius: "7.5px" }}
              >
                <div className={styles["loading-slot__trigger"]} />
              </div>
            ))}
      </nav>
      <span className={styles["controlls__titleswrap"]}>
        <h4 className={styles["controlls__title"]}>Continue Watching</h4>
        <h5>Total {watching.length}</h5>
      </span>
      <section className={styles["controlls__slots"]}>
        {!watchingLoadingState ? (
          watching.length > 0 ? (
            watching.map((record) => (
              <ContinueWatching key={record.mediaData.id} slotData={record} />
            ))
          ) : (
            <div className={styles["loading-slot"]}>
              <div className={styles["loading-slot__trigger"]} />
            </div>
          )
        ) : (
          Array.from({ length: 2 }, (_, i) => (
            <div key={i} className={styles["loading-slot"]}>
              <div className={styles["loading-slot__trigger"]} />
            </div>
          ))
        )}
      </section>
      <motion.div
        className={styles["controlls__backlight"]}
        animate={{ backgroundColor }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </menu>
  );
};

export default Controls;
