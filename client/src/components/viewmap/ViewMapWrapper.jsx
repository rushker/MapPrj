// src/components/viewmap/ViewMapWrapper.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LeafletMap from '../postmap/draw/LeafletMap';
import { getAreaById } from '../../services/areas';
import { getEntitiesByArea } from '../../services/entities';
import toast from 'react-hot-toast';
import { AreaProvider } from '../../context/AreaContext';

export default function ViewMapWrapper() {
  const { areaId } = useParams();
  const [area, setArea] = useState(null);
  const [entities, setEntities] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areaRes, entityRes] = await Promise.all([
          getAreaById(areaId),
          getEntitiesByArea(areaId),
        ]);
        setArea(areaRes || null);
        setEntities(entityRes || []);
      } catch (err) {
        toast.error('Không thể tải dữ liệu bản đồ');
        console.error('Lỗi khi tải ViewMap:', err);
      } finally {
        setLoading(false);
      }
    };

    if (areaId) fetchData();
  }, [areaId]);

  if (loading) return <div className="text-center mt-8">Đang tải bản đồ...</div>;
  if (!area) return <div className="text-center mt-8 text-red-500">Không tìm thấy khu vực</div>;

  return (
    <AreaProvider isEditMode={false}> {/* Wrap với isEditMode=false */}
      <LeafletMap
        areaMetadata={area}
        entities={entities}
        selectedEntityId={selectedEntityId}
        onSelectEntity={setSelectedEntityId}
        enableDraw={false}
        enableEdit={false}
        enableDrag={false}
        enableRemove={false}
      />
    </AreaProvider>
  );
}