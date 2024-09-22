import { useEffect } from 'react';
import './App.css'
import { useAppDispatch } from './store/storeHooks';
import { checkAuth } from './store/features/userActions';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import UnauthRoute from './components/UnauthRoute';

import Header from './components/Header';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPd from "./pages/ResetPd.tsx";
import TypeResetPd from './pages/TypeResetPd.tsx';

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  return <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
      <Route path="/login" element={<UnauthRoute><Login /></UnauthRoute>} />
      <Route path="/register" element={<UnauthRoute><Register /></UnauthRoute>} />
      <Route path="/reset" element={<UnauthRoute><ResetPd /></UnauthRoute>} />
      <Route path="/passwordReset" element={<TypeResetPd />} />
    </Routes>
  </BrowserRouter>;
}

export default App;
