import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackBar } from '../../store/snack-slice';

import styles from './AuthForm.module.css';

const ActivationEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = useSelector(state => state.snackBar);
  const { activation_token: activationToken } = useParams();

  const activateAccount = useCallback(async () => {
    try {
      const res = await axios({
        method: 'post',
        url: '/api/v1/auth/activate',
        data: {
          activation_token: activationToken,
        },
      });

      const { msg } = res.data;
      if (msg) {
        dispatch(openSnackBar({ msg, type: 'success' }));
      }
    } catch (error) {
      // strict mode 에서 두번 실행돼서 error메세지도 뜨는거 같음
      const { msg } = error.response.data;
      if (msg) {
        dispatch(openSnackBar({ msg, type: 'fail' }));
      }
    }
  }, [activationToken, dispatch]);

  useEffect(() => {
    if (activationToken) {
      activateAccount();
    }
  }, [activateAccount, activationToken]);

  useEffect(() => {
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 5000);
  }, [navigate]);
  return <div className={styles.activation}>{message}</div>;
};
export default ActivationEmail;
