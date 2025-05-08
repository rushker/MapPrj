// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import createAppRouter from './router';

function App() {
  return <RouterProvider router={createAppRouter()} />;
}

export default App;
