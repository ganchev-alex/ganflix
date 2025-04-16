import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import {
  resetUpdatedSeriesValues,
  setFetchedUpdatedSeriesData,
  setUpdatedTitleSearch,
  setUpdatedSeriesDescription,
  setUpdatedSeriesGenre,
  setUpdatedSeriesReleaseDate,
  setUpdatedSeriesSeasons,
  setUpdatedSeriesTitle,
} from "../../../store/series-manager";
import { RootState } from "../../../store/store";
import {
  IGenre,
  IGetGenres,
} from "../../../utility/interfaces/genres-responses";

import styles from "../settings.module.scss";
import { IGeneralSeriesRes } from "../../../utility/interfaces/series-responses";
import { popUpNotification } from "../../../store/ui";

const UpdateSeries: React.FC = function () {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState<IGenre[]>([]);
  const { titleSearch, updatedPayload } = useSelector(
    (state: RootState) => state.seriesManager.updateSeries
  );

  const {
    id,
    title,
    description,
    seasons,
    release_date,
    genres: selectedGenres,
  } = updatedPayload;

  const getGenres = async function () {
    try {
      const response = await fetch(`http://localhost:8080/genres/get-genres`);
      if (response.ok) {
        const resData: IGetGenres = await response.json();
        setGenres(resData.genres);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't fetch genres database.\nError Details: \n",
        error
      );
    }
  };

  const findSeries = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/get-by-title?keywords=${titleSearch}`
      );

      const responseData: IGeneralSeriesRes = await response.json();
      if (response.ok) {
        dispatch(setFetchedUpdatedSeriesData(responseData));
      } else {
        dispatch(
          popUpNotification({
            emoji: "😶‍🌫️",
            statusCode: response.status,
            message: "No such series were found.",
          })
        );
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't request a search for the series.\nError Details: \n",
        error
      );
      dispatch(
        popUpNotification({
          emoji: "😵‍💫",
          statusCode: 400,
          message: "Client Side Error. Couldn't search for the series.",
        })
      );
    }
  };

  const updateSeries = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/update-series`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload),
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: "Series were updated sucessfully!",
          })
        );
        dispatch(resetUpdatedSeriesValues());
      } else {
        dispatch(
          popUpNotification({
            emoji: "🍆",
            statusCode: response.status,
            message: responseData.message,
          })
        );
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't request a search for the series.\nError Details: \n",
        error
      );
      dispatch(
        popUpNotification({
          emoji: "😵‍💫",
          statusCode: 400,
          message: "Client Side Error. Couldn't update for the series.",
        })
      );
    }
  };

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <section className={styles.wrapper}>
      <h3>Update Series</h3>
      <span className={styles.row} style={{ marginBottom: "2.5em" }}>
        <CustomInput
          label="Search for the series by title"
          type="text"
          onChange={(e: any) => dispatch(setUpdatedTitleSearch(e))}
          value={titleSearch}
          width={85}
        />
        <button className={styles["search-button"]} onClick={findSeries}>
          Search
        </button>
      </span>
      {id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          key={id}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CustomInput
            label="Series Title"
            type="text"
            onChange={(e: any) => dispatch(setUpdatedSeriesTitle(e))}
            value={title}
          />
          <CustomTextArea
            label="Description"
            onChange={(e: any) => dispatch(setUpdatedSeriesDescription(e))}
            value={description}
          />
          <span className={styles.row}>
            <CustomInput
              label="Seasons"
              type="number"
              width={15}
              onChange={(e: any) => dispatch(setUpdatedSeriesSeasons(e))}
              value={seasons}
            />
            <CustomInput
              label="Release Date"
              type="date"
              width={30}
              onChange={(e: any) => dispatch(setUpdatedSeriesReleaseDate(e))}
              value={release_date.split("T")[0]}
            />
            <div
              style={{
                width: "30%",
              }}
            />
          </span>
          <div className={styles.genres}>
            <label className={styles["genres__label"]}>Genres</label>
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`${styles["genres__genre"]} ${
                  selectedGenres.includes(genre.id)
                    ? styles["genres__genre--active"]
                    : styles["genres__genre--disabled"]
                }`}
                onClick={() => dispatch(setUpdatedSeriesGenre(genre.id))}
              >
                {genre.genre}
              </button>
            ))}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles["buttons__clear"]}
              onClick={() => dispatch(resetUpdatedSeriesValues())}
            >
              Clear
            </button>
            <button
              className={styles["buttons__add"]}
              onClick={updateSeries}
              style={{
                opacity:
                  title === "" ||
                  description === "" ||
                  seasons === 0 ||
                  release_date === ""
                    ? 0.5
                    : 1,
              }}
              disabled={
                title === "" ||
                description === "" ||
                seasons === 0 ||
                release_date === ""
              }
            >
              Update Movie
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default UpdateSeries;
