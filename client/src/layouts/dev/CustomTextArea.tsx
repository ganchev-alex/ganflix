import styles from "./CustomInput.module.scss";

const CustomTextArea: React.FC<{
  label: string;
  onChange: any;
  value: string | readonly string[] | undefined;
  readonly?: boolean;
}> = function ({ label, onChange, value, readonly }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={label} className={styles["wrapper__label"]}>
        {label}
      </label>
      <textarea
        readOnly={readonly}
        name={label}
        className={styles["wrapper__textarea"]}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default CustomTextArea;
