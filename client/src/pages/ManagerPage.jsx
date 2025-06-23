// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllAreas, deleteArea } from '../services/areas';
import { ROUTES } from '../routes';
import { useTempAreaId } from '../hooks/local/useTempAreaId';
import { Plus } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

const ManagerPage = () => {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
    try {
      await deleteArea(areaId);
      setAreas((prev) => prev.filter((a) => a._id !== areaId));
      if (areaId === tempAreaId) clearAreaId();
      toast.success('Đã xoá khu vực');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xoá khu vực');
    } finally {
      setConfirmDeleteId(null);
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
          <h1 className="text-lg font-semibold">Quản lý bản đồ</h1>
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
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[305px] h-[44px] rounded-[20px] text-center font-bold text-black/25 bg-black/30 placeholder-black/25 placeholder:text-[16px] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-2">
        <div className="min-w-[700px] max-w-[1440px] mx-auto border border-black/30 rounded-sm">
          {/* Table Header */}
          <div className="grid grid-cols-3 font-bold text-[16px] border-b border-black/30 bg-black/30 h-[48px] whitespace-nowrap">
            <div className="px-4 flex items-center">Tên khu vực</div>
            <div className="px-4 flex items-center col-span-1">Đường dẫn chỉnh sửa</div>
            <div className="px-4 flex items-center col-span-1">Trang xem</div>
          </div>

          {/* Skeleton or Data */}
          {isLoading ? (
            Array(3).fill().map((_, idx) => (
              <div key={idx} className="grid grid-cols-3 h-[48px] items-center border-b border-black/10 animate-pulse-fast">
                <div className="px-4">
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                </div>
                <div className="px-4">
                  <div className="h-4 bg-gray-300 rounded w-4/5" />
                </div>
                <div className="px-4">
                  <div className="h-4 bg-gray-300 rounded w-3/5" />
                </div>
              </div>
            ))
          ) : filteredAreas.length === 0 ? (
            <div className="text-center py-6 text-gray-500">Không có khu vực nào</div>
          ) : (
            filteredAreas.map((area) => (
              <div
                key={area._id}
                className="grid grid-cols-3 h-[48px] items-center border-b border-black/10 hover:bg-gray-100 text-sm"
              >
                <div className="px-4 truncate">
                  {area.name || 'Khu chưa đặt tên'}
                </div>
                <div
                  onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                  className="px-4 text-blue-600 hover:underline cursor-pointer truncate"
                >
                  (đến vị trí rectangle)
                </div>
                <div className="px-4 flex items-center gap-3 text-blue-600 whitespace-nowrap">
                  <span
                    onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                    className="hover:underline cursor-pointer truncate"
                  >
                    /areas/{area._id}/view
                  </span>
                  <button
                    onClick={() => setConfirmDeleteId(area._id)}
                    className="text-red-500 text-xs hover:underline ml-auto"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xoá khu vực này không?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => handleDeleteArea(confirmDeleteId)}
      />
    </div>
  );
};

export default ManagerPage;
