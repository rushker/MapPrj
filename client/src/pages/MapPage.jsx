//client/src/pages/MapPage.jsx
import { MapContainer, ImageOverlay, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { useState } from 'react';

const bounds = [[0,0], [1000,1000]];

export default function MapPage() {
  const [features, setFeatures] = useState([]);

  const _onCreate = (e) => {
    console.log(e.layer.toGeoJSON());
    setFeatures([...features, e.layer.toGeoJSON()]);
  };

  return (
    <div className="h-screen w-full">
      <MapContainer center={[500, 500]} zoom={-1} style={{ height: "100%", width: "100%" }}>
        <ImageOverlay
          url="/yourmap.png"
          bounds={bounds}
        />
        <FeatureGroup>
          <EditControl
            position='topright'
            onCreated={_onCreate}
            draw={{
              rectangle: true,
              polygon: true,
              circle: false,
              marker: true,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
