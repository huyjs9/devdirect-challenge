import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import Admin from 'pages/Admin';
import Consumer from 'pages/Consumer';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/admin' replace={true} />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/consumer',
    element: <Consumer />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
