import styles from "./CustomInput.module.scss";

const CustomInput: React.FC<{
  label: string;
  type: string;
  onChange: any;
  value: string | number | readonly string[] | boolean | undefined;
  width?: number;
}> = function ({ label, type, width, onChange, value }) {
  return (
    <div
      className={styles.wrapper}
      style={{
        width: `${width}%`,
        flexDirection: type === "checkbox" ? "row" : "column",
        alignItems: type === "checkbox" ? "center" : "flex-start",
        alignSelf: type === "checkbox" ? "flex-end" : "auto",
        marginBottom: type === "checkbox" ? "0.8em" : "0",
      }}
    >
      <label htmlFor={label} className={styles["wrapper__label"]}>
        {label}
      </label>
      <input
        type={type}
        name={label}
        className={styles["wrapper__input"]}
        style={
          type === "checkbox"
            ? { width: "fit-content", marginTop: "1em" }
            : { width: "100%", marginTop: "0" }
        }
        onChange={(e) =>
          type === "checkbox"
            ? onChange(e.target.checked)
            : onChange(e.target.value)
        }
        value={typeof value != "boolean" ? value : undefined}
        checked={typeof value == "boolean" ? value : undefined}
        autoComplete="off"
      />
    </div>
  );
};

export default CustomInput;
