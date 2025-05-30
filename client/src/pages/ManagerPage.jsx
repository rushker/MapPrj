// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getAllAreas,
  deleteArea,
  updateArea,
} from '../services/areas';
import { ROUTES } from '../routes';
import { useTempAreaId } from '../hooks/local/useTempAreaId';

const ManagerPage = () => {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const navigate = useNavigate();
  const { areaId: tempAreaId, clearAreaId } = useTempAreaId();

  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách khu vực');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleCreateArea = () => {
    navigate('/areas/edit');
  };

  const handleDeleteArea = async (areaId, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm('Bạn có chắc muốn xoá khu vực này?');
    if (!confirmed) return;

    try {
      await deleteArea(areaId);
      setAreas((prev) => prev.filter((a) => a._id !== areaId));
      if (areaId === tempAreaId) clearAreaId();
      toast.success('Đã xoá khu vực');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xoá khu vực');
    }
  };

  const handleEditName = async (areaId) => {
    try {
      await updateArea(areaId, { name: editName });
      setAreas((prev) =>
        prev.map((a) => (a._id === areaId ? { ...a, name: editName } : a))
      );
      toast.success('Đổi tên khu vực thành công');
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi đổi tên khu vực');
    }
  };

  const filteredAreas = areas.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý Khu A</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên khu A..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleCreateArea}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Khu A mới
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Đang tải khu A...</p>
      ) : filteredAreas.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy khu A nào.</p>
      ) : (
        <div className="space-y-4">
          {filteredAreas.map((area) => (
            <div
              key={area._id}
              className="flex justify-between items-center bg-white border rounded px-4 py-3 shadow-sm hover:bg-gray-50"
            >
              <div className="flex-1">
                {editingId === area._id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                    <button
                      onClick={() => handleEditName(area._id)}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 text-sm hover:underline"
                    >
                      Huỷ
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                    className="cursor-pointer text-blue-600 hover:underline text-lg font-medium"
                  >
                    {area.name?.trim() || 'Khu chưa đặt tên'}
                  </span>
                )}
              </div>

              <div className="flex gap-3 ml-4">
                <button
                  onClick={() => {
                    setEditingId(area._id);
                    setEditName(area.name || '');
                  }}
                  className="text-yellow-600 hover:underline text-sm"
                >
                  Sửa tên
                </button>
                <button
                  onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={(e) => handleDeleteArea(area._id, e)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
