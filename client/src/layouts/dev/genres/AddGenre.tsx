import { useState } from "react";
import { useDispatch } from "react-redux";

import CustomInput from "../CustomInput";

import styles from "../settings.module.scss";
import { popUpNotification } from "../../../store/ui";

const AddGenre: React.FC = function () {
  const dispatch = useDispatch();

  const [genre, setGenre] = useState("");

  const addGenre = async function () {
    try {
      const response = await fetch("http://localhost:8080/genres/add-genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre }),
      });

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
        "Client Error.\nCouldn't add the new genre.\nError Details: \n",
        error
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Add a Genre</h3>
      <div className={styles.row} style={{ marginBottom: "2em" }}>
        <CustomInput
          label="New Genre"
          type="text"
          value={genre}
          onChange={setGenre}
          width={85}
        />
        <button className={styles["search-button"]} onClick={addGenre}>
          Add
        </button>
      </div>
    </section>
  );
};

export default AddGenre;
