import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import Preview from "./Preview";

import { changeDevVisibility } from "../../store/ui";
import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

import styles from "./Heading.module.scss";
import "swiper/css";
import "./swiper.css";

import logoSrc from "../../assets/images/logo.png";
import picSrc from "../../assets/images/profile.jpg";
import settingsSrc from "../../assets/svgs/settings.svg";

const Heading: React.FC = function () {
  const dispatch = useDispatch();

  const [sliderIndex, setSliderIndex] = useState(0);
  const [selection, setSelection] = useState<IGeneralRecord[]>([]);
  const [loadingState, setLoadingState] = useState(true);

  const getRandomizedSelection = async function () {
    try {
      const response = await fetch("http://localhost:8080/explore/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "all",
          limit: 6,
        }),
      });

      const responseData: {
        message: string;
        records: IGeneralRecord[];
      } = await response.json();
      if (response.ok) {
        setSelection(responseData.records);
      } else {
        setSelection([]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't retrieve the randomized selection.\nError Details: \n",
        error
      );
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    if (selection.length === 0) {
      getRandomizedSelection();
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.ribbon}>
        <img src={logoSrc} className={styles["ribbon__logo"]} />
        <span className={styles["ribbon__profile"]}>
          <button onClick={() => dispatch(changeDevVisibility(true))}>
            <img src={settingsSrc} />
          </button>
          <img src={picSrc} />
        </span>
      </div>
      {loadingState || selection.length == 0 ? (
        <div className={styles["loading-plane"]}>
          <aside className={styles["skeleton"]}>
            <div className={styles["skeleton__title"]}>
              <span className={styles["loading-plane__trigger"]} />
            </div>
            <div className={styles["skeleton__attributes"]}>
              <span className={styles["loading-plane__trigger"]} />
            </div>
            <div className={styles["skeleton__description"]}>
              <span className={styles["loading-plane__trigger"]} />
            </div>
          </aside>
          <div className={styles["skeleton__poster"]}>
            <span className={styles["loading-plane__trigger"]} />
          </div>
        </div>
      ) : (
        <>
          <div
            className={styles["header__backligth"]}
            style={{
              backgroundImage: `url(http://localhost:8080${selection[sliderIndex].thumb_src})`,
            }}
          />
          <div className={styles["slider-wrapper"]}>
            <Swiper
              spaceBetween={20}
              loop={true}
              autoplay={{
                delay: 8500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              draggable={false}
              lazyPreloadPrevNext={2}
              onSlideChange={(swiper: any) => setSliderIndex(swiper.realIndex)}
            >
              {selection.map((record) => (
                <SwiperSlide key={record.id}>
                  <img
                    src={`http://localhost:8080${record.thumb_src}`}
                    alt={`${record.title}'s base`}
                    className="base"
                  />
                  <Preview mediaData={record} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      )}
    </header>
  );
};

export default Heading;
