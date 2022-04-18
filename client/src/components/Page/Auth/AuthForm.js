import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../UI/Button/Button';
import styles from './AuthForm.module.css';

import { useDispatch } from 'react-redux';
import { openSnackBar } from '../../../store/snack-slice';
import { login } from '../../../store/auth-slice';
// import { register } from '../../../store/auth-slice';

const AuthForm = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ email: '', name: '', password: '', confirmPassword: '' });
  const { email, name, password, confirmPassword } = inputs;

  let url;
  const submitHandler = async e => {
    e.preventDefault();
    if (isLoginPage) {
      url = 'api/v1/auth/login';
    } else {
      url = 'api/v1/auth/register';
    }

    try {
      const res = await axios({
        method: 'post',
        url,
        data: {
          email,
          name,
          password,
          confirmPassword,
        },
      });
      const { msg } = res.data;

      dispatch(openSnackBar({ msg, type: 'success' }));

      // dispatch(register());

      if (isLoginPage) {
        dispatch(login());
        localStorage.setItem('firstLogin', true);
      }
      navigate('/', { replace: true });
    } catch (error) {
      const { msg } = error.response.data;

      dispatch(openSnackBar({ msg, type: 'fail' }));
    }
  };

  const inputChangeHandler = e => {
    const { name, value } = e.target;
    setInputs(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={styles.container}>
      {isLoginPage && <h2>Login</h2>}
      {!isLoginPage && <h2>Register</h2>}

      <form onSubmit={submitHandler}>
        {!isLoginPage && (
          <div>
            <label htmlFor='name'>이름</label>
            <input
              type='text'
              placeholder='이름을 입력해주세요.'
              id='name'
              name='name'
              value={name}
              onChange={inputChangeHandler}
            />
          </div>
        )}

        <div>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            placeholder='이메일을 입력해주세요.'
            id='email'
            name='email'
            value={email}
            onChange={inputChangeHandler}
          />
        </div>

        <div>
          <label htmlFor='password'>비밀번호 (6자 이상)</label>
          <input
            type='password'
            placeholder='비밀번호를 입력해주세요.'
            id='password'
            name='password'
            value={password}
            onChange={inputChangeHandler}
          />
        </div>

        {!isLoginPage && (
          <div>
            <label htmlFor='confirm_password'>비밀번호 확인</label>
            <input
              type='password'
              placeholder='이메일을 다시 입력해주세요.'
              id='confirm_password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={inputChangeHandler}
            />
          </div>
        )}

        <div className={styles.action}>
          {isLoginPage && <Button type='submit'>로그인</Button>}
          {!isLoginPage && <Button type='submit'>회원가입</Button>}
          <div>
            {isLoginPage && (
              <p onClick={() => setIsLoginPage(state => !state)}>
                아직 계정이 없으신가요?<u>회원가입</u>
              </p>
            )}
            {!isLoginPage && (
              <p onClick={() => setIsLoginPage(state => !state)}>
                이미 계정이 있으신가요? <u>로그인</u>
              </p>
            )}
            {isLoginPage && <Link to='/forgotpassword'>비밀번호를 잊으셨나요?</Link>}
          </div>
        </div>
      </form>
    </div>
  );
};
export default AuthForm;
