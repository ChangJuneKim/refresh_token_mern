import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <h3>sorry, the page you tried cannot be found</h3>
      <Link to='/' className='btn'>
        back to home
      </Link>
    </div>
  );
};
export default NotFound;
