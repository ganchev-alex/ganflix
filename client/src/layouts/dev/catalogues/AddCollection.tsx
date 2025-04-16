import { useState } from "react";
import { useDispatch } from "react-redux";

import CustomInput from "../CustomInput";

import styles from "../settings.module.scss";
import { popUpNotification } from "../../../store/ui";

const AddCollection: React.FC = function () {
  const dispatch = useDispatch();
  const [collectionName, setCollectionName] = useState("");

  const addCollection = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/collections/add-collection",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: collectionName }),
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
        "Client Error.\nCouldn't add the new collection.\nError Details: \n",
        error
      );
    }
  };

  return (
    <section className={styles.wrapper}>
      <h3>Add a Collection</h3>
      <div className={styles.row} style={{ marginBottom: "2em" }}>
        <CustomInput
          label="Collection Name"
          type="text"
          value={collectionName}
          onChange={setCollectionName}
          width={85}
        />
        <button className={styles["search-button"]} onClick={addCollection}>
          Add
        </button>
      </div>
    </section>
  );
};

export default AddCollection;
