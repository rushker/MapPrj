// src/pages/HomePage.jsx
import MapView from '../components/MapView';

const HomePage = ({ mapImageUrl }) => {
  return (
    <div className="h-full p-4">
      <div className="bg-white rounded-lg shadow-md h-full overflow-hidden">
        <MapView mapImageUrl={mapImageUrl} />
      </div>
    </div>
  );
};

export default HomePage;