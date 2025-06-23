// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { getAllAreas, deleteArea, updateArea } from '../services/areas';
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
    async function fetchAreas() {
      setIsLoading(true);
      try {
        const { data } = await getAllAreas();
        setAreas(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Lỗi khi tải danh sách khu vực');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAreas();
  }, []);

  
  const handleCreateArea = () => {
    navigate('/areas/edit');
  };


  const handleDeleteArea = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khu vực này?')) return;
    try {
      await deleteArea(id);
      setAreas(prev => prev.filter(a => a._id !== id));
      if (id === tempAreaId) clearAreaId();
      toast.success('Đã xóa khu vực');
    } catch {
      toast.error('Lỗi xóa khu vực');
    }
  };

  const handleEditName = async (id) => {
    try {
      await updateArea(id, { name: editName });
      setAreas(prev => prev.map(a => a._id === id ? { ...a, name: editName } : a));
      toast.success('Đổi tên thành công');
      setEditingId(null);
    } catch {
      toast.error('Lỗi đổi tên');
    }
  };

  const filtered = areas.filter(a => a.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="w-full h-[72px] bg-black bg-opacity-30 border-b border-black border-opacity-30">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4">
          <h1 className="text-[20px] font-semibold text-white">Quản lý bản đồ</h1>
          <button
            onClick={handleCreateArea}
            type="button"
            className="flex items-center gap-[15px] bg-[#2A5D87] px-4 py-2 rounded-[10px] text-white text-sm"
          >
            <span className="order-1">Tạo bản đồ</span>
            <Plus size={16} className="order-2" />
          </button>
        </div>
      </header>


      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="w-[305px] h-[44px] mx-auto bg-black bg-opacity-30 rounded-[20px] flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-full bg-transparent placeholder-white placeholder-opacity-25 text-white font-bold text-[16px] text-center outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Desktop Table */}
        <div className="hidden md:block border border-black border-opacity-30 rounded-lg">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] bg-black bg-opacity-5 text-[16px] font-bold text-gray-900 border-b border-black border-opacity-30">
            <div className="px-4 py-3">Tên khu vực</div>
            <div className="px-4 py-3">Chỉnh sửa vị trí</div>
            <div className="px-4 py-3">Xem</div>
            <div className="px-4 py-3 text-right">Tùy chọn</div>
          </div>
          {isLoading ? (
            Array(4).fill().map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_1fr_auto] border-b border-black border-opacity-30 animate-pulse"
              >
                <div className="h-6 bg-black bg-opacity-10 m-4 rounded" />
                <div className="h-6 bg-black bg-opacity-10 m-4 rounded" />
                <div className="h-6 bg-black bg-opacity-10 m-4 rounded" />
                <div className="h-6 bg-black bg-opacity-10 m-4 rounded justify-self-end" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-500">Không có khu vực nào</div>
          ) : (
            filtered.map(area => (
              <div
                key={area._id}
                className="grid grid-cols-[1fr_1fr_1fr_auto] border-b border-black border-opacity-30 hover:bg-black hover:bg-opacity-5 transition relative"
              >
                <div className="px-4 py-3 truncate">{area.name}</div>
                <div
                  onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                  className="px-4 py-3 cursor-pointer text-blue-600 hover:underline truncate"
                >Chỉnh sửa</div>
                <div
                  onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                  className="px-4 py-3 cursor-pointer text-blue-600 hover:underline truncate"
                >Xem</div>
                <div className="px-4 py-3 text-right relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === area._id ? null : area._id)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === area._id && (
                    <div className="absolute right-4 mt-2 bg-white border border-black border-opacity-30 rounded-lg shadow-lg z-10 w-36">
                      <button
                        onClick={() => { setEditingId(area._id); setEditName(area.name); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        <Pencil size={16} /> Đổi tên
                      </button>
                      <button
                        onClick={() => { navigate(ROUTES.POST_MAP(area._id)); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => { handleDeleteArea(area._id); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
                      >
                        <Trash2 size={16} /> Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            Array(4).fill().map((_, idx) => (
              <div key={idx} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-6 text-gray-500">
              Không có khu vực nào
            </div>
          ) : (
            filtered.map(area => (
              <div
                key={area._id}
                className="border border-black border-opacity-30 rounded-lg p-4 shadow-sm hover:shadow-md transition relative"
              >
                <h3 className="text-[16px] font-semibold truncate">
                  {area.name}
                </h3>
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => navigate(ROUTES.POST_MAP(area._id))}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.VIEW_MAP(area._id))}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Xem
                  </button>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === area._id ? null : area._id)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === area._id && (
                    <div className="absolute right-0 mt-2 bg-white border border-black border-opacity-30 rounded-lg shadow-lg z-10 w-36">
                      <button
                        onClick={() => { setEditingId(area._id); setEditName(area.name); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        <Pencil size={16} /> Đổi tên
                      </button>
                      <button
                        onClick={() => { navigate(ROUTES.POST_MAP(area._id)); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => { handleDeleteArea(area._id); setOpenMenuId(null); }}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
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
                        onChange={e => setEditName(e.target.value)}
                        className="w-full border px-2 py-1 rounded text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditName(area._id)} className="text-green-600 text-sm hover:underline">Lưu</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm hover:underline">Hủy</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;
