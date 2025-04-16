import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  IGeneralRecord,
  ILoadedEpsiode,
  ILoadedRecord,
} from "../../utility/interfaces/explore-responses";
import { RootState } from "../../store/store";
import { setResumeTime } from "../../store/stream";

import Navigation from "../../layouts/base/Navigation";
import Controlls from "./controls/Controls";
import Episodes from "./personalization/Episodes";
import Notes from "./personalization/Notes";
import Ratings from "./personalization/Ratings";
import Player from "./player/Player";

import styles from "./Stream.module.scss";

const Stream: React.FC = function () {
  const { indicator } = useParams();
  const [mediaType, id] = indicator?.split(":") as string[];

  const dispatch = useDispatch();
  const resumeState = useSelector((state: RootState) => state.stream);

  const [mediaData, setMediaData] = useState<ILoadedRecord>();
  const [episodes, setEpisodes] = useState<ILoadedEpsiode[] | undefined>();
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [similarSelection, setSimilarSelection] = useState<IGeneralRecord[]>(
    []
  );
  const [loadingState, setLoadingState] = useState(false);

  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  const loadMediaData = async function () {
    try {
      setLoadingState(true);
      const response = await fetch(
        `http://localhost:8080/${
          mediaType + (mediaType === "movie" ? "s" : "")
        }/load-${mediaType}?id=${id}`
      );

      const responseData: {
        message: string;
        mediaData: ILoadedRecord;
      } = await response.json();
      if (response.ok) {
        setMediaData(responseData.mediaData);
        setRating(responseData.mediaData.Personalization.rating);
        setNotes(responseData.mediaData.Personalization.notes);

        if (responseData.mediaData.Episodes) {
          setEpisodes(responseData.mediaData.Episodes);
          setActiveId(responseData.mediaData.Episodes[0].id);
        }
      }

      const relatedResponse = await fetch(
        `http://localhost:8080/explore/get-similar?id=${
          responseData.mediaData.id
        }&type=${responseData.mediaData.seasons ? "series" : "movie"}`
      );

      const relatedResponseData: {
        message: string;
        relatedResults: IGeneralRecord[];
      } = await relatedResponse.json();
      if (response.ok) {
        setSimilarSelection(relatedResponseData.relatedResults);
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(
        "Client error. Couldn't load the media. Error details:",
        error
      );
    } finally {
      setLoadingState(false);
    }
  };

  const savePersonalization = async function () {
    try {
      if (mediaData) {
        const response = await fetch("http://localhost:8080/personalization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: mediaType,
            id: mediaData?.id,
            rating,
            notes,
          }),
        });

        if (!response.ok) {
          console.log((await response.json()).message);
        }
      }
    } catch (error) {
      console.log(
        "Client error. Couldn't save personalization. Error details:",
        error
      );
    }
  };

  const episodeHandler = function (episodeId: string) {
    if (episodes) {
      if (resumeState.resumeTime > 0) {
        dispatch(setResumeTime({ resumeTime: 0 }));
      }
      setSelectedEpisode(episodes.findIndex((ep) => ep.id === episodeId));
      setActiveId(episodeId);
    }
  };

  useEffect(() => {
    if (resumeState.activeId && episodes) {
      setSelectedEpisode(
        episodes.findIndex((ep) => ep.id === resumeState.activeId)
      );
      setActiveId(resumeState.activeId);
    }
  }, [episodes]);

  useEffect(() => {
    loadMediaData();
    if (episodes) {
      setActiveId(episodes[0].id);
    }
  }, [indicator]);

  useEffect(() => {
    const indicator = setTimeout(() => {
      savePersonalization();
    }, 700);

    return () => {
      clearTimeout(indicator);
    };
  }, [rating, notes]);

  return (
    <div className={styles.stream}>
      <aside className={styles["stream__controls"]}>
        <Navigation customBacklight={mediaData?.thumb_src} />
        {mediaData && <Controlls mediaData={mediaData} />}
      </aside>
      <main className={styles["stream__player"]} id="player-container">
        {mediaData && (
          <Player
            mediaData={mediaData}
            episodeData={episodes && episodes[selectedEpisode]}
            similarSelection={similarSelection}
            externalLoadingState={loadingState}
          />
        )}
      </main>
      {mediaData && (
        <aside className={styles["stream__personalization"]}>
          {episodes && (
            <Episodes
              episodesData={episodes}
              episodeHandler={episodeHandler}
              activeId={activeId}
            />
          )}
          <Ratings
            mediaData={mediaData}
            ratingValue={rating}
            onRatingChange={setRating}
          />
          <Notes notesValue={notes} onNotesChange={setNotes} />
          <img
            className={styles["stream__backlight"]}
            src={`http://localhost:8080${mediaData.thumb_src}`}
            alt="Colorful backlight"
          />
        </aside>
      )}
    </div>
  );
};

export default Stream;
