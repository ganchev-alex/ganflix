import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store/store";
import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

import MediaSlot from "../shared/MediaSlot";

import styles from "./LibraryGrid.module.scss";
import leftArrow from "../../assets/svgs/left_arrow.svg";
import rightArrow from "../../assets/svgs/right_arrow.svg";
import {
  modifyCurrantPage,
  setCurrentPage,
  setMediaType,
  setTotalPages,
  setTotalResults,
} from "../../store/explore";

const LibraryGrid: React.FC = function () {
  const dispatch = useDispatch();
  const [chunkRecords, setChunkRecords] = useState<IGeneralRecord[]>([]);
  const [loadingState, setLoadingState] = useState(false);
  const exploreManager = useSelector(
    (state: RootState) => state.exploreManager
  );
  const { type, pagination, filters, searchValue } = exploreManager;
  const { currentPage, pageLimit, totalResults, totalPages } = pagination;

  const getChunkedData = async function () {
    try {
      setLoadingState(true);
      const response = await fetch("http://localhost:8080/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type.toLowerCase(),
          page: currentPage,
          pageSize: pageLimit,
          keywords: searchValue,
          filters: {
            orderBy: filters.orderBy,
            listingId: filters.listing.id,
            genreId: filters.genre.id,
            year: filters.year,
          },
        }),
      });

      const responseData: {
        message: string;
        chunkedData: IGeneralRecord[];
        pagination: {
          currentPage: number;
          recordsPerPage: number;
          totalPages: number;
          moviesCount: number;
          seriesCount: number;
          totalResults: number;
        };
      } = await response.json();
      if (response.ok) {
        setChunkRecords(responseData.chunkedData);
        dispatch(setTotalResults(responseData.pagination.totalResults));
        dispatch(setTotalPages(responseData.pagination.totalPages));
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't retrieve the chunked records.\nError Details: \n",
        error
      );
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    dispatch(setMediaType("Movies"));
  }, []);

  useEffect(() => {
    getChunkedData();
  }, [type, filters, currentPage]);

  useEffect(() => {
    const indicator = setTimeout(() => getChunkedData(), 250);

    return () => {
      clearTimeout(indicator);
    };
  }, [searchValue]);

  return (
    <>
      <form className={styles.ribbon}>
        <h5 className={styles["ribbon__results"]}>
          {new Intl.NumberFormat("en-US", {
            useGrouping: true,
          }).format(totalResults)}{" "}
          results
        </h5>
        <div className={styles["ribbon__controls"]}>
          <button
            type="submit"
            disabled={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              dispatch(modifyCurrantPage(false));
            }}
          >
            <img src={leftArrow} />
          </button>
          <input
            type="number"
            min={1}
            max={totalPages}
            name="page"
            value={currentPage || ""}
            onChange={(e) => {
              dispatch(setCurrentPage(Number(e.target.value)));
            }}
          />
          <label htmlFor="page">page out of {totalPages}</label>
          <button
            type="submit"
            disabled={currentPage + 1 > totalPages}
            onClick={(e) => {
              e.preventDefault();
              dispatch(modifyCurrantPage(true));
            }}
          >
            <img src={rightArrow} />
          </button>
        </div>
      </form>
      <section className={styles.grid}>
        {!loadingState
          ? chunkRecords.map((record) => (
              <MediaSlot
                key={record.id}
                mediaData={record}
                layoutMode="grid"
                positionDependency={chunkRecords.length}
              />
            ))
          : Array.from({ length: 24 }, (_, i) => (
              <div key={i} className={styles["loading-slot"]}>
                <div className={styles["loading-slot__trigger"]} />
              </div>
            ))}
      </section>
      {chunkRecords.length > 12 && (
        <form
          className={styles.ribbon}
          style={{ justifyContent: "flex-end", paddingBottom: 0 }}
        >
          <div className={styles["ribbon__controls"]}>
            <button
              type="submit"
              disabled={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                dispatch(modifyCurrantPage(false));
              }}
            >
              <img src={leftArrow} />
            </button>
            <input
              type="number"
              min={1}
              max={totalPages}
              name="page"
              value={currentPage || ""}
              onChange={(e) => {
                dispatch(setCurrentPage(Number(e.target.value)));
              }}
            />
            <label htmlFor="page">page out of {totalPages}</label>
            <button
              type="submit"
              disabled={currentPage + 1 > totalPages}
              onClick={(e) => {
                e.preventDefault();
                dispatch(modifyCurrantPage(true));
              }}
            >
              <img src={rightArrow} />
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default LibraryGrid;
