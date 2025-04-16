import { useState } from "react";
import { useDispatch } from "react-redux";

import CustomInput from "../CustomInput";

import styles from "../settings.module.scss";
import { popUpNotification } from "../../../store/ui";

const UpdateCollection: React.FC = function () {
  const dispatch = useDispatch();
  const [oldCollectionName, setOldCollectionName] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");

  const updateCollection = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/collections/update-collection",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldName: oldCollectionName,
            newName: newCollectionName,
          }),
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
        setOldCollectionName("");
        setNewCollectionName("");
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
      <h3>Update Collection</h3>
      <CustomInput
        label="Old Collection Name"
        type="text"
        value={oldCollectionName}
        onChange={setOldCollectionName}
      />
      <CustomInput
        label="Old Collection Name"
        type="text"
        value={newCollectionName}
        onChange={setNewCollectionName}
      />
      <div className={styles.buttons}>
        <button onClick={updateCollection} className={styles["search-button"]}>
          Update
        </button>
      </div>
    </section>
  );
};

export default UpdateCollection;
