import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./Collection.module.scss";
import { useDispatch } from "react-redux";
import { setCatalogue } from "../../../store/catalogues";
import { setMediaType } from "../../../store/explore";

const Collection: React.FC<{ id: string; label: string; iconSrc: string }> =
  function ({ iconSrc, label, id }) {
    const location = useLocation();
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const openCatalogue = function (collectionId: string) {
      dispatch(
        setCatalogue({
          catalogueKind: "collections",
          catalogueId: collectionId,
        })
      );
      dispatch(
        setMediaType(location.pathname.includes("movies") ? "Movies" : "Series")
      );
      navigator(`/catalogues/${label}`);
    };

    return (
      <motion.div
        className={styles.collection}
        whileHover={{
          scale: 1.05,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
          },
        }}
        onClick={() => openCatalogue(id)}
      >
        <motion.div
          className={styles["collection__gradient"]}
          animate={{
            background: `linear-gradient(180deg, ${
              location.pathname.includes("movies") ? "#a90f30" : "#460b5b"
            } 50%, #e5bc76 100%)`,
          }}
        />
        <img
          src={`http://localhost:8080${iconSrc}`}
          alt={`${label} Collection`}
        />
        <span>{label}</span>
      </motion.div>
    );
  };

export default Collection;
