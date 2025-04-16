import Details from "./Details";
import { ILoadedRecord } from "../../../utility/interfaces/explore-responses";

import styles from "./Controls.module.scss";

const Controlls: React.FC<{
  mediaData: ILoadedRecord;
}> = function ({ mediaData }) {
  return (
    <div className={styles.controls}>
      <img
        className={styles["controls__backlight"]}
        src={`http://localhost:8080${mediaData.thumb_src}`}
      />
      <Details mediaData={mediaData} />
    </div>
  );
};

export default Controlls;
