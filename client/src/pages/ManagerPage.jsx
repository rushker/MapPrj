// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getAllProjects,
  createProject,
  deleteProject,
} from '../services/projects';
import {
  getAreasByProject,
  deleteArea,
} from '../services/areas';

const ManagerPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [areas, setAreas] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách project');
    }
  };

  const handleSelectProject = async (projectId) => {
    setSelectedProjectId(projectId);
    setAreas([]); // reset area list ngay khi chọn project mới
    try {
      const data = await getAreasByProject(projectId);
      setAreas(data);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách khu vực');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const newProject = await createProject({ name: newProjectName });
      setProjects([...projects, newProject]);
      setNewProjectName('');
      toast.success('Tạo project thành công');
    } catch (err) {
      console.error(err);
      toast.error('Không thể tạo project');
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!window.confirm('Bạn có chắc muốn xoá project này?')) return;
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p._id !== projectId));
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
        setAreas([]);
      }
      toast.success('Đã xoá project');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xoá project');
    }
  };

  const handleDeleteArea = async (areaId) => {
    if (!selectedProjectId) return; // tránh lỗi nếu chưa chọn project
    if (!window.confirm('Xác nhận xoá khu vực này?')) return;
    try {
      await deleteArea(selectedProjectId, areaId);
      setAreas(areas.filter((a) => a._id !== areaId));
      toast.success('Đã xoá area');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xoá area');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quản lý Dự án</h1>

      {/* Tạo project */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Tên project mới"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleCreateProject}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tạo
        </button>
      </div>

      {/* Danh sách projects + areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project List */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Danh sách Project</h2>
          {projects.map((project) => (
            <div
              key={project._id}
              className={`p-3 border rounded mb-2 cursor-pointer ${
                selectedProjectId === project._id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelectProject(project._id)}
            >
              <div className="flex justify-between">
                <span>{project.name}</span>
                <button
                  onClick={(e) => handleDeleteProject(project._id, e)}
                  className="text-red-500 hover:underline"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Area List */}
        {selectedProjectId && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Các khu vực (Area)</h2>
            {areas.length === 0 && (
              <p className="text-gray-500 italic">Chưa có khu vực nào</p>
            )}
            {areas.map((area) => (
              <div
                key={area._id}
                className="p-3 border rounded mb-2 bg-gray-50 flex justify-between items-center"
              >
                <span
                  onClick={() =>
                    navigate(`/post/${selectedProjectId}/${area._id}`)
                  }
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {area.name || 'Khu chưa đặt tên'}
                </span>
                <button
                  onClick={() => handleDeleteArea(area._id)}
                  className="text-red-500 hover:underline"
                >
                  Xoá
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPage;


