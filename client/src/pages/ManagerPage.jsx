// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Plus, MoreVertical, Pencil, Trash2,
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

  const handleCreateArea = () => navigate(ROUTES.POST_MAP());

  const handleDeleteArea = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khu vực này?')) return;
    try {
      await deleteArea(id);
      setAreas((prev) => prev.filter((a) => a._id !== id));
      if (id === tempAreaId) clearAreaId();
      toast.success('Đã xóa khu vực');
    } catch {
      toast.error('Lỗi xóa khu vực');
    }
  };

  const handleEditName = async (id) => {
    try {
      await updateArea(id, { name: editName });
      setAreas((prev) => prev.map((a) => (a._id === id ? { ...a, name: editName } : a)));
      toast.success('Đổi tên thành công');
      setEditingId(null);
    } catch {
      toast.error('Lỗi đổi tên');
    }
  };

  const filtered = areas.filter(a =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="w-full border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quản lý bản đồ</h2>
          <button
            onClick={handleCreateArea}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} />
            Tạo bản đồ
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
        />
      </div>

      {/* Table List */}
      <div className="overflow-x-auto px-4 mt-6">
        <div className="max-w-6xl mx-auto border border-gray-200 rounded-lg shadow-sm bg-white">
          {/* Table Header */}
          <div className="grid grid-cols-4 text-gray-700 bg-gray-100 border-b px-4 py-3 font-medium text-sm">
            <div className="truncate">Tên khu vực</div>
            <div className="truncate">Chỉnh sửa vị trí</div>
            <div className="truncate">Xem</div>
            <div className="text-right">Tùy chọn</div>
          </div>

          {/* Table Rows */}
          {isLoading
            ? Array(3).fill().map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 px-4 py-3 border-b animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/5" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 justify-self-end" />
                </div>
              ))
            : filtered.length === 0
            ? (
              <div className="text-center py-6 text-gray-500">
                Không có khu vực nào
              </div>
            )
            : filtered.map(area => (
              <div
                key={area._id}
                className="group grid grid-cols-4 px-4 py-3 items-center border-b hover:bg-gray-50 transition relative"
              >
                {/* Name */}
                <div className="truncate">
                  {editingId === area._id
                    ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="border px-2 py-1 rounded w-full text-sm"
                        />
                        <button
                          onClick={() => handleEditName(area._id)}
                          className="text-green-600 text-xs hover:underline"
                        >Lưu</button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 text-xs hover:underline"
                        >Hủy</button>
                      </div>
                    )
                    : (
                      <span
                        onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                        className="cursor-pointer text-blue-600 hover:underline"
                      >
                        {area.name?.trim() || 'Khu chưa đặt tên'}
                      </span>
                    )
                  }
                </div>

                {/* Edit Link */}
                <div
                  onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                  className="cursor-pointer text-blue-600 hover:underline truncate"
                >Chỉnh sửa vị trí</div>

                {/* View Link */}
                <div
                  onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                  className="cursor-pointer text-blue-600 hover:underline truncate"
                >Xem</div>

                {/* Options Menu */}
                <div className="absolute right-4">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === area._id ? null : area._id)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === area._id && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10 w-36">
                      <button
                        onClick={() => { setEditingId(area._id); setEditName(area.name); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                      >
                        <Pencil size={16} /> Đổi tên
                      </button>
                      <button
                        onClick={() => { navigate(ROUTES.POST_MAP(area._id)); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                      >
                        <MapPin size={16} /> Chỉnh sửa
                      </button>
                      <button
                        onClick={() => { handleDeleteArea(area._id); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2 text-sm"
                      >
                        <Trash2 size={16} /> Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
