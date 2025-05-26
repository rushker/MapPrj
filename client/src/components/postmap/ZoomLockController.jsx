//src/components/postmap/ZoomLockController.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function ZoomLockController({ locked = false, zoomLevel }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const disableInteractions = () => {
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.dragging.disable();
      if (map.zoomControl) map.zoomControl.remove();
    };

    const enableInteractions = () => {
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.dragging.enable();
      if (map.zoomControl && !map.zoomControl._container) {
        map.zoomControl.addTo(map);
      }
    };

    if (locked) {
      if (zoomLevel != null && map.getZoom() !== zoomLevel) {
        map.setZoom(zoomLevel);
      }
      disableInteractions();
    } else {
      enableInteractions();
    }
  }, [locked, zoomLevel, map]);

  return null;
}
