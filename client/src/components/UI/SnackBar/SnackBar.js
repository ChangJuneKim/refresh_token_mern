import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import styles from './SnackBar.module.css';
import { closeSnackBar } from '../../../store/snack-slice';

const SnackBar = () => {
  const dispatch = useDispatch();

  const { visible, message, type } = useSelector(state => state.snackBar);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        dispatch(closeSnackBar());
      }, 3000);
    }
  }, [visible, dispatch]);

  return (
    <>
      {ReactDOM.createPortal(
        <div
          className={`${styles.snackbar} ${type === 'success' ? styles.success : styles.fail}`}
          id={visible ? styles.show : styles.hide}
        >
          <div className={styles.symbol}>
            {type === 'success' ? (
              <h1>
                <FaCheckCircle />
              </h1>
            ) : (
              <h1>
                <FaTimesCircle />
              </h1>
            )}
          </div>
          <div className={styles.message}>{message}</div>
        </div>,
        document.getElementById('snackbar-root')
      )}
    </>
  );
};
export default SnackBar;
