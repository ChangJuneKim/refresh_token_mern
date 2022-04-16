import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>
          <Link to='/'>boilerplate</Link>
        </h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink to='cart' className={navData => (navData.isActive ? styles.active : '')}>
              <FaShoppingCart />
              cart
            </NavLink>
          </li>
          <li>
            <NavLink to='login' className={navData => (navData.isActive ? styles.active : '')}>
              <FaUser />
              sign in
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
