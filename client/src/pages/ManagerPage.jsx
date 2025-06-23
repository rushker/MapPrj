// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, MoreVertical } from 'lucide-react';
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
    <div className="min-h-screen bg-white text-sm">
      {/* Header */}
      <div className="w-full h-[72px] border-b border-black/30 bg-black/30 flex items-center justify-center">
        <div className="flex w-full max-w-[1440px] px-4 items-center justify-between">
          <h1 className="text-[20px] font-semibold">Quản lý bản đồ</h1>
          <button
            onClick={handleCreateArea}
            className="flex items-center gap-[15px] bg-[#2A5D87] text-white text-sm font-medium px-4 py-2 rounded-[10px] hover:bg-[#244e71]"
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
          placeholder="Tìm theo tên khu A..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[305px] h-[44px] rounded-[20px] text-center font-bold text-black/25 bg-black/30 placeholder-black/25 placeholder:text-[16px] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-2">
        <div className="min-w-[700px] max-w-[1440px] mx-auto border border-black/30 rounded-sm">
          {/* Table Header */}
          <div className="grid grid-cols-3 font-bold text-[16px] border-b border-black/30 bg-black/30 h-[48px]">
            <div className="px-4 flex items-center">Tên khu vực</div>
            <div className="px-4 flex items-center">Chỉnh sửa vị trí</div>
            <div className="px-4 flex items-center">Xem / Tùy chọn</div>
          </div>

          {/* Data Rows */}
          {isLoading ? (
            Array(3).fill().map((_, idx) => (
              <div key={idx} className="grid grid-cols-3 h-[48px] items-center border-b border-black/10 animate-pulse-fast">
                <div className="px-4"><div className="h-4 bg-gray-300 rounded w-2/3" /></div>
                <div className="px-4"><div className="h-4 bg-gray-300 rounded w-4/5" /></div>
                <div className="px-4"><div className="h-4 bg-gray-300 rounded w-3/5" /></div>
              </div>
            ))
          ) : filteredAreas.length === 0 ? (
            <div className="text-center py-6 text-gray-500">Không có khu vực nào</div>
          ) : (
            filteredAreas.map((area) => (
              <div
                key={area._id}
                className="grid grid-cols-3 h-[48px] items-center border-b border-black/10 hover:bg-gray-100 text-sm relative"
              >
                <div className="px-4 truncate">
                  {editingId === area._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
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
                <div
                  onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                  className="px-4 text-blue-600 hover:underline cursor-pointer truncate"
                >
                  Đến khu vực
                </div>
                <div className="px-4 flex justify-end relative">
                  <button onClick={() => setOpenMenuId(openMenuId === area._id ? null : area._id)}>
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === area._id && (
                    <div className="absolute right-0 top-8 bg-white border rounded shadow z-10 text-sm w-40">
                      <button
                        onClick={() => {
                          setEditingId(area._id);
                          setEditName(area.name || '');
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        ✏️ Sửa tên
                      </button>
                      <button
                        onClick={() => {
                          navigate(ROUTES.POST_MAP(area._id));
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        🔧 Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDeleteArea(area._id);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        🗑 Xoá
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