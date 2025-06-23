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
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tải danh sách khu vực');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAreas();
  }, []);

  const handleCreateArea = () => navigate('/areas/edit');

  const handleDeleteArea = async (areaId) => {
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
    <div className="min-h-screen bg-white text-sm text-gray-800">
      {/* Header */}
      <div className="w-full border-b bg-white shadow-sm">
        <div className="flex w-full max-w-6xl mx-auto px-4 h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Quản lý bản đồ</h1>
          <button
            onClick={handleCreateArea}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Tạo bản đồ
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center py-6">
        <input
          type="text"
          placeholder="Tìm theo tên khu vực..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4">
        <div className="max-w-6xl mx-auto border border-gray-200 rounded-lg shadow-sm bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-3 md:grid-cols-4 font-medium text-gray-700 bg-gray-100 border-b border-gray-200 h-12 items-center text-sm px-4">
            <div>Tên khu vực</div>
            <div>Chỉnh sửa vị trí</div>
            <div>Xem</div>
            <div className="text-right">Tùy chọn</div>
          </div>

          {/* Table Content */}
          {isLoading ? (
            Array(3).fill().map((_, idx) => (
              <div key={idx} className="grid grid-cols-3 md:grid-cols-4 h-12 items-center px-4 border-b border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-3/5" />
                <div className="h-4 bg-gray-200 rounded w-2/3 justify-self-end" />
              </div>
            ))
          ) : filteredAreas.length === 0 ? (
            <div className="text-center py-6 text-gray-500">Không có khu vực nào</div>
          ) : (
            filteredAreas.map((area) => (
              <div
                key={area._id}
                className="grid grid-cols-3 md:grid-cols-4 h-12 items-center px-4 border-b border-gray-100 hover:bg-gray-100 relative text-sm transition"
              >
                {/* Tên khu vực */}
                <div className="truncate">
                  {editingId === area._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border px-2 py-1 rounded w-full text-sm"
                      />
                      <button
                        onClick={() => handleEditName(area._id)}
                        className="text-green-600 text-xs hover:underline"
                      >Lưu</button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 text-xs hover:underline"
                      >Huỷ</button>
                    </div>
                  ) : (
                    <span
                      onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                      className="cursor-pointer text-blue-600 hover:underline"
                    >
                      {area.name?.trim() || 'Khu chưa đặt tên'}
                    </span>
                  )}
                </div>

                {/* Điều hướng chỉnh sửa */}
                <div
                  onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                  className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 truncate"
                >
                  <MapPin size={16} />
                  Đến khu vực
                </div>

                {/* Xem */}
                <div
                  onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                  className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Eye size={16} />
                  Xem
                </div>

                {/* Dropdown */}
                <div className="flex justify-end relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === area._id ? null : area._id)
                    }
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === area._id && (
                    <div className="absolute right-0 top-10 bg-white border rounded-md shadow-lg z-10 w-40">
                      <button
                        onClick={() => {
                          setEditingId(area._id);
                          setEditName(area.name || '');
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        Đổi tên
                      </button>
                      <button
                        onClick={() => {
                          navigate(ROUTES.POST_MAP(area._id));
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <MapPin size={16} />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDeleteArea(area._id);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Xoá
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
