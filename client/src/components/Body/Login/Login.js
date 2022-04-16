import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../../UI/Button/Button';
import styles from './Login.module.css';
import SnackBar from '../../utils/SnackBar/SnackBar';

import { useDispatch, useSelector } from 'react-redux';
import { openSnackBar, closeSnackBar } from '../../../store/snack-slice';

const Login = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const { visible } = useSelector(state => state.snackBar);

  useEffect(() => {
    if (visible) {
      setTimeout(() => dispatch(closeSnackBar()), 3000);
    }
  }, [visible, dispatch]);

  const { email, password } = inputs;

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'post',
        url: 'api/v1/auth/login',
        data: {
          email,
          password,
        },
      });
      const { msg } = res.data;

      dispatch(openSnackBar({ msg, type: 'success' }));

      localStorage.setItem('firstLogin', true);
    } catch (error) {
      const { msg } = error.response.data;
      console.log(msg);
      dispatch(openSnackBar({ msg, type: 'fail' }));
    }
  };

  const inputChangeHandler = e => {
    const { name, value } = e.target;
    setInputs(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <SnackBar />
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor='email'>email</label>
          <input
            type='text'
            placeholder='이메일을 입력해주세요.'
            id='email'
            name='email'
            value={email}
            onChange={inputChangeHandler}
          />
        </div>

        <div>
          <label htmlFor='password'>password</label>
          <input
            type='password'
            placeholder='비밀번호를 입력해주세요.'
            id='password'
            name='password'
            value={password}
            onChange={inputChangeHandler}
          />
        </div>

        <div className={styles.action}>
          <Button type='submit'>로그인</Button>
          <Link to='/forgotpassword'>비밀번호를 잊으셨나요?</Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
