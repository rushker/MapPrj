//hooks/useMapEvents.js
import { useRef } from 'react';

export default function useMapEvents({ onPolygonCreate, onMarkerCreate }) {
  const drawControlsRef = useRef(null);

  const handleMapClick = (e) => {
    // Nếu đang ở chế độ vẽ marker → gọi onMarkerCreate
    const marker = {
      latlng: e.latlng,
      name: 'Mới',
    };
    onMarkerCreate(marker);
  };

  return {
    drawControlsRef,
    handleMapClick,
  };
}
