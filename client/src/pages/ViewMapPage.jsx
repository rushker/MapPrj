// src/pages/ViewMapPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewMapWrapper from '../components/viewmap/ViewMapWrapper';
import { getAreaById } from '../services/areas';
import { getEntitiesByArea } from '../services/entities';

export default function ViewMapPage() {
  const { areaId } = useParams();
  const navigate = useNavigate();

  const [khuA, setKhuA] = useState(null);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const areaData = await getAreaById(areaId);
        if (!areaData) throw new Error('Không tìm thấy khu vực');

        // Tham số đúng là projectId, areaId
        const entityData = await getEntitiesByArea(areaData.project, areaId);
        
        setKhuA(areaData);
        setEntities(entityData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [areaId]);

  if (loading) return <div className="p-4">Đang tải bản đồ...</div>;
  if (error) return <div className="p-4 text-red-600">Lỗi: {error.message}</div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chế độ xem bản đồ</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(`/projects/${khuA.project}/areas/${khuA._id}/edit`)}
        >
          Quay lại chỉnh sửa
        </button>
      </header>
      <main className="flex-grow">
        <ViewMapWrapper khuA={khuA} entities={entities} />
      </main>
    </div>
  );
}
