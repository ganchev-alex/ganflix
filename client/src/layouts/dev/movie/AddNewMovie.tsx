import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMovieGenre,
  resetNewMovieValues,
  setNewMovieBgSubtitles,
  setNewMovieDescription,
  setNewMovieDuration,
  setNewMovieEnSubtitles,
  setNewMovieTitle,
  setNewReleaseDate,
} from "../../../store/movie-manager";
import { popUpNotification } from "../../../store/ui";
import { IGeneralMovieDataRes } from "../../../utility/interfaces/movies-responses";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import {
  IGenre,
  IGetGenres,
} from "../../../utility/interfaces/genres-responses";
import { RootState } from "../../../store/store";

import styles from "../settings.module.scss";

const AddNewMovie: React.FC = function () {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState<IGenre[]>([]);
  const newMoviePayload = useSelector(
    (state: RootState) => state.movieManager.addNewMovie
  );

  const {
    title,
    description,
    duration,
    release_date,
    genres: selectedGenres,
  } = newMoviePayload;

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

  const addNewMovie = async function () {
    try {
      const response = await fetch("http://localhost:8080/movies/add-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMoviePayload),
      });

      const resData: IGeneralMovieDataRes = await response.json();
      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: resData.message,
          })
        );
        dispatch(resetNewMovieValues());
      } else {
        dispatch(
          popUpNotification({
            emoji: "🍆",
            statusCode: response.status,
            message: resData.message + " Check the console for more details.",
          })
        );
        console.log(resData);
      }
    } catch (error) {
      dispatch(
        popUpNotification({
          emoji: "😵‍💫",
          statusCode: 400,
          message: "Client Side Error. Check the console for more details.",
        })
      );
      console.log(
        "Client Error.\nCouldn't add the new movie.\nError Details: \n",
        error
      );
    }
  };

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <section className={styles.wrapper}>
      <h3>Add a Movie</h3>
      <CustomInput
        label="Movie Title"
        type="text"
        onChange={(e: any) => dispatch(setNewMovieTitle(e))}
        value={title}
      />
      <CustomTextArea
        label="Description"
        onChange={(e: any) => dispatch(setNewMovieDescription(e))}
        value={description}
      />
      <span className={styles.row}>
        <CustomInput
          label="Duration"
          type="number"
          width={15}
          onChange={(e: any) => dispatch(setNewMovieDuration(e))}
          value={duration}
        />
        <CustomInput
          label="Release Date"
          type="date"
          width={30}
          onChange={(e: any) => dispatch(setNewReleaseDate(e))}
          value={release_date}
        />
        <CustomInput
          label="English Subs"
          type="checkbox"
          width={20}
          onChange={(e: any) => dispatch(setNewMovieEnSubtitles(e))}
          value={undefined}
        />

        <CustomInput
          label="Bulgarian Subs"
          type="checkbox"
          width={20}
          onChange={(e: any) => dispatch(setNewMovieBgSubtitles(e))}
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
            onClick={() => dispatch(addNewMovieGenre(genre.id))}
          >
            {genre.genre}
          </button>
        ))}
      </div>
      <div className={styles.buttons}>
        <button
          className={styles["buttons__clear"]}
          onClick={() => dispatch(resetNewMovieValues())}
        >
          Clear
        </button>
        <button className={styles["buttons__add"]} onClick={addNewMovie}>
          Add Movie
        </button>
      </div>
    </section>
  );
};

export default AddNewMovie;
