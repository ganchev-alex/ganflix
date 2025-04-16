import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import DropDownMenu from "./DropDownMenu";

import { RootState } from "../../store/store";
import {
  setGenreFilter,
  setListingFilter,
  setMediaType,
  setOrderingStatement,
  setSearchValue,
  setYearFilter,
} from "../../store/explore";
import { IGenre, IGetGenres } from "../../utility/interfaces/genres-responses";
import { IListing } from "../../utility/interfaces/listings-responses";

import styles from "./SearchBar.module.scss";
import searchSrc from "../../assets/svgs/search_bar.svg";
import filterSrc from "../../assets/svgs/filter.svg";

const SearchBar: React.FC<{ simplified?: boolean }> = function ({
  simplified,
}) {
  const dispatch = useDispatch();
  const { searchValue, type, filters } = useSelector(
    (state: RootState) => state.exploreManager
  );
  const [filterVisibility, setFilterVisibility] = useState(false);
  const [genresOptions, setGenresOptions] = useState<IGenre[]>([
    { id: "default", genre: "All" },
  ]);
  const [listingsOptions, setListingsOptions] = useState<IListing[]>([
    { id: "default", name: "All", icon_src: "" },
  ]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      zIndex: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const getGenresOptions = async function () {
    try {
      const response = await fetch("http://localhost:8080/genres/get-genres");
      const responseData: IGetGenres = await response.json();

      if (response.ok) {
        setGenresOptions([
          { id: "default", genre: "All" },
          ...responseData.genres,
        ]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't retrieve genres options.\nError Details: \n",
        error
      );
    }
  };

  const getListintsOptions = async function () {
    try {
      const response = await fetch(
        "http://localhost:8080/listings/get-listings"
      );
      const responseData: { message: string; listings: IListing[] } =
        await response.json();

      if (response.ok) {
        setListingsOptions([
          { id: "default", name: "All", icon_src: "" },
          ...responseData.listings,
        ]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't retrieve listing options.\nError Details: \n",
        error
      );
    }
  };

  const getYearsOptions = async function () {
    try {
      const response = await fetch(
        `http://localhost:8080/explore/year-filter?type=${type.toLowerCase()}`
      );

      const responseData: { message: string; years: string[] } =
        await response.json();
      if (response.ok) {
        setYearOptions(["All", ...responseData.years]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't retrieve years options.\nError Details: \n",
        error
      );
    }
  };

  useEffect(() => {
    getGenresOptions();
    getListintsOptions();
    getYearsOptions();
  }, []);

  useEffect(() => {
    getYearsOptions();
  }, [type]);

  return (
    <>
      <search className={styles.search}>
        <div className={styles["search__bar"]}>
          <input
            type="search"
            placeholder="What do you want to watch?"
            value={searchValue}
            onChange={(e) => dispatch(setSearchValue(e.target.value))}
          />
          <img src={searchSrc} />
          {searchValue && (
            <button onClick={() => dispatch(setSearchValue(""))}>Clear</button>
          )}
        </div>
        <div className={styles["search__controls"]}>
          <span className={styles["search__dropdown"]}>
            <DropDownMenu
              options={
                simplified ? ["All", "Movies", "Series"] : ["Movies", "Series"]
              }
              selectedValue={type}
              dispatchEvent={(value: any) => dispatch(setMediaType(value))}
            />
          </span>
          <button
            className={styles["search__toggle"]}
            onClick={() =>
              setFilterVisibility((previousState) => !previousState)
            }
          >
            <img
              src={filterSrc}
              style={
                filterVisibility
                  ? { filter: "invert(100%)", transform: "rotate(9deg)" }
                  : {}
              }
            />
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {filterVisibility && (
            <motion.menu
              key="filters"
              className={styles.filters}
              style={
                simplified ? { justifyContent: "flex-start", gap: "2em" } : {}
              }
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              layout
            >
              <span className={styles["filters__dropdown-set"]}>
                <label>Sort By</label>
                <DropDownMenu
                  options={
                    simplified
                      ? ["Most Recently Added", "Least Recently Added"]
                      : [
                          "Most Recently Added",
                          "Least Recently Added",
                          "Latest Releases",
                          "Earliest Releases",
                          "By Title A-to-Z",
                          "By Title Z-to-A",
                        ]
                  }
                  selectedValue={filters.orderBy}
                  dispatchEvent={(value: any) =>
                    dispatch(setOrderingStatement(value))
                  }
                />
              </span>
              {!simplified && (
                <span className={styles["filters__dropdown-set"]}>
                  <label>Listing</label>
                  <DropDownMenu
                    options={listingsOptions.map((l) => l.name)}
                    selectedValue={filters.listing.name}
                    dispatchEvent={(value: any) =>
                      dispatch(
                        setListingFilter({
                          id:
                            listingsOptions.find((l) => l.name === value)?.id ||
                            "",
                          name: value,
                        })
                      )
                    }
                  />
                </span>
              )}
              <span className={styles["filters__dropdown-set"]}>
                <label>Genre</label>
                <DropDownMenu
                  options={genresOptions.map((g) => g.genre)}
                  selectedValue={filters.genre.genre}
                  dispatchEvent={(value: any) =>
                    dispatch(
                      setGenreFilter({
                        id:
                          genresOptions.find((g) => g.genre === value)?.id ||
                          "",
                        genre: value,
                      })
                    )
                  }
                />
              </span>
              <span className={styles["filters__dropdown-set"]}>
                <label>Year</label>
                <DropDownMenu
                  options={yearOptions}
                  selectedValue={filters.year}
                  dispatchEvent={(value: any) => dispatch(setYearFilter(value))}
                />
              </span>
            </motion.menu>
          )}
        </AnimatePresence>
      </search>
    </>
  );
};

export default SearchBar;
