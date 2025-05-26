// components/postmap/layers/EntityLayer.jsx
import PolygonLayer from '../shapes/PolygonLayer';
import MarkerLayer from '../shapes/MarkerLayer';

const EntityLayer = ({ khuCs = [], markers = [] }) => {
  return (
    <>
      <PolygonLayer entities={khuCs} />
      <MarkerLayer entities={markers} />
    </>
  );
};

export default EntityLayer;
