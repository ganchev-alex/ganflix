import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import CustomInput from "../CustomInput";

import {
  addSeasonEpisodePayload,
  removeSeasonEpisodePayload,
  resetNewSeasonValues,
  setNewSeasonSeriesId,
  setSeasonEpisodeBgSubtitles,
  setSeasonEpisodeDuration,
  setSeasonEpisodeEnSubtitles,
  setSeasonEpisodeEpisodeNum,
  setSeasonEpisodeSeason,
  setSeasonEpisodeTitle,
  setSeasonTitleSearch,
} from "../../../store/series-manager";
import { RootState } from "../../../store/store";

import styles from "../settings.module.scss";
import { popUpNotification } from "../../../store/ui";
import { IGeneralSeriesRes } from "../../../utility/interfaces/series-responses";

const AddNewSeason = function () {
  const dispatch = useDispatch();
  const { titleSearch, newSeason, newEpisode } = useSelector(
    (state: RootState) => state.seriesManager.addNewSeason
  );

  const { series_id, episodes } = newSeason;

  const findSeries = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/get-by-title?keywords=${titleSearch}`
      );

      const responseData: IGeneralSeriesRes = await response.json();
      if (response.ok) {
        dispatch(setNewSeasonSeriesId(responseData));
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

  const addNewSeason = async function () {
    try {
      const response = await fetch("http://localhost:8080/series/add-season", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          series_id: newSeason.series_id,
          season_num: episodes[0].season,
          episodes: newSeason.episodes,
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
        dispatch(resetNewSeasonValues());
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
        "Client Error.\nCouldn't add the new season.\nError Details: \n",
        error
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Add New Season to Series</h3>
      <span className={styles.row} style={{ marginBottom: "2.5em" }}>
        <CustomInput
          label="Search for the series by title"
          type="text"
          onChange={(e: any) => dispatch(setSeasonTitleSearch(e))}
          value={titleSearch}
          width={85}
        />
        <button className={styles["search-button"]} onClick={findSeries}>
          Search
        </button>
      </span>
      {series_id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          key={series_id}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h3 style={{ fontSize: "1.4rem", margin: "1.5em 0 -0.1em" }}>
            Add Episodes Payload
          </h3>
          <div className={styles.row}>
            <CustomInput
              label="Season"
              type="number"
              onChange={(e: any) => dispatch(setSeasonEpisodeSeason(e))}
              value={newEpisode.season}
              width={9}
            />
            <CustomInput
              label="Episode"
              type="number"
              onChange={(e: any) => dispatch(setSeasonEpisodeEpisodeNum(e))}
              value={newEpisode.episode_num}
              width={9}
            />
            <CustomInput
              label="Episode Title"
              type="text"
              onChange={(e: any) => dispatch(setSeasonEpisodeTitle(e))}
              value={newEpisode.title}
              width={35}
            />
            <CustomInput
              label="Duration"
              type="number"
              onChange={(e: any) => dispatch(setSeasonEpisodeDuration(e))}
              value={newEpisode.duration}
              width={9}
            />
            <CustomInput
              label="en"
              type="checkbox"
              onChange={(e: any) => dispatch(setSeasonEpisodeEnSubtitles(e))}
              value={newEpisode.en_subtitles}
              width={5}
            />
            <CustomInput
              label="bg"
              type="checkbox"
              onChange={(e: any) => dispatch(setSeasonEpisodeBgSubtitles(e))}
              value={newEpisode.bg_subtitles}
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
                onClick={() => dispatch(addSeasonEpisodePayload())}
                style={{
                  opacity:
                    newEpisode.title === "" ||
                    newEpisode.episode_num === 0 ||
                    newEpisode.season === 0 ||
                    newEpisode.duration === 0
                      ? 0.5
                      : 1,
                }}
                disabled={
                  newEpisode.title === "" ||
                  newEpisode.episode_num === 0 ||
                  newEpisode.season === 0 ||
                  newEpisode.duration === 0
                }
              >
                Add Episode
              </button>
            </div>
          </div>
          <div className={styles.episodes}>
            {episodes.map((ep, index) => (
              <span key={index}>
                S:{ep.season} Ep:{ep.episode_num} - {ep.title}
                <button
                  onClick={() => dispatch(removeSeasonEpisodePayload(index))}
                >
                  Remove
                </button>
              </span>
            ))}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles["buttons__clear"]}
              onClick={() => dispatch(resetNewSeasonValues())}
            >
              Clear
            </button>
            <button
              className={styles["buttons__add"]}
              onClick={addNewSeason}
              style={{
                opacity: episodes.length === 0 ? 0.5 : 1,
              }}
              disabled={episodes.length === 0}
            >
              Add Series
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default AddNewSeason;
