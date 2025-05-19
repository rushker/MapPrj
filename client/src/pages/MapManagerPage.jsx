// src/pages/MapManagerPage.jsx
import { useEffect, useState } from "react";
import { getAllAreas, deleteArea } from "../../services/areaService";
import { deleteEntity } from "../../services/entityService";

export default function MapManagerPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await getAllAreas();
      setAreas(data);
    } catch (err) {
      console.error("Error fetching areas:", err);
      setError("Không thể tải danh sách khu vực.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa Khu A này?")) return;
    try {
      await deleteArea(id);
      setAreas((prev) => prev.filter((area) => area._id !== id));
    } catch (err) {
      console.error("Lỗi xóa khu vực:", err);
      alert("Không thể xóa khu vực.");
    }
  };

  const handleDeleteEntity = async (areaId, entityId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa Marker này?")) return;
    try {
      await deleteEntity(areaId, entityId);
      await fetchAreas(); // reload toàn bộ nếu cần cập nhật Marker trong Area
    } catch (err) {
      console.error("Lỗi xóa marker:", err);
      alert("Không thể xóa marker.");
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // src/pages/MapManagerPage.jsx (chỉ phần trong return JSX)
return (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Quản lý Khu A</h1>

    {loading && (
      <div className="animate-pulse text-gray-500">Đang tải dữ liệu...</div>
    )}

    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
        {error}
      </div>
    )}

    <div className="grid gap-6">
      {areas.map((area) => (
        <div
          key={area._id}
          className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {area.name || "Không tên"}
              </h2>
              <p className="text-sm text-gray-500">ID: {area._id}</p>
            </div>
            <button
              onClick={() => handleDeleteArea(area._id)}
              className="text-red-500 hover:underline text-sm"
            >
              Xoá Khu A
            </button>
          </div>

          {area.markers?.length > 0 ? (
            <div className="mt-2">
              <h3 className="font-medium text-gray-700 mb-1">Markers:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {area.markers.map((marker) => (
                  <li
                    key={marker._id}
                    className="flex justify-between items-center border-b pb-1"
                  >
                    <span>
                      📍 {marker.name || "Không tên"} ({marker.type})
                    </span>
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={() =>
                        handleDeleteEntity(area._id, marker._id)
                      }
                    >
                      Xoá
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Chưa có marker nào.</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

}
