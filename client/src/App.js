import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import NotFound from './components/UI/NotFound/NotFound';
import { ActivationEmail, AuthForm, DashBoard, PrivateRoute, ForgotPassword, ResetPassword } from './Page';

function App() {
  return (
    <div className='App'>
      <Header />
      <main>
        <Routes>
          <Route
            path='/'
            element={
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            }
          />
          <Route path='auth' element={<AuthForm />} />
          <Route path='forgotpassword' element={<ForgotPassword />} />
          <Route path='resetpassword/:reset_token' element={<ResetPassword />} />
          <Route path='auth/activate/:activation_token' element={<ActivationEmail />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
