// components/viewmap/p2v/ZoomInteractionLock.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Lock các tương tác zoom, pan, v.v. nếu `locked = true`
 * Đồng thời set maxZoom nếu truyền vào
 */
const ZoomInteractionLock = ({ locked }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const toggle = locked ? 'disable' : 'enable';
    map.scrollWheelZoom[toggle]();
    map.doubleClickZoom[toggle]();
    map.touchZoom[toggle]();
    map.boxZoom[toggle]();
    map.keyboard[toggle]();

    return () => {
      // Luôn mở lại khi unmount
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

