import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import styles from './Navbar.module.css';

export const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      void navigate('/login');
    } catch (error: unknown) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <Link to='/dashboard' className={styles.brand}>
              Notifier
            </Link>
            <div className={styles.nav}>
              <Link to='/dashboard' className={styles.navLink}>
                Dashboard
              </Link>
              <Link to='/todos' className={styles.navLink}>
                Todos
              </Link>
              <Link to='/notes' className={styles.navLink}>
                Notes
              </Link>
              <Link to='/reminders' className={styles.navLink}>
                Reminders
              </Link>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
