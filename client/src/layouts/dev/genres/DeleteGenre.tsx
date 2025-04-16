import { useState } from "react";
import { useDispatch } from "react-redux";

import CustomInput from "../CustomInput";

import { popUpNotification } from "../../../store/ui";

import styles from "../settings.module.scss";

const DeleteGenre: React.FC = function () {
  const dispatch = useDispatch();
  const [genre, setGenre] = useState("");

  const deleteGenre = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/genres/delete-genre?genre=${genre}`,
        {
          method: "DELETE",
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        dispatch(
          popUpNotification({
            emoji: "🥹",
            statusCode: response.status,
            message: responseData.message,
          })
        );
        setGenre("");
      } else {
        dispatch(
          popUpNotification({
            emoji: "😶‍🌫️",
            statusCode: response.status,
            message: responseData.message,
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
        "Client Error.\nCouldn't delete the genre.\nError Details: \n",
        error
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Delete Genre</h3>
      <div className={styles.row} style={{ marginBottom: "2em" }}>
        <CustomInput
          label="Genre"
          type="text"
          value={genre}
          onChange={setGenre}
          width={85}
        />
        <button className={styles["search-button"]} onClick={deleteGenre}>
          Delete
        </button>
      </div>
    </section>
  );
};

export default DeleteGenre;
