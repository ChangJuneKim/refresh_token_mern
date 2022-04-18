import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { openSnackBar } from '../store/snack-slice';
import Button from '../components/UI/Button/Button';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [emailInput, setEmailInput] = useState('');

  const inputChangeHandler = e => {
    setEmailInput(e.target.value);
  };

  const submitHandler = async e => {
    e.preventDefault();

    if (!emailInput.trim()) return;

    try {
      const res = await axios({
        method: 'post',
        url: 'api/v1/user/forgotpassword',
        data: {
          email: emailInput,
        },
      });

      const { msg } = res.data;

      dispatch(openSnackBar({ msg, type: 'success' }));
    } catch (error) {
      const { msg } = error.response.data;
      dispatch(openSnackBar({ msg, type: 'fail' }));
    }
  };

  return (
    <div className={styles.container}>
      <h2>비밀번호를 잊으셨나요?</h2>
      <form onSubmit={submitHandler}>
        <label htmlFor='email'>가입하신 이메일을 입력해주세요.</label>
        <input
          type='email'
          name='email'
          id='email'
          value={emailInput}
          onChange={inputChangeHandler}
          placeholder='가입하신 이메일을 입력해주세요.'
        />

        <Button type='submit'>이메일으로 링크 보내기</Button>
      </form>
    </div>
  );
};
export default ForgotPassword;
