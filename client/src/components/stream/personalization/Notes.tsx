import { useState } from "react";
import styles from "./Notes.module.scss";

const Notes: React.FC<{
  notesValue: string;
  onNotesChange: (value: any) => any;
}> = function ({ notesValue, onNotesChange }) {
  return (
    <section className={styles.wrapper}>
      <h2>Thoughts and Notes</h2>
      <textarea
        className={styles["wrapper__notepad"]}
        onChange={(e) => onNotesChange(e.target.value)}
        value={notesValue}
        placeholder="Type down your thoughts and feelings..."
      />
    </section>
  );
};

export default Notes;
