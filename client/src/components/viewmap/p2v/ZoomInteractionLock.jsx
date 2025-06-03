// components/viewmap/p2v/ZoomInteractionLock.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const ZoomInteractionLock = ({ locked }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (locked) {
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }

    return () => {
      // Always clean up (re-enable interactions)
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    };
  }, [locked, map]);

  return null;
};

export default ZoomInteractionLock;
