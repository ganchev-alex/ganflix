import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { changeDevVisibility } from "../../store/ui";
import { IFullMovieDataRes } from "../../utility/interfaces/movies-responses";
import { IFullSeriesDataRes } from "../../utility/interfaces/series-responses";

import styles from "./Catalogues.module.scss";

import SearchBar from "../explore/SearchBar";
import CatalogSlot from "./CatalogueSlot";

import logoSrc from "../../assets/images/logo.png";
import settingsSrc from "../../assets/images/settings.png";
import picSrc from "../../assets/images/profile.jpg";
import { RootState } from "../../store/store";
import { setMediaType } from "../../store/explore";
import { ILoadedRecord } from "../../utility/interfaces/explore-responses";

const Catalogues: React.FC = function () {
  const location = useLocation();
  const dispatch = useDispatch();
  const [catalogue, setCatalogue] = useState<ILoadedRecord[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const { catalogueId, catalogueKind } = useSelector(
    (state: RootState) => state.catalogue
  );
  const { filters, searchValue, type } = useSelector(
    (state: RootState) => state.exploreManager
  );

  const pageTitle = location.pathname
    .split("/")
    [location.pathname.split("/").length - 1].replaceAll("%20", " ");

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getNextDataInLine = async function () {
    if (!catalogueId || isFetching) return;

    try {
      setIsFetching(true);
      const response = await fetch(
        `http://localhost:8080/${catalogueKind}/get-media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: type.toLowerCase(),
            catalogueId,
            page,
            pageSize: 15,
            keywords: searchValue,
            filters: {
              orderBy: filters.orderBy,
              genreId: filters.genre.id,
              year: filters.year,
            },
          }),
        }
      );

      const responseData: {
        message: string;
        records: { Series?: IFullSeriesDataRes; Movie?: IFullMovieDataRes }[];
        pagination: {
          currentPage: number;
          recordsPerPage: number;
          totalResults: number;
          totalPages: number;
        };
      } = await response.json();
      if (response.ok) {
        const prepData = responseData.records
          .map((record) => {
            if (record.Movie) {
              return { ...record.Movie };
            }
            if (record.Series) {
              return { ...record.Series };
            }
          })
          .filter((r) => r !== undefined);

        setCatalogue((prevValues) => {
          const fetchedData = [...prevValues, ...(prepData as any)];

          if (page === 1) {
            return Array.from(new Set(fetchedData.map((item) => item.id))).map(
              (id) => fetchedData.find((item) => item.id === id)
            );
          } else {
            return fetchedData;
          }
        });
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(
        "Couldn't append the next data in line. Error details: ",
        error
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleScroll = function () {
    const container = document.getElementById("main");
    if (!container || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight - 50 || scrollTop === 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    dispatch(setMediaType(type));
  }, [type]);

  useEffect(() => {
    if (catalogueId) {
      getNextDataInLine();
    }
  }, [page, catalogueId, type, filters, searchValue]);

  useEffect(() => {
    const container = document.getElementById("main");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    setCatalogue([]);
    setPage(1);
    setIsFetching(false);
  }, [type, filters, searchValue, catalogueId]);

  return (
    <>
      <div className={styles.ribbon}>
        <div className={styles["ribbon__logo"]}>
          <img src={logoSrc} alt="Ganflix Logo" />
          <p>
            {location.pathname.includes("catalogues") ? "Catalogues" : "Series"}
            {` Hub: ${capitalizeFirstLetter(pageTitle)}`}
          </p>
        </div>
        <span className={styles["ribbon__profile"]}>
          <button onClick={() => dispatch(changeDevVisibility(true))}>
            <img src={settingsSrc} />
          </button>
          <img src={picSrc} />
        </span>
      </div>
      <SearchBar simplified={true} />
      {catalogue.map((set) => (
        <CatalogSlot key={set.id} mediaData={set} />
      ))}
    </>
  );
};

export default Catalogues;
