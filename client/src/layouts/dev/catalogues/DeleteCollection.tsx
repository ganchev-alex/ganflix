import { useState } from "react";
import { useDispatch } from "react-redux";

import CustomInput from "../CustomInput";

import { popUpNotification } from "../../../store/ui";

import styles from "../settings.module.scss";

const DeleteCollection: React.FC = function () {
  const dispatch = useDispatch();
  const [collectionName, setCollectionName] = useState("");

  const deleteCollection = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/collections/delete-collection?name=${collectionName}`,
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
        setCollectionName("");
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
        "Client Error.\nCouldn't delete the new collection.\nError Details: \n",
        error
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Delete a Collection</h3>
      <div className={styles.row} style={{ marginBottom: "2em" }}>
        <CustomInput
          label="Collection Name"
          type="text"
          value={collectionName}
          onChange={setCollectionName}
          width={85}
        />
        <button className={styles["search-button"]} onClick={deleteCollection}>
          Delete
        </button>
      </div>
    </section>
  );
};

export default DeleteCollection;
