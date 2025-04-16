import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store/store";
import {
  setNewEpisodeBgSubtitles,
  setNewEpisodeEnSubtitles,
  setNewEpisodeEpisodeNum,
  setNewEpisodeTitle,
  setNewSeriesGenre,
  setNewSeriesDescription,
  setNewSeriesReleaseDate,
  setNewSeriesSeasons,
  setNewSeriesTitle,
  addToEpisodePayload,
  setNewEpisodeSeason,
  removeFromEpisodePayload,
  resetNewSeriesData,
  setNewEpisodeDuration,
} from "../../../store/series-manager";
import { popUpNotification } from "../../../store/ui";
import {
  IGenre,
  IGetGenres,
} from "../../../utility/interfaces/genres-responses";
import { IGeneralSeriesRes } from "../../../utility/interfaces/series-responses";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import styles from "../settings.module.scss";

const AddNewSeries: React.FC = function () {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState<IGenre[]>([]);
  const { episodesPayload, seriesData, addNewEpisode } = useSelector(
    (state: RootState) => state.seriesManager.addNewSeries
  );

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

  const addNewSeries = async function () {
    try {
      const response = await fetch("http://localhost:8080/series/add-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesData,
          episodesPayload,
        }),
      });

      const resData: IGeneralSeriesRes = await response.json();
      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: resData.message,
          })
        );
        dispatch(resetNewSeriesData());
      } else {
        dispatch(
          popUpNotification({
            emoji: "🍆",
            statusCode: response.status,
            message: resData.message,
          })
        );
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
      <h3>Add Series</h3>
      <CustomInput
        label="Series Title"
        type="text"
        onChange={(e: any) => dispatch(setNewSeriesTitle(e))}
        value={seriesData.title}
      />
      <CustomTextArea
        label="Description"
        onChange={(e: any) => dispatch(setNewSeriesDescription(e))}
        value={seriesData.description}
      />
      <span className={styles.row}>
        <CustomInput
          label="Seasons"
          type="number"
          width={15}
          onChange={(e: any) => dispatch(setNewSeriesSeasons(e))}
          value={seriesData.seasons}
        />
        <CustomInput
          label="Release Date"
          type="date"
          width={30}
          onChange={(e: any) => dispatch(setNewSeriesReleaseDate(e))}
          value={seriesData.release_date}
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
              seriesData.genres.includes(genre.id)
                ? styles["genres__genre--active"]
                : styles["genres__genre--disabled"]
            }`}
            onClick={() => dispatch(setNewSeriesGenre(genre.id))}
          >
            {genre.genre}
          </button>
        ))}
      </div>
      <h3 style={{ fontSize: "1.4rem", margin: "1.5em 0 -0.1em" }}>
        Add Episodes Payload (Optional)
      </h3>
      <div className={styles.row}>
        <CustomInput
          label="Season"
          type="number"
          onChange={(e: any) => dispatch(setNewEpisodeSeason(e))}
          value={addNewEpisode.season}
          width={9}
        />
        <CustomInput
          label="Episode"
          type="number"
          onChange={(e: any) => dispatch(setNewEpisodeEpisodeNum(e))}
          value={addNewEpisode.episode_num}
          width={9}
        />
        <CustomInput
          label="Episode Title"
          type="text"
          onChange={(e: any) => dispatch(setNewEpisodeTitle(e))}
          value={addNewEpisode.title}
          width={35}
        />
        <CustomInput
          label="Duration"
          type="number"
          onChange={(e: any) => dispatch(setNewEpisodeDuration(e))}
          value={addNewEpisode.duration}
          width={9}
        />
        <CustomInput
          label="en"
          type="checkbox"
          onChange={(e: any) => dispatch(setNewEpisodeEnSubtitles(e))}
          value={addNewEpisode.en_subtitles}
          width={5}
        />
        <CustomInput
          label="bg"
          type="checkbox"
          onChange={(e: any) => dispatch(setNewEpisodeBgSubtitles(e))}
          value={addNewEpisode.bg_subtitles}
          width={5}
        />
        <div
          className={styles.buttons}
          style={{
            border: "none",
            width: "fit-content",
            alignSelf: "flex-end",
            margin: 0,
            padding: 0,
          }}
        >
          <button
            className={styles["buttons__add"]}
            onClick={() => dispatch(addToEpisodePayload())}
            style={{
              opacity:
                addNewEpisode.title === "" ||
                addNewEpisode.episode_num === 0 ||
                addNewEpisode.season === 0 ||
                addNewEpisode.duration === 0
                  ? 0.5
                  : 1,
            }}
            disabled={
              addNewEpisode.title === "" ||
              addNewEpisode.episode_num === 0 ||
              addNewEpisode.season === 0 ||
              addNewEpisode.duration === 0
            }
          >
            Add Episode
          </button>
        </div>
      </div>
      <div className={styles.episodes}>
        {episodesPayload.map((ep, index) => (
          <span key={index}>
            S:{ep.season} Ep:{ep.episode_num} - {ep.title}
            <button onClick={() => dispatch(removeFromEpisodePayload(index))}>
              Remove
            </button>
          </span>
        ))}
      </div>
      <div className={styles.buttons}>
        <button className={styles["buttons__clear"]}>Clear</button>
        <button
          className={styles["buttons__add"]}
          onClick={addNewSeries}
          style={{
            opacity:
              seriesData.title === "" ||
              seriesData.description === "" ||
              seriesData.seasons === 0 ||
              seriesData.release_date === ""
                ? 0.5
                : 1,
          }}
          disabled={
            seriesData.title === "" ||
            seriesData.description === "" ||
            seriesData.seasons === 0 ||
            seriesData.release_date === ""
          }
        >
          Add Series
        </button>
      </div>
    </section>
  );
};

export default AddNewSeries;
