import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import { RootState } from "../../../store/store";
import {
  IGenre,
  IGetGenres,
} from "../../../utility/interfaces/genres-responses";
import { IGeneralMovieDataRes } from "../../../utility/interfaces/movies-responses";
import {
  addUpdatedMovieGenre,
  resetUpdatedMovieValues,
  setFetchedUpdatedMovieData,
  setTitleSearch,
  setUpdatedMovieBgSubtitles,
  setUpdatedMovieDescription,
  setUpdatedMovieDuration,
  setUpdatedMovieEnSubtitles,
  setUpdatedMovieTitle,
  setUpdatedReleaseDate,
} from "../../../store/movie-manager";

import styles from "../settings.module.scss";
import { popUpNotification } from "../../../store/ui";

const UpdateMovie: React.FC = function () {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState<IGenre[]>([]);
  const { titleSearch, updatedPayload } = useSelector(
    (state: RootState) => state.movieManager.updateMovie
  );

  const {
    id,
    title,
    description,
    duration,
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

  const findMovie = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/movies/get-by-title?keywords=${titleSearch}`
      );

      const responseData: IGeneralMovieDataRes = await response.json();
      if (response.ok) {
        dispatch(setFetchedUpdatedMovieData(responseData));
      } else {
        dispatch(
          popUpNotification({
            emoji: "😶‍🌫️",
            statusCode: response.status,
            message: "No such movie was found.",
          })
        );
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't request a search for a movie.\nError Details: \n",
        error
      );
      dispatch(
        popUpNotification({
          emoji: "😵‍💫",
          statusCode: 400,
          message: "Client Side Error. Couldn't search for the movie.",
        })
      );
    }
  };

  const updateMovie = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/movies/update-movie`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: "Movie was updated sucessfully!",
          })
        );
        dispatch(resetUpdatedMovieValues());
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
        "Client Error.\nCouldn't request a search for a movie.\nError Details: \n",
        error
      );
      dispatch(
        popUpNotification({
          emoji: "😵‍💫",
          statusCode: 400,
          message: "Client Side Error. Couldn't update for the movie.",
        })
      );
    }
  };

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <section className={styles.wrapper}>
      <h3>Update a Movie</h3>
      <span className={styles.row} style={{ marginBottom: "2.5em" }}>
        <CustomInput
          label="Search for the movie by title"
          type="text"
          onChange={(e: any) => dispatch(setTitleSearch(e))}
          value={titleSearch}
          width={85}
        />
        <button className={styles["search-button"]} onClick={findMovie}>
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
            label="Movie Title"
            type="text"
            onChange={(e: any) => dispatch(setUpdatedMovieTitle(e))}
            value={title}
          />
          <CustomTextArea
            label="Description"
            onChange={(e: any) => dispatch(setUpdatedMovieDescription(e))}
            value={description}
          />
          <span className={styles.row}>
            <CustomInput
              label="Duration"
              type="number"
              width={15}
              onChange={(e: any) => dispatch(setUpdatedMovieDuration(e))}
              value={duration}
            />
            <CustomInput
              label="Release Date"
              type="date"
              width={30}
              onChange={(e: any) => dispatch(setUpdatedReleaseDate(e))}
              value={release_date.split("T")[0]}
            />
            <CustomInput
              label="English Subs"
              type="checkbox"
              width={20}
              onChange={(e: any) => dispatch(setUpdatedMovieEnSubtitles(e))}
              value={undefined}
            />

            <CustomInput
              label="Bulgarian Subs"
              type="checkbox"
              width={20}
              onChange={(e: any) => dispatch(setUpdatedMovieBgSubtitles(e))}
              value={undefined}
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
                onClick={() => dispatch(addUpdatedMovieGenre(genre.id))}
              >
                {genre.genre}
              </button>
            ))}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles["buttons__clear"]}
              onClick={() => dispatch(resetUpdatedMovieValues())}
            >
              Clear
            </button>
            <button
              className={styles["buttons__add"]}
              onClick={updateMovie}
              style={{
                opacity:
                  title === "" ||
                  description === "" ||
                  duration === 0 ||
                  release_date === ""
                    ? 0.5
                    : 1,
              }}
              disabled={
                title === "" ||
                description === "" ||
                duration === 0 ||
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

export default UpdateMovie;
