// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Plus, MoreVertical, MapPin, Eye, Pencil, Trash2,
} from 'lucide-react';
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
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();
  const { areaId: tempAreaId, clearAreaId } = useTempAreaId();

  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Lỗi khi tải danh sách khu vực');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleCreateArea = () => navigate('/areas/edit');

  const handleDeleteArea = async (areaId) => {
    if (!window.confirm('Bạn có chắc muốn xóa khu vực này?')) return;
    try {
      await deleteArea(areaId);
      setAreas((prev) => prev.filter((a) => a._id !== areaId));
      if (areaId === tempAreaId) clearAreaId();
      toast.success('Đã xóa khu vực');
    } catch {
      toast.error('Lỗi xóa khu vực');
    }
  };

  const handleEditName = async (areaId) => {
    try {
      await updateArea(areaId, { name: editName });
      setAreas((prev) =>
        prev.map((a) => (a._id === areaId ? { ...a, name: editName } : a))
      );
      toast.success('Đổi tên thành công');
      setEditingId(null);
    } catch {
      toast.error('Lỗi đổi tên');
    }
  };

  const filteredAreas = areas.filter((a) =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="w-full border-b bg-white shadow-sm">
        <div className="flex w-full max-w-6xl mx-auto px-4 h-16 items-center justify-between">
          <h2 className="text-lg font-semibold">Quản lý bản đồ</h2>
          <button
            onClick={handleCreateArea}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} />
            Tạo bản đồ
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center py-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
        />
      </div>

      {/* Card Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-36 bg-gray-100 animate-pulse rounded-lg"
                  />
                ))
            : filteredAreas.map((area) => (
                <div
                  key={area._id}
                  className="bg-white border rounded-lg shadow hover:shadow-md transition relative flex flex-col justify-between p-4"
                >
                  <div>
                    <h3 className="text-base font-medium truncate">
                      {area.name?.trim() || 'Khu chưa đặt tên'}
                    </h3>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <button
                      onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                      className="underline"
                    >
                      Chỉnh sửa vị trí
                    </button>
                    <button
                      onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                      className="underline"
                    >
                      Xem
                    </button>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === area._id ? null : area._id)
                      }
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === area._id && (
                      <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10 w-36">
                        <button
                          onClick={() => {
                            setEditingId(area._id);
                            setEditName(area.name || '');
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <Pencil size={16} /> Đổi tên
                        </button>
                        <button
                          onClick={() => {
                            navigate(ROUTES.POST_MAP(area._id));
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <MapPin size={16} /> Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area._id)}
                          className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2 text-sm"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Edit Name */}
                  {editingId === area._id && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4 rounded-lg">
                      <div className="space-y-2 w-full">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border px-2 py-1 rounded text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditName(area._id)}
                            className="text-green-600 text-sm hover:underline"
                          >Lưu</button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 text-sm hover:underline"
                          >Hủy</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
