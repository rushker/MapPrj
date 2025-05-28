// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getAllAreas, createArea, deleteArea } from '../services/areas';
import { ROUTES } from '../routes';

const ManagerPage = () => {
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load danh sách khu vực
  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách khu vực');
        setAreas([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleCreateArea = async () => {
    try {
      const { data: newArea } = await createArea({
        name: '',
        type: 'khuA',
        polygon: { coordinates: [] },
      });
      toast.success('Tạo khu vực thành công');
      navigate(ROUTES.POST_MAP(newArea._id));
    } catch (err) {
      console.error(err);
      toast.error('Không thể tạo khu vực');
    }
  };

  const handleDeleteArea = async (areaId, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm('Bạn có chắc muốn xoá khu vực này?');
    if (!confirmed) return;
    try {
      await deleteArea(areaId);
      setAreas((prev) => prev.filter((a) => a._id !== areaId));
      toast.success('Đã xoá khu vực');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xoá khu vực');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý Khu vực</h1>

      <button
        onClick={handleCreateArea}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Tạo khu vực mới
      </button>

      {isLoading ? (
        <p className="text-gray-500">Đang tải danh sách khu vực...</p>
      ) : areas.length === 0 ? (
        <p className="text-gray-500">Chưa có khu vực nào.</p>
      ) : (
        <div className="space-y-3">
          {areas.map((area) => (
            <div
              key={area._id}
              className="p-4 border rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
            >
              <span
                onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                {area.name?.trim() || 'Khu chưa đặt tên'}
              </span>
              <button
                onClick={(e) => handleDeleteArea(area._id, e)}
                className="text-red-500 hover:underline"
              >
                Xoá
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
