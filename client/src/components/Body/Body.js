import { Outlet } from 'react-router-dom';

const Body = () => {
  return (
    <section>
      body
      <Outlet />
    </section>
  );
};
export default Body;
