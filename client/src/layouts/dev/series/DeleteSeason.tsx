import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import {
  resetDeletedSeasonValues,
  setDeletedSeason,
  setDeleteSeasonData,
  setSeasonDeletedTitleSearch,
} from "../../../store/series-manager";
import { RootState } from "../../../store/store";
import { IGeneralSeriesRes } from "../../../utility/interfaces/series-responses";
import { popUpNotification } from "../../../store/ui";

import styles from "../settings.module.scss";

const DeleteSeason: React.FC = function () {
  const dispatch = useDispatch();
  const { titleSearch, season, seriesData } = useSelector(
    (state: RootState) => state.seriesManager.deleteSeason
  );

  const findSeries = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/get-by-title?keywords=${titleSearch}`
      );

      const responseData: IGeneralSeriesRes = await response.json();
      if (response.ok) {
        dispatch(setDeleteSeasonData(responseData.series));
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

  const deleteSeason = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/delete-season?id=${seriesData.id}&season=${season}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: "Season was deleted successfully.",
          })
        );
        dispatch(resetDeletedSeasonValues());
      } else {
        dispatch(
          popUpNotification({
            emoji: "🍆",
            statusCode: response.status,
            message: "Couldn't delete the season of the series.",
          })
        );
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't request a delet process of the season for the series.\nError Details: \n",
        error
      );
      dispatch(
        popUpNotification({
          emoji: "😵‍💫",
          statusCode: 400,
          message: "Client Side Error. Couldn't delete the series.",
        })
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Delete Season of a Series</h3>
      <span className={styles.row} style={{ marginBottom: "2.5rem" }}>
        <CustomInput
          label="Search for the series by title"
          type="text"
          onChange={(e: any) => dispatch(setSeasonDeletedTitleSearch(e))}
          value={titleSearch}
          width={85}
        />
        <button className={styles["search-button"]} onClick={findSeries}>
          Search
        </button>
      </span>
      {seriesData.id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          key={seriesData.id}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <CustomTextArea
            label="Deleted Data"
            onChange={(e: any) => {}}
            value={Object.entries(seriesData)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")}
            readonly
          />
          <CustomInput
            label="Season you want to delete from this series"
            type="number"
            onChange={(e: any) => dispatch(setDeletedSeason(e))}
            value={season}
          />
          <div className={styles.buttons}>
            <button
              className={styles["buttons__clear"]}
              onClick={() => dispatch(resetDeletedSeasonValues())}
            >
              Clear
            </button>
            <button className={styles["buttons__add"]} onClick={deleteSeason}>
              Delete Season
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default DeleteSeason;
