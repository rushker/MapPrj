// src/components/viewmap/p2v/LockViewController.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * LockViewController - Giới hạn tương tác và phạm vi bản đồ
 * @param {boolean} locked - Có khóa tương tác không
 * @param {L.LatLngBounds} maxBounds - Phạm vi tối đa (ví dụ bao quanh Khu A + padding)
 * @param {number} zoomLevel - Mức zoom cố định nếu muốn
 */
export default function LockViewController({ locked = false, maxBounds, zoomLevel }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (locked) {
      if (zoomLevel != null && map.getZoom() !== zoomLevel) {
        map.setZoom(zoomLevel);
      }
      if (maxBounds) {
        map.setMaxBounds(maxBounds);
      }

      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.dragging.disable();
      if (map.zoomControl) map.zoomControl.remove();
    } else {
      map.setMaxBounds(null);
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.dragging.enable();
      if (map.zoomControl && !map.zoomControl._container) {
        map.zoomControl.addTo(map);
      }
    }
  }, [locked, maxBounds, zoomLevel]);

  return null;
}
