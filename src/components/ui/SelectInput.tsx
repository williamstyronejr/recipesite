import { useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import styles from './styles/selectInput.module.css';

const SelectInput = ({
  name,
  options,
  value,
  changeValue,
  title = '',
}: {
  name: string;
  options: string[];
  value: string;
  title?: string;
  changeValue: Function;
}) => {
  const [active, setActive] = useState(false);
  const ref = useOutsideClick({
    active,
    closeEvent: () => {
      setActive(false);
    },
    ignoreButton: true,
  });

  return (
    <>
      <div className={styles.custom} ref={ref}>
        <div
          className={`${styles.custom__wrapper} ${
            active ? styles.custom__active : ''
          }`}
        >
          <button
            className={styles.custom__btn}
            type="button"
            onClick={() => {
              setActive((old) => !old);
            }}
          >
            <div className={styles.custom__value}>
              {value !== '' ? value : title}
            </div>
            <span className={styles.custom__arrow}>
              <i className="fas fa-arrow-up" />
            </span>
          </button>

          <div className={styles.options__wrapper}>
            <div className={styles.options}>
              {options.map((option) => (
                <button
                  key={`select-${option}`}
                  className={`transition-colors ${styles.option}`}
                  type="button"
                  onClick={() => {
                    setActive(false);
                    changeValue(option);
                  }}
                  disabled={value === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <input
        type="text"
        name={name}
        className={styles.select}
        value={value}
        onChange={() => {}}
      />
    </>
  );
};

export default SelectInput;
