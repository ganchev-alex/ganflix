import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import { RootState } from "../../../store/store";
import { IGeneralMovieDataRes } from "../../../utility/interfaces/movies-responses";
import { popUpNotification } from "../../../store/ui";
import {
  resetDeletedMovieValues,
  setDeletedTitleSearch,
  setDeleteMovieData,
} from "../../../store/movie-manager";

import styles from "../settings.module.scss";

const DeleteMovie: React.FC = function () {
  const dispatch = useDispatch();
  const { titleSearch, movieData } = useSelector(
    (state: RootState) => state.movieManager.deleteMovie
  );

  const findMovie = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/movies/get-by-title?keywords=${titleSearch}`
      );

      const responseData: IGeneralMovieDataRes = await response.json();
      if (response.ok) {
        dispatch(
          setDeleteMovieData({
            id: responseData.movie.id,
            title: responseData.movie.title,
            description: responseData.movie.description,
            duration: responseData.movie.duration,
            release_date: responseData.movie.release_date,
          })
        );
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

  const deleteMovie = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/movies/delete-movie?id=${movieData.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: "Movie was deleted successfully.",
          })
        );
        dispatch(resetDeletedMovieValues());
      } else {
        dispatch(
          popUpNotification({
            emoji: "🍆",
            statusCode: response.status,
            message: "Couldn't delete the movie.",
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
          message: "Client Side Error. Couldn't delete the movie.",
        })
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Delete Movie</h3>
      <span className={styles.row} style={{ marginBottom: "2.5rem" }}>
        <CustomInput
          label="Search for the movie by title"
          type="text"
          onChange={(e: any) => dispatch(setDeletedTitleSearch(e))}
          value={titleSearch}
          width={85}
        />
        <button className={styles["search-button"]} onClick={findMovie}>
          Search
        </button>
      </span>
      {movieData.id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          key={movieData.id}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CustomTextArea
            label="Deleted Data"
            onChange={(e: any) => {}}
            value={Object.entries(movieData)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")}
            readonly
          />
          <div className={styles.buttons}>
            <button
              className={styles["buttons__clear"]}
              onClick={() => dispatch(resetDeletedMovieValues())}
            >
              Clear
            </button>
            <button className={styles["buttons__add"]} onClick={deleteMovie}>
              Delete Movie
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default DeleteMovie;
