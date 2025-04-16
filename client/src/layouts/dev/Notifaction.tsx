import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { motion } from "framer-motion";

import styles from "./DevOptions.module.scss";
import { popUpNotification } from "../../store/ui";

const Notification: React.FC = function () {
  const dispatch = useDispatch();
  const { emoji, statusCode, message } = useSelector(
    (state: RootState) => state.ui.notification
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={styles.notification}
      whileHover={{ scale: 1.025 }}
      onClick={() =>
        dispatch(popUpNotification({ emoji: "", statusCode: 0, message: "" }))
      }
    >
      <p>
        <span>
          {emoji} {statusCode}.
        </span>
        {" " + message}
      </p>
    </motion.div>
  );
};

export default Notification;
