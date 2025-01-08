import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Add from './pages/add';
import Login from './pages/login';
import Signup from './pages/signup';
import './app.scss';
import { message } from 'antd';

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <Signup messageApiApp={messageApi} />,
    },
    {
      path: '/login',
      element: <Login messageApiApp={messageApi} />,
    },
    {
      path: '/add',
      element: <Add />,
    },
  ]);

  return (
    <div className="app">
      <div className="container-app">
        {contextHolder}
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
