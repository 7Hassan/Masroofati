import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Add from './pages/add';
import Login from './pages/login';
import Signup from './pages/signup';
import './app.scss';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/login',
      element: <Login />,
    },
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
    </div>
  );
}

export default App;
