// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/App.js
import MapView from './components/MapView';

function App() {
  return (
    <div className="w-full h-screen">
      <MapView />
    </div>
  );
}

export default App;