// src/App.jsx
import React from 'react';
import AppRouter from './router';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}
