import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Body from './components/Body/Body';
import Login from './components/Body/Login/Login';

function App() {
  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/*' element={<Body />}>
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
