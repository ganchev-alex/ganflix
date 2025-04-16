import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import MediaSlot from "./MediaSlot";

import { IGeneralRecord } from "../../utility/interfaces/explore-responses";

import styles from "./Shelf.module.scss";

const Shelf: React.FC<{
  sectionTitle: string;
  reqProperties?: {
    type: "all" | "movies" | "series";
    listingId: string;
    limit: number;
  };
  externalLoadingState?: boolean;
  preFetchedData?: IGeneralRecord[];
  slotsNumber?: number;
}> = ({
  sectionTitle,
  slotsNumber,
  reqProperties,
  preFetchedData,
  externalLoadingState,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionBounds, setSectionBounds] = useState<DOMRect | null>(null);
  const [slotPositions, setSlotPositions] = useState<Record<number, DOMRect>>(
    {}
  );

  const [shelfRecords, setShelfRecords] = useState<IGeneralRecord[]>([]);
  const [localLoadingState, setLocalLoadingState] = useState(
    externalLoadingState || false
  );

  useEffect(() => {
    function updateBounds() {
      if (sectionRef.current) {
        setSectionBounds(sectionRef.current.getBoundingClientRect());
      }
    }

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
    };
  }, []);

  useEffect(() => {
    if (preFetchedData) {
      setShelfRecords(preFetchedData);
      setLocalLoadingState(false);
    }
    if (externalLoadingState) {
      setLocalLoadingState(externalLoadingState);
    }
  }, [preFetchedData]);

  useEffect(() => {
    if (reqProperties) {
      loadShelf();
    }
  }, [reqProperties]);

  const loadShelf = async function () {
    try {
      setLocalLoadingState(true);
      const response = await fetch("http://localhost:8080/explore/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reqProperties,
        }),
      });

      const reponseData: {
        message: string;
        shelf: {
          Movie: IGeneralRecord | null;
          Series: IGeneralRecord | null;
        }[];
      } = await response.json();
      if (response.ok) {
        const records = reponseData.shelf
          .map((record) => {
            if (record.Movie) {
              return { ...record.Movie };
            } else if (record.Series) {
              return { ...record.Series };
            }
          })
          .filter((r) => r != undefined || r != null);

        if (records) {
          setShelfRecords(records as IGeneralRecord[]);
        }
      } else {
        console.log(reponseData.message);
        setShelfRecords([]);
      }
    } catch (error) {
      console.log(
        "Client Error.\nCouldn't add the media to the listing.\nError Details: \n",
        error
      );
    } finally {
      setLocalLoadingState(false);
    }
  };

  const handleSlideChange = () => {
    const positions: Record<number, DOMRect> = {};
    document
      .querySelectorAll(`.${styles["section__shelf"]} .swiper-slide`)
      .forEach((slot, index) => {
        const rect = slot.getBoundingClientRect();
        positions[index] = rect;
      });
    setSlotPositions(positions);
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <h3 className={styles.title}>{sectionTitle}</h3>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          1000: {
            slidesPerView: slotsNumber ? slotsNumber : 4.7,
          },
          1500: {
            slidesPerView: slotsNumber ? slotsNumber : 5.4,
          },
          1750: {
            slidesPerView: slotsNumber ? slotsNumber : 6.9,
            spaceBetween: 30,
          },
        }}
        freeMode={true}
        modules={[FreeMode]}
        style={{
          overflow: "visible",
        }}
        className={styles["section__shelf"]}
        onSetTranslate={handleSlideChange}
        onResize={handleSlideChange}
        onTouchMove={handleSlideChange}
      >
        {localLoadingState || shelfRecords.length === 0
          ? Array.from({ length: 7 }, (_, i) => (
              <SwiperSlide key={i} className={styles["loading-slot"]}>
                <div className={styles["loading-slot__trigger"]} />
              </SwiperSlide>
            ))
          : shelfRecords.map((record, index) => (
              <SwiperSlide
                key={index}
                style={{
                  overflow: "visible",
                  zIndex: activeIndex === index ? 99 : "auto",
                }}
                onClick={() => handleClick(index)}
              >
                <MediaSlot
                  mediaData={record}
                  sectionBounds={sectionBounds}
                  slotBounds={slotPositions[index]}
                  layoutMode="carousel"
                />
              </SwiperSlide>
            ))}
        <SwiperSlide />
      </Swiper>
    </section>
  );
};

export default Shelf;
