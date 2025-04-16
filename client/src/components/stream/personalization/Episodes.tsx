import { useState } from "react";

import { ILoadedEpsiode } from "../../../utility/interfaces/explore-responses";
import DropDownMenu from "../../explore/DropDownMenu";

import styles from "./Episodes.module.scss";

const Episodes: React.FC<{
  episodesData: ILoadedEpsiode[];
  episodeHandler: (episodeId: string) => any;
  activeId: string;
}> = function ({ episodesData, episodeHandler, activeId }) {
  const seasons = Array.from(new Set(episodesData.map((e) => e.season)));

  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  return (
    <section className={styles.controler}>
      <h2>Episode Manager</h2>
      <div className={styles["controler__seasons"]}>
        <DropDownMenu
          options={seasons.map((s) => `Season ${s}`)}
          selectedValue={`Season ${selectedSeason}`}
          dispatchEvent={(value: any) =>
            setSelectedSeason(Number(value.split(" ")[1]))
          }
        />
      </div>
      <div className={styles["controler__episodes"]}>
        {episodesData
          .filter((ep) => ep.season === selectedSeason)
          .map((ep) => (
            <button
              key={ep.id}
              onClick={() => episodeHandler(ep.id)}
              style={
                activeId === ep.id
                  ? { backgroundColor: "rgba(112, 113, 116, 0.4)" }
                  : {}
              }
            >
              {ep.episode_num}. {ep.title}
            </button>
          ))}
      </div>
    </section>
  );
};

export default Episodes;
