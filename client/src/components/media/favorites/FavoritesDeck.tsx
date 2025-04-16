import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { EffectCards } from "swiper/modules";

import styles from "./FavoritesDeck.module.scss";
import "swiper/css";
import "swiper/css/effect-cards";
import { IGeneralRecord } from "../../../utility/interfaces/explore-responses";

const FavoritesDeck: React.FC<{
  favoritesSelection: IGeneralRecord[];
  onChangeActiveIndex: (index: number) => any;
}> = function ({ favoritesSelection, onChangeActiveIndex }) {
  return (
    <div className={styles.container}>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[EffectCards, Autoplay]}
        className={styles.swiper}
        onSlideChange={(swiper: any) => onChangeActiveIndex(swiper.realIndex)}
      >
        {favoritesSelection.map((record) => (
          <SwiperSlide key={record.id} className={styles["swiper__slide"]}>
            <img
              className={styles["container__poster"]}
              src={`http://localhost:8080${record.poster_src}`}
              alt={`${record.title} Poster`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FavoritesDeck;
