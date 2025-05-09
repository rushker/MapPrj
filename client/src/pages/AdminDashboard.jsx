// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllMapAreas,
  deleteMapArea,
} from '../services/mapAreaService';

export default function AdminDashboard() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all draft areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const { data } = await getAllMapAreas();
        setAreas(data);
      } catch (err) {
        console.error('Failed to fetch map areas:', err);
        setError('Không thể tải danh sách khu vực.');
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // Delete a draft area
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa khu vực này?')) return;
    try {
      await deleteMapArea(id);
      setAreas((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Xóa khu vực thất bại.');
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Đang tải...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Bảng điều khiển MapArea</h1>
      <button
        onClick={() => navigate('/basemap')}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tạo khu vực mới
      </button>
      {areas.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có khu vực nào.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Marker</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {area.name || 'Untitled Area'}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(area.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-2">
                    {area.markers?.length ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    {area.isFinalized ? (
                      <span className="text-green-600">Đã hoàn thiện</span>
                    ) : (
                      <span className="text-orange-600">Chưa hoàn thiện</span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/edit/${area._id}`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(area._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
