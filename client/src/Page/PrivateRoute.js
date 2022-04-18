import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { user, isLogged } = useSelector(state => state.auth);
  const isUser = user && isLogged;

  return isUser ? children : <Navigate to='/auth' />;
};
export default PrivateRoute;
