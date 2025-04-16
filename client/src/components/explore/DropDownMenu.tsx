import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./DropDownMenu.module.scss";

import arrowSrc from "../../assets/svgs/down_arrow.svg";

const DropDownMenu: React.FC<{
  options: string[];
  selectedValue: string;
  dispatchEvent: (value: any) => any;
}> = function ({ options, dispatchEvent, selectedValue }) {
  const [toggleState, setToggleState] = useState(false);

  const variants = {
    hidden: { opacity: 0, y: -20, zIndex: -1 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
      zIndex: 150,
    },
    exit: { opacity: 0, y: 5, transition: { duration: 0.16 } },
  };

  return (
    <menu className={styles.container}>
      <button
        className={styles["container__primary"]}
        onClick={() => setToggleState((previousState) => !previousState)}
      >
        {selectedValue}
        <img src={arrowSrc} alt="Toggle Dropdown" />
      </button>
      <AnimatePresence>
        {toggleState && (
          <>
            {
              <div
                className={styles["container__backdrop"]}
                onClick={() => setToggleState(false)}
              />
            }
            <motion.div
              key="dropdown-options"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className={styles["container__options"]}
            >
              {options.map((option) => (
                <span
                  key={option}
                  onClick={() => {
                    dispatchEvent(option);
                    setToggleState(false);
                  }}
                  className={
                    option === selectedValue
                      ? styles["container__options--active"]
                      : ""
                  }
                >
                  {option}
                </span>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </menu>
  );
};

export default DropDownMenu;
