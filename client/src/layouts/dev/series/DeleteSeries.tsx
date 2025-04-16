import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import styles from "../settings.module.scss";

import CustomInput from "../CustomInput";
import CustomTextArea from "../CustomTextArea";

import { RootState } from "../../../store/store";
import {
  resetDeletedSeriesValues,
  setDeleteSeriesData,
  setSeriesDeletedTitleSearch,
} from "../../../store/series-manager";
import { popUpNotification } from "../../../store/ui";
import { IGeneralSeriesRes } from "../../../utility/interfaces/series-responses";

const DeleteSeries: React.FC = function () {
  const dispatch = useDispatch();
  const { titleSearch, seriesData } = useSelector(
    (state: RootState) => state.seriesManager.deleteSeries
  );

  const findSeries = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/get-by-title?keywords=${titleSearch}`
      );

      const responseData: IGeneralSeriesRes = await response.json();
      if (response.ok) {
        dispatch(setDeleteSeriesData(responseData.series));
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

  const deleteSeries = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/series/delete-series?id=${seriesData.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: "Series were deleted successfully.",
          })
        );
        dispatch(resetDeletedSeriesValues());
      } else {
        dispatch(
          popUpNotification({
            emoji: "🍆",
            statusCode: response.status,
            message: "Couldn't delete the series.",
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
          message: "Client Side Error. Couldn't delete the series.",
        })
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Delete Series</h3>
      <span className={styles.row} style={{ marginBottom: "2.5rem" }}>
        <CustomInput
          label="Search for the series by title"
          type="text"
          onChange={(e: any) => dispatch(setSeriesDeletedTitleSearch(e))}
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
          <div className={styles.buttons}>
            <button
              className={styles["buttons__clear"]}
              onClick={() => dispatch(resetDeletedSeriesValues())}
            >
              Clear
            </button>
            <button className={styles["buttons__add"]} onClick={deleteSeries}>
              Delete Series
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default DeleteSeries;
