import React, { useEffect, useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/home';
import { url } from './utils/variables';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import Add from './pages/add';
import Signup from './pages/signup';

function App() {
  const [user, setUser] = useState(null);
  const isAuth = useMemo(() => !!user, [user]);

  // useEffect(() => {
  //   fetch(`${url}/api/user`, {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then(async (res) => res.json())
  //     .then((res) => {
  //       if (res.success) {
  //         setUser(res.data);
  //       } else {
  //         throw new Error(res.data.msg);
  //       }
  //     })
  //     .catch((error) => console.error('Failed to fetch user data:', error));
  // }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <Signup/>,
    },
    // {
    //   path: '/login',
    //   element: <Login setUser={setUser} />,
    // },
    // {
    //   path: '/register',
    //   element: <Register setUser={setUser} />,
    // },
    {
      path: '/add',
      element: <Add />,
    },
  ]);

  return (
    <div className="app">
      <div className="container-app">
        <RouterProvider router={router} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
