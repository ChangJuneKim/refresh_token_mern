import { useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaChevronDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import SnackBar from '../UI/SnackBar/SnackBar';
import { getToken, getUser, login, logout } from '../../store/auth-slice';

import styles from './Header.module.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLogged, token } = useSelector(state => state.auth);

  const fetchAccessTokenHandler = useCallback(async () => {
    const res = await axios.post('/api/v1/auth/refresh_token', null);

    dispatch(getToken(res.data.accessToken));
  }, [dispatch]);

  const fetchUserData = useCallback(
    async token => {
      const res = await axios('/api/v1/user/info', {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(getUser({ user: res.data, isAdmin: res.data.role }));
    },
    [dispatch]
  );

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');

    if (firstLogin) {
      fetchAccessTokenHandler();
      dispatch(login());
    }
  }, [isLogged, dispatch, fetchAccessTokenHandler]);

  useEffect(() => {
    if (!!token) {
      fetchUserData(token);
    }
  }, [fetchUserData, token]);

  const logoutHandler = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      localStorage.removeItem('firstLogin');
      dispatch(logout());
      navigate('/', { replace: true });
    } catch (err) {
      navigate('/', { replace: true });
    }
  };

  const userLink = (
    <li className={`${styles['drop-nav']} ${styles['nav-item']}`}>
      <Link to='#' className={styles.avatar}>
        <img src={user.avatar} alt={user.name} />
        {user.name}
        <FaChevronDown />
      </Link>
      <ul className={styles.sub}>
        <li>
          <Link to='profile'>마이페이지</Link>
        </li>
        <li onClick={logoutHandler}>
          <Link to='/'>로그아웃</Link>
        </li>
      </ul>
    </li>
  );

  return (
    <header className={styles.header}>
      <SnackBar />
      <div className={styles.logo}>
        <h1>
          <Link to='/'>boilerplate</Link>
        </h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li className={styles['nav-item']}>
            <NavLink to='/' className={navData => (navData.isActive ? styles.active : '')}>
              <FaHome />
              Home
            </NavLink>
          </li>
          <li className={styles['nav-item']}>
            <NavLink to='cart' className={navData => (navData.isActive ? styles.active : '')}>
              <FaShoppingCart />
              cart
            </NavLink>
          </li>
          {isLogged ? (
            userLink
          ) : (
            <li className={styles['nav-item']}>
              <NavLink to='auth' className={navData => (navData.isActive ? styles.active : '')}>
                <FaUser />
                sign in
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default Header;
