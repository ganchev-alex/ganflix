import { useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { RootState } from "../../store/store";

import Navigation from "./Navigation";
import Controls from "./Control";
import DevOptionsModal from "../dev/DevOptions";

import styles from "./RootLayout.module.scss";

const RootLayout: React.FC = function () {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const devVisibility = useSelector(
    (state: RootState) => state.ui.devOptions.visibility
  );
  const colorLigth = useSelector(
    (state: RootState) => state.comsetics.backlights.colorful
  );

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className={styles.application}>
      <aside className={styles["application__controlls"]}>
        <Navigation />
        <Controls />
      </aside>
      <main className={styles["application__main"]} ref={mainRef} id="main">
        <motion.div
          animate={{ backgroundColor: colorLigth as string }}
          className={styles["application__colorful-backlight"]}
        />
        <Outlet />
      </main>
      {devVisibility && <DevOptionsModal />}
    </div>
  );
};

export default RootLayout;
