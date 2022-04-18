import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackBar } from '../store/snack-slice';
import axios from 'axios';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ password: '', confirmPassword: '' });
  const { reset_token: resetToken } = useParams();

  const { password, confirmPassword } = inputs;

  const resetPasswordHandler = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      dispatch(openSnackBar({ msg: '비밀번호가 일치하지 않습니다.', type: 'fail' }));
    }

    try {
      const res = await axios({
        method: 'patch',
        url: `/api/v1/user/resetpassword/${resetToken}`,
        data: {
          password,
          confirmPassword,
        },
      });

      const { msg } = res.data;

      dispatch(openSnackBar({ msg, type: 'success' }));
      navigate('/auth', { replace: true });
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
    <div className='resetpassword-screen'>
      <form onSubmit={resetPasswordHandler}>
        <h3>새로운 비밀번호로 변경해주세요.</h3>

        <div>
          <label htmlFor='password'>새 비밀번호</label>
          <input
            type='password'
            required
            id='password'
            name='password'
            value={password}
            placeholder='비밀번호를 입력해주세요.'
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <label htmlFor='confirmpassword'>비밀번호 확인</label>
          <input
            type='password'
            required
            id='confirmpassword'
            name='confirmPassword'
            value={confirmPassword}
            placeholder='비밀번호를 다시 입력해주세요.'
            onChange={inputChangeHandler}
          />
        </div>
        <button type='submit'>비밀번호 초기화</button>
      </form>
    </div>
  );
};
export default ResetPassword;
