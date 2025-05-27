// src/pages/ManagerPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ROUTES } from '../routes';
import {
  getAllProjects,
  createProject,
  deleteProject,
} from '../services/projects';
import {
  getAreasByProject,
  createArea,
  deleteArea,
} from '../services/areas';

const ManagerPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [areas, setAreas] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  const navigate = useNavigate();

  // 1. Fetch projects, ensure array reset on error
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getAllProjects();
        // API might return { success, data } or array directly
        const list = result.data ?? result;
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setProjects([]);
        toast.error('Lỗi khi tải danh sách project');
      }
    };
    fetchProjects();
  }, []);

  // 2. Select project and fetch areas
  const handleSelectProject = async (projectId) => {
    setSelectedProjectId(projectId);
    setAreas([]);
    try {
      const result = await getAreasByProject(projectId);
      const list = result.data ?? result;
      setAreas(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setAreas([]);
      toast.error('Lỗi khi tải danh sách khu vực');
    }
  };

  // 3. Create project only updates list, no navigation
  const handleCreateProject = async () => {
    const name = newProjectName.trim();
    if (!name) return;
    try {
      const result = await createProject({ name });
      const newProject = result.data ?? result;
      setProjects((prev) => [...prev, newProject]);
      setNewProjectName('');
      toast.success('Tạo project thành công');
    } catch (err) {
      console.error(err);
      toast.error('Không thể tạo project');
    }
  };

  // 4. Delete project with stopPropagation
  const handleDeleteProject = async (projectId, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!window.confirm('Bạn có chắc muốn xoá project này?')) return;
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
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

  // 5. Create new area on user action
  const handleCreateArea = async () => {
    if (!selectedProjectId) return;
    try {
      const result = await createArea(selectedProjectId, {
        name: '',
        type: 'khuA',
        polygon: { coordinates: [] },
      });
      const newArea = result.data ?? result;
      navigate(ROUTES.POST_MAP(selectedProjectId, newArea._id));
    } catch (err) {
      console.error(err);
      toast.error('Không thể tạo khu vực');
    }
  };

  // 6. Delete area
  const handleDeleteArea = async (areaId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Xác nhận xoá khu vực này?')) return;
    try {
      await deleteArea(selectedProjectId, areaId);
      setAreas((prev) => prev.filter((a) => a._id !== areaId));
      toast.success('Đã xoá khu vực');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xoá khu vực');
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
            <h2 className="text-xl font-semibold mb-3">Các khu vực</h2>
            <button
              onClick={handleCreateArea}
              className="mb-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Tạo khu vực mới
            </button>

            {areas.map((area) => (
              <div
                key={area._id}
                className="p-3 border rounded mb-2 bg-gray-50 flex justify-between items-center"
              >
                <span
                  onClick={() => navigate(ROUTES.POST_MAP(selectedProjectId, area._id))}
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {area.name || 'Khu chưa đặt tên'}
                </span>
                <button
                  onClick={(e) => handleDeleteArea(area._id, e)}
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
